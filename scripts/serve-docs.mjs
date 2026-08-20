/**
 * Serves the docs-site gallery against the LOCAL build.
 *
 * `docs-site/index.html` loads the library from the CDN
 * (`static.devschile.cl/chucao/latest/`), which is correct in production but
 * means the published site always shows the last release, never the working
 * tree — a component you just added is invisible until a release ships.
 *
 * This script assembles a throwaway preview directory instead of editing
 * `docs-site/`, so the committed HTML keeps pointing at the CDN and there is no
 * dev-only variant anyone could commit by accident:
 *
 *   .docs-preview/          copy of docs-site/
 *   .docs-preview/build/    copy of www/build/ (the local Stencil output)
 *
 * The CDN URLs for the stylesheet, the module and the self-hosted fonts are
 * rewritten to point at that local copy, so the preview also works offline.
 *
 * Run via `pnpm run docs:serve`, which builds and regenerates the gallery first.
 */

import { createServer } from 'node:http';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const PREVIEW_DIR = resolve('.docs-preview');
const DOCS_SITE_DIR = resolve('docs-site');
const BUILD_DIR = resolve('www/build');
const PORT = Number(process.env.PORT ?? 4173);

const CDN_ASSETS = 'https://static.devschile.cl/chucao/latest/';
const CDN_FONTS = 'https://static.devschile.cl/chucao/fonts/';

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
};

const BANNER = `
    <div class="preview-banner">
      preview local — build desde <code>src/</code>, no el CDN
    </div>
    <style>
      .preview-banner {
        position: fixed;
        inset: auto auto var(--spacing-2xl, 1rem) var(--spacing-2xl, 1rem);
        z-index: 999;
        padding: var(--spacing-sm, 0.35rem) var(--spacing-xl, 0.8rem);
        border: 1px solid var(--color-status-warning, #f87171);
        border-radius: var(--radius-pill, 999px);
        background: var(--color-status-warning-background, rgba(248, 113, 113, 0.15));
        color: var(--color-status-warning, #f87171);
        font-family: var(--typography-heading, monospace);
        font-size: var(--typography-size-xs, 0.68rem);
        letter-spacing: 0.04em;
      }
      .preview-banner code {
        background: none;
        color: inherit;
      }
    </style>
`;

function assemble() {
  if (!existsSync(BUILD_DIR)) {
    throw new Error(`No local build found at www/build. Run \`pnpm build\` first.`);
  }

  rmSync(PREVIEW_DIR, { recursive: true, force: true });
  mkdirSync(PREVIEW_DIR, { recursive: true });
  cpSync(DOCS_SITE_DIR, PREVIEW_DIR, { recursive: true });
  cpSync(BUILD_DIR, join(PREVIEW_DIR, 'build'), { recursive: true });

  // Point the page at the local build instead of the CDN.
  const indexPath = join(PREVIEW_DIR, 'index.html');
  let html = readFileSync(indexPath, 'utf8');
  const before = html;
  html = html.replaceAll(CDN_ASSETS, '/build/');
  html = html.replaceAll('cargados desde el CDN (<code>static.devschile.cl/chucao/latest/</code>)', 'cargados desde el build local (<code>www/build/</code>)');
  if (html === before) {
    throw new Error('Expected CDN asset URLs in docs-site/index.html; found none. Has the markup changed?');
  }
  html = html.replace('</body>', `${BANNER}  </body>`);
  writeFileSync(indexPath, html);

  // The generated stylesheet points at CDN-hosted fonts even in a local build;
  // rewrite them so the preview needs no network.
  const cssPath = join(PREVIEW_DIR, 'build', 'chucao.css');
  if (existsSync(cssPath)) {
    const css = readFileSync(cssPath, 'utf8');
    writeFileSync(cssPath, css.replaceAll(CDN_FONTS, '/build/fonts/'));
  }
}

function resolveRequestPath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const relative = normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const candidate = join(PREVIEW_DIR, relative);
  if (!candidate.startsWith(PREVIEW_DIR)) {
    return null;
  }
  if (existsSync(candidate) && statSync(candidate).isDirectory()) {
    return join(candidate, 'index.html');
  }
  return candidate;
}

function serve() {
  const server = createServer((req, res) => {
    const filePath = resolveRequestPath(req.url ?? '/');
    if (!filePath || !existsSync(filePath)) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('404');
      return;
    }
    res.writeHead(200, {
      'content-type': MIME[extname(filePath)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(readFileSync(filePath));
  });

  server.listen(PORT, () => {
    console.log(`[docs] preview en http://localhost:${PORT}/`);
    console.log(`[docs] sirviendo .docs-preview/ con el build local de www/build/`);
    console.log(`[docs] volvé a correr \`pnpm run docs:serve\` después de cambiar un componente`);
  });

  server.on('error', error => {
    if (error.code === 'EADDRINUSE') {
      throw new Error(`Port ${PORT} is in use. Set PORT to serve on another one.`);
    }
    throw error;
  });
}

assemble();
serve();
