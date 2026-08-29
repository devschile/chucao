/**
 * Fails when the local build carries components or props the released CDN
 * bundle does not.
 *
 * The docs-site gallery documents every component on the next `main` push
 * (`.github/workflows/docs.yml`), but the site loads the library from the CDN
 * `chucao/latest/` prefix, which only updates on a release. Publishing docs for
 * a component or prop the release does not carry yields a broken section.
 *
 * Both the local `dist/chucao/chucao.esm.js` and the released bundle embed a
 * component manifest — nested arrays like
 * `["ch-alert",{variant:[1],dismissLabel:[1,"dismiss-label"]}]` — so the
 * comparison is manifest vs. manifest: no demo markup, no false positives from
 * `id`/`class`/`style`/`slot`.
 *
 * Usage (run in CI before publishing the docs site):
 *
 *   pnpm run check:released
 *
 * Options:
 *
 *   --local <path>     local bundle (default dist/chucao/chucao.esm.js)
 *   --released <url>   released bundle (default https://static.devschile.cl/chucao/latest/chucao.esm.js)
 *
 * A URL is fetched; a path is read from disk, so the check also works offline
 * against a previous release tarball.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, join, resolve } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const DEFAULT_LOCAL = join(root, 'dist', 'chucao', 'chucao.esm.js');
const DEFAULT_RELEASED = 'https://static.devschile.cl/chucao/latest/chucao.esm.js';

const entryRe = /"ch-[a-z][a-z0-9-]*"(?:,\{[^{}]*\})?/g;
const propRe = /([A-Za-z][A-Za-z0-9]*):\[/g;

function parseManifest(bundle) {
  const manifest = new Map();
  for (const match of bundle.match(entryRe) ?? []) {
    const tag = match.slice(1, match.indexOf('"', 1));
    const props = new Set();
    const propsStart = match.indexOf('{');
    if (propsStart !== -1) {
      for (const propMatch of match.slice(propsStart).matchAll(propRe)) {
        props.add(propMatch[1]);
      }
    }
    manifest.set(tag, props);
  }
  return manifest;
}

function readBundle(target) {
  if (/^https?:\/\//.test(target)) {
    return fetch(target).then(response => {
      if (!response.ok) {
        throw new Error(`Could not fetch ${target} (HTTP ${response.status})`);
      }
      return response.text();
    });
  }
  const path = isAbsolute(target) ? target : resolve(target);
  return readFileSync(path, 'utf8');
}

function parseArgs(argv) {
  const args = { local: DEFAULT_LOCAL, released: DEFAULT_RELEASED };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--local' && argv[i + 1]) {
      args.local = argv[i + 1];
      i++;
    } else if (argv[i] === '--released' && argv[i + 1]) {
      args.released = argv[i + 1];
      i++;
    }
  }
  return args;
}

async function main() {
  const { local: localTarget, released: releasedTarget } = parseArgs(process.argv.slice(2));

  const [localBundle, releasedBundle] = await Promise.all([readBundle(localTarget), readBundle(releasedTarget)]);
  const local = parseManifest(localBundle);
  const released = parseManifest(releasedBundle);

  const missingComponents = [];
  const missingProps = [];
  for (const [tag, props] of local) {
    const releasedProps = released.get(tag);
    if (!releasedProps) {
      missingComponents.push(tag);
      continue;
    }
    for (const prop of props) {
      if (!releasedProps.has(prop)) {
        missingProps.push(`${tag} \`${prop}\``);
      }
    }
  }

  if (missingComponents.length === 0 && missingProps.length === 0) {
    console.log(`[check-released] OK — ${local.size} components, all released.`);
    return;
  }

  console.error(`[check-released] The docs gallery would reference components or props the released bundle does not carry.`);
  if (missingComponents.length) {
    console.error(`[check-released] Not in the released bundle: ${missingComponents.join(', ')}`);
  }
  if (missingProps.length) {
    console.error(`[check-released] New props missing from the release: ${missingProps.join(', ')}`);
  }
  console.error(`[check-released] Cut a release (pnpm run release) so the CDN chucao/latest/ catches up, then re-run this deploy.`);
  process.exit(1);
}

main();
