/**
 * Rewrites the version shown in the docs-site install row to the version in
 * package.json.
 *
 * The committed `docs-site/index.html` pins the last released version so the
 * repo and the local preview are correct, but the published page must name the
 * version that actually carries all the components it documents. The deploy
 * (`.github/workflows/docs.yml`) runs this against the assembled publish copy
 * right before uploading, so the version is stamped at generation time.
 *
 * Usage:
 *
 *   node scripts/stamp-version.mjs <path-to-index.html>
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;

const indexPath = resolve(process.argv[2]);
const html = readFileSync(indexPath, 'utf8');

if (!html.includes('class="install-version"')) {
  throw new Error('No <span class="install-version"> found in the given index.html');
}

const next = html.replaceAll(/(class="install-version">)[^<]*(<\/)/g, `$1${version}$2`);
writeFileSync(indexPath, next);
console.log(`[stamp-version] ${indexPath} now shows version ${version}`);
