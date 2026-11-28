# Storybook on the CDN — evaluation

Status: **evaluated, not adopted.** Current recommendation is the lightweight
static gallery deployed from `docs-site/` (see [`releasing.md`](releasing.md));
revisit this when the component count grows or interaction testing becomes a
priority.

## What was considered

Deploying a Storybook instance to the existing Garage S3 bucket
(`static.devschile.cl`), alongside the `chucao/<version>/` library artifacts.

### Feasibility: high

- Storybook builds a fully static site (`index.html` + `iframe.html` + `assets/`),
  so it can be served from an S3 bucket with no server-side rendering.
- Storybook 7+ addresses stories with a query string (`?path=/story/...`), so no
  SPA fallback rewrite is needed — Garage just serves `index.html`.
- The library already ships a custom-elements build (`dist/components/`,
  `auto-define-custom-elements`), which `@storybook/web-components` can import
  directly for stories.
- Deployment mirrors the existing `deploy-cdn.yml` pattern: build the storybook
  static output and `aws s3 sync` it to `s3://$S3_BUCKET/storybook/latest/`.

### Complexity: medium-high

- New dependency surface: `storybook`, `@storybook/web-components-vite`, and
  Storybook addons — a large dependency tree and notably slower CI builds.
- One `.stories.ts` file per component to author and maintain, plus the
  Storybook config (`main.ts`, `preview.ts`) and a `pnpm storybook`/`build`
  scripts.
- Build output needs the same cache considerations as `chucao/` when served
  from the CDN.
- Ongoing cost: every component/API change implies keeping stories in sync.

### What it buys

- Interaction testing (`@storybook/addon-interactions`) — click/type assertions
  that exercise the custom events (`chClick`, `chChange`, …).
- Controls/arg tables auto-derived from component props.
- A familiar, searchable UI that scales better than a hand-authored gallery.

### Current trade-off

With 5 components, the hand-authored gallery (`docs-site/`) covers live demos +
usage snippets at ~zero added tooling, and is regenerated automatically on every
push to `main`. Storybook's interaction testing is the main thing the gallery
lacks; that alone doesn't justify the dependency weight yet.

## If adopted later

1. Add `@storybook/web-components-vite` and wire `stories` glob to
   `src/components/**/*.stories.ts`.
2. Import components from `dist/components/*.js` (custom-elements build) so
   stories reflect the published artifacts.
3. Add a `build-storybook` script and a workflow step syncing `storybook-static/`
   to `s3://$S3_BUCKET/storybook/latest/` (same `S3_*` secrets as the gallery).
