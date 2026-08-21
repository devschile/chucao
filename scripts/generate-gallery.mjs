/**
 * Generates the docs-site component gallery from `gallery-data.mjs` and the
 * components found under `src/components/*`.
 *
 * Outputs:
 *   - `docs-site/index.html` — two marker-delimited regions: the
 *     `<div class="comp">` blocks inside `<section id="componentes">`
 *     (GALLERY:START/END) and the sidebar's component list (SIDEBAR:START/END).
 *     Both come from the same `gallery` array in one pass, so the navigation
 *     cannot drift from the gallery it indexes.
 *   - `docs-site/assets/js/app.js` — a per-component `whenDefined` gate and
 *     event-log wiring derived from each entry's `bindings`/`init`.
 *
 * The sidebar is emitted as real markup rather than built at runtime so the
 * navigation still works with JavaScript disabled. Hand-written interaction
 * code lives in `docs-site/assets/js/nav.js`, which this script never touches.
 *
 * Run with `pnpm run generate:gallery`.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { format, resolveConfig } from 'prettier';
import { gallery } from './gallery-data.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = join(root, 'src', 'components');
const indexHtmlPath = join(root, 'docs-site', 'index.html');
const appJsPath = join(root, 'docs-site', 'assets', 'js', 'app.js');

const tagRe = /(<\/?[a-z][a-z0-9-]*)([^>]*)(>)/gi;
const attrRe = /([a-z][a-z0-9-]*)(?:=("[^"]*"|'[^']*'))?/g;

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function stripHtml(value) {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function escapeAttr(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightAttrs(attrs) {
  return attrs.replace(attrRe, (full, name, value) => {
    const rendered = `<span class="a">${name}</span>`;
    return value ? `${rendered}=${escapeHtml(value)}` : rendered;
  });
}

function highlightLine(line) {
  return line.replace(tagRe, (full, tag, attrs, close) => {
    const open = `<span class="t">${escapeHtml(tag)}</span>`;
    return `${open}${highlightAttrs(attrs)}<span class="t">${escapeHtml(close)}</span>`;
  });
}

function codeSnippet(demos) {
  return demos
    .filter(demo => !demo.includes('class="event-log"'))
    .map(highlightLine)
    .join('\n');
}

function compBlock(entry) {
  const { tag } = entry;
  return [
    `        <div class="comp" id="${tag}" tabindex="-1">`,
    '          <div class="comp-head">',
    `            <h3>${tag}</h3>`,
    `            <span class="tag">@devschile/chucao/${tag}</span>`,
    '          </div>',
    `          <p class="comp-desc">${entry.description}</p>`,
    '          <div class="comp-demo">',
    ...entry.demos.map(demo => `            ${demo}`),
    '          </div>',
    `          <pre class="comp-code"><code>${codeSnippet(entry.demos)}</code></pre>`,
    '        </div>',
  ].join('\n');
}

function generateGalleryHtml() {
  return gallery.map(compBlock).join('\n\n');
}

function sidebarItem(entry) {
  const { tag } = entry;
  const searchable = escapeAttr(stripHtml(entry.description));
  return [`          <li class="side-item" data-name="${tag}" data-desc="${searchable}">`, `            <a class="side-link" href="#${tag}">${tag}</a>`, '          </li>'].join(
    '\n',
  );
}

function generateSidebarHtml() {
  return gallery.map(sidebarItem).join('\n');
}

function generateAppJs() {
  const lines = [
    'function bind(id, events) {',
    '  const el = document.getElementById(id);',
    '  const out = document.getElementById(`${id}-log`);',
    '  if (!el || !out) {',
    '    return;',
    '  }',
    '  events.forEach(({ name, format }) => {',
    `    el.addEventListener(name, ev => {`,
    '      out.textContent = format(ev);',
    '    });',
    '  });',
    '}',
  ];
  // One `whenDefined` per component rather than a single `Promise.all` gate:
  // `whenDefined` never resolves for an element the loaded library does not
  // define, so a global gate lets one unpublished component silently stop every
  // other demo from being seeded.
  for (const entry of gallery) {
    const bindings = entry.bindings ?? [];
    if (!entry.init && bindings.length === 0) {
      continue;
    }
    lines.push('', `customElements.whenDefined('${entry.tag}').then(() => {`);
    if (entry.init) {
      lines.push(`  ${entry.init.replace(/\n/g, '\n  ')}`);
    }
    for (const binding of bindings) {
      lines.push(`  bind('${binding.id}', [{ name: '${binding.event}', format: ${binding.format} }]);`);
    }
    lines.push('});');
  }
  return `${lines.join('\n')}\n`;
}

function replaceBetweenMarkers(html, name, content) {
  const start = `<!-- ${name}:START -->`;
  const end = `<!-- ${name}:END -->`;
  const startIdx = html.indexOf(start);
  const endIdx = html.indexOf(end);
  const missing = startIdx === -1 || endIdx === -1;
  if (missing) {
    throw new Error(`Missing ${start} / ${end} markers in docs-site/index.html`);
  }
  const head = html.slice(0, startIdx + start.length);
  const tail = html.slice(endIdx);
  return `${head}\n${content}\n${tail}`;
}

async function writeGenerated(path, content, parser) {
  mkdirSync(dirname(path), { recursive: true });
  const options = await resolveConfig(path);
  const formatted = await format(content, { parser, ...options });
  writeFileSync(path, formatted);
}

const validTagRe = /^ch-[a-z][a-z0-9-]*$/;

function validateCoverage(tagsOnDisk) {
  const galleryTags = gallery.map(entry => entry.tag);
  const missing = tagsOnDisk.filter(tag => !galleryTags.includes(tag));
  const unknown = galleryTags.filter(tag => !tagsOnDisk.includes(tag));
  const malformed = galleryTags.filter(tag => !validTagRe.test(tag));
  const coverage = { missing, unknown, malformed };
  const incomplete = missing.length || unknown.length || malformed.length;
  if (incomplete) {
    if (missing.length) {
      console.error(`[gallery] Components without gallery data: ${missing.join(', ')}`);
    }
    if (unknown.length) {
      console.error(`[gallery] Gallery entries without a component folder: ${unknown.join(', ')}`);
    }
    if (malformed.length) {
      console.error(`[gallery] Tags unusable as a URL fragment: ${malformed.join(', ')}`);
    }
  }
  return coverage;
}

async function main() {
  const tagsOnDisk = readdirSync(componentsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name.startsWith('ch-'))
    .map(entry => entry.name);

  const coverage = validateCoverage(tagsOnDisk);
  if (coverage.missing.length || coverage.unknown.length || coverage.malformed.length) {
    const exitCode = 1;
    process.exit(exitCode);
  }

  const indexHtml = readFileSync(indexHtmlPath, 'utf8');
  const withGallery = replaceBetweenMarkers(indexHtml, 'GALLERY', generateGalleryHtml());
  const newIndexHtml = replaceBetweenMarkers(withGallery, 'SIDEBAR', generateSidebarHtml());
  await writeGenerated(indexHtmlPath, newIndexHtml, 'html');
  await writeGenerated(appJsPath, generateAppJs(), 'babel');

  console.log(`[gallery] Generated ${gallery.length} component blocks in docs-site/`);
}

main();
