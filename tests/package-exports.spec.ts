import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, it, expect } from '@stencil/vitest';

const root = resolve(import.meta.dirname, '..');
const pkg = JSON.parse(await import('node:fs').then(fs => fs.readFileSync(join(root, 'package.json'), 'utf8')));

function componentTags() {
  const dir = join(root, 'src/components');
  return readdirSync(dir)
    .filter(name => statSync(join(dir, name)).isDirectory())
    .toSorted();
}

describe('package exports', () => {
  it('exposes a subpath export for every component in src/components', () => {
    const missing = componentTags().filter(tag => !pkg.exports[`./${tag}`]);

    expect(missing).toEqual([]);
  });

  it('points every component subpath at a file the published tarball actually carries', () => {
    const broken = Object.entries(pkg.exports)
      .filter(([key]) => key.startsWith('./ch-'))
      .flatMap(([key, target]) =>
        ['import', 'types'].flatMap(field => {
          const path = target[field];
          if (!path) {
            return [`${key}: missing "${field}"`];
          }
          return existsSync(join(root, path)) ? [] : [`${key}: ${field} -> ${path} does not exist`];
        }),
      );

    expect(broken).toEqual([]);
  });

  it('publishes the generated files every subpath points at', () => {
    const { files } = pkg;
    for (const dir of ['dist/', 'dist-react/', 'dist-vue/', 'hydrate/', 'loader/']) {
      expect(files).toContain(dir);
    }
  });

  it('points every require target at a CommonJS file the tarball actually carries', () => {
    const broken = Object.entries(pkg.exports).flatMap(([key, target]) => {
      const path = target.require;
      if (!path || path.includes('*')) {
        return [];
      }
      return existsSync(join(root, path)) ? [] : [`${key}: require -> ${path} does not exist`];
    });

    expect(broken).toEqual([]);
  });

  it('keeps the bootstrap and framework entry points exported', () => {
    for (const entry of ['.', './loader', './hydrate', './react', './vue', './dist/components']) {
      expect(pkg.exports[entry]).toBeDefined();
    }
  });

  it('does not export a subpath whose component folder was removed', () => {
    const tags = new Set(componentTags());
    const stale = Object.keys(pkg.exports).filter(key => key.startsWith('./ch-') && !tags.has(key.slice(2)));

    expect(stale).toEqual([]);
  });
});
