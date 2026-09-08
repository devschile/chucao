/**
 * Fails when the AI-facing surfaces reference something that does not exist.
 *
 * `llms.txt` and `docs/ai.md` tell agents which components and tokens are real.
 * When they drift, an agent is told to emit a tag or a token that was renamed or
 * never existed — the most common hallucination source there is, because the
 * agent is being obedient rather than creative. `llms.txt` is generated, but its
 * link shapes are hardcoded in the generator and `docs/ai.md` is written by
 * hand, so neither is safe by construction.
 *
 * Checks:
 *   1. Every `llms.txt` link resolves to a file the docs workflow publishes.
 *      Given `--publish-dir=<path>` it resolves against that assembled tree
 *      instead, which is the ground truth; without it the check relies on this
 *      script's own model of what the workflow copies, so the docs workflow
 *      passes the flag and a pull request gets the cheaper approximation.
 *   2. The `llms.txt` component list matches `src/components/` exactly.
 *   3. The `docs/ai.md` allow-list table matches `src/components/` exactly,
 *      and the component count stated in its prose agrees.
 *   4. Every token referenced by `docs/ai.md` exists in the generated tokens.
 *
 * The `DON'T` section of `docs/ai.md` deliberately names tags and values that do
 * not exist, so it is excluded from 3 and 4 — checking it would report the
 * examples as defects.
 *
 * Usage:
 *
 *   pnpm run check:ai
 *   node scripts/check-ai.mjs --publish-dir=publish
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://devschile.github.io/chucao';

// Placeholders that stand in for a real name in prose rather than naming one.
const TOKEN_PLACEHOLDERS = new Set(['--token-name']);

const publishDirArg = process.argv.find(arg => arg.startsWith('--publish-dir='));
const publishDirRaw = publishDirArg ? publishDirArg.slice('--publish-dir='.length) : null;
const publishDir = publishDirRaw === null ? null : isAbsolute(publishDirRaw) ? publishDirRaw : join(root, publishDirRaw);

const problems = [];

function fail(surface, message) {
  problems.push({ surface, message });
}

function realComponents() {
  return readdirSync(join(root, 'src', 'components'), { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name.startsWith('ch-'))
    .map(entry => entry.name)
    .sort();
}

function realTokens() {
  const css = readFileSync(join(root, 'src', 'tokens', 'tokens.css'), 'utf8');
  return new Set(Array.from(css.matchAll(/^\s*(--[a-z0-9-]+):/gm), match => match[1]));
}

/**
 * Maps a published URL back to the file the docs workflow copies there. An
 * unrecognised shape is itself a failure: a new kind of link has to be taught
 * to this checker, otherwise it silently stops being covered.
 */
function sourceForUrl(url) {
  const path = url.slice(BASE_URL.length).replace(/^\//, '');
  if (path === 'README.md' || path === 'DESIGN.md' || path === 'CHANGELOG.md') {
    return path;
  }
  const component = path.match(/^components\/(ch-[a-z0-9-]+)\/$/);
  if (component) {
    return join('src', 'components', component[1], 'readme.md');
  }
  if (path === 'tokens/README.md') {
    return join('src', 'tokens', 'README.md');
  }
  const doc = path.match(/^docs\/([a-z0-9-]+\.md)$/);
  if (doc) {
    return join('docs', doc[1]);
  }
  return null;
}

/** Resolves a URL inside the assembled publish tree, allowing for index.html. */
function publishedPath(url) {
  const path = url.slice(BASE_URL.length).replace(/^\//, '');
  const target = join(publishDir, path);
  return existsSync(target) || existsSync(join(target, 'index.html')) || existsSync(join(target, 'readme.md'));
}

function checkLlmsLinks(llms) {
  const urls = Array.from(new Set(Array.from(llms.matchAll(/\((https:\/\/[^)]+)\)/g), match => match[1])));
  for (const url of urls) {
    if (!url.startsWith(BASE_URL)) {
      continue;
    }
    if (publishDir) {
      if (!publishedPath(url)) {
        fail('llms.txt', `link points at ${url}, which is not in the assembled publish directory`);
      }
      continue;
    }
    const source = sourceForUrl(url);
    if (source === null) {
      fail('llms.txt', `link shape is not known to check-ai, so nothing verifies it: ${url}`);
      continue;
    }
    if (!existsSync(join(root, source))) {
      fail('llms.txt', `link points at ${url}, but ${source} does not exist, so the docs workflow cannot publish it`);
    }
  }
  return urls.length;
}

function checkLlmsComponents(llms, components) {
  const listed = Array.from(new Set(Array.from(llms.matchAll(/\/components\/(ch-[a-z0-9-]+)\//g), match => match[1]))).sort();
  for (const tag of listed.filter(tag => !components.includes(tag))) {
    fail('llms.txt', `lists ${tag}, which is not a directory under src/components/`);
  }
  for (const tag of components.filter(tag => !listed.includes(tag))) {
    fail('llms.txt', `does not list ${tag}, so agents are not told it exists`);
  }
}

/** Everything before the `DON'T` section, which names unreal things on purpose. */
function prescriptivePart(ai) {
  const index = ai.search(/^#{2,3} DON'T\s*$/m);
  return index === -1 ? ai : ai.slice(0, index);
}

function checkAiAllowList(ai, components) {
  const listed = Array.from(new Set(Array.from(ai.matchAll(/^\|\s*`(ch-[a-z0-9-]+)`/gm), match => match[1]))).sort();
  if (listed.length === 0) {
    fail('docs/ai.md', 'no allow-list table found, so nothing constrains which tags an agent may emit');
    return;
  }
  for (const tag of listed.filter(tag => !components.includes(tag))) {
    fail('docs/ai.md', `allow-list contains ${tag}, which is not a directory under src/components/`);
  }
  for (const tag of components.filter(tag => !listed.includes(tag))) {
    fail('docs/ai.md', `allow-list is missing ${tag}, so an agent is told it does not exist`);
  }

  const stated = ai.match(/exposes exactly (\d+) components/);
  if (!stated) {
    fail('docs/ai.md', 'the allow-list no longer states a component count, so the prose cannot be checked against reality');
  } else if (Number(stated[1]) !== components.length) {
    fail('docs/ai.md', `says it exposes exactly ${stated[1]} components, but there are ${components.length}`);
  }
}

function checkAiTokens(ai, tokens) {
  const referenced = Array.from(new Set(Array.from(prescriptivePart(ai).matchAll(/var\((--[a-z0-9-]+)\)/g), match => match[1])));
  for (const token of referenced) {
    if (!TOKEN_PLACEHOLDERS.has(token) && !tokens.has(token)) {
      fail('docs/ai.md', `references var(${token}), which is not in the generated tokens`);
    }
  }
  return referenced.length;
}

const components = realComponents();
const tokens = realTokens();
const llms = readFileSync(join(root, 'llms.txt'), 'utf8');
const ai = readFileSync(join(root, 'docs', 'ai.md'), 'utf8');

const linkCount = checkLlmsLinks(llms);
checkLlmsComponents(llms, components);
checkAiAllowList(ai, components);
const tokenCount = checkAiTokens(ai, tokens);

if (problems.length > 0) {
  console.error('[check:ai] The AI surfaces reference things that do not exist:\n');
  for (const { surface, message } of problems) {
    console.error(`  ${surface}: ${message}`);
  }
  console.error('\nRegenerate with `pnpm run generate:llms`, or correct the surface by hand, and commit the result.');
  process.exit(1);
}

const against = publishDir ? 'the assembled publish directory' : 'the repository sources';
console.log(`[check:ai] ${linkCount} links, ${components.length} components and ${tokenCount} token references all resolve against ${against}`);
