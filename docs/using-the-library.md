# Using this library

There are two strategies to consume Stencil component libraries published to
npm. You can read more about them in the
[Stencil docs](https://stenciljs.com/docs/publishing).

## Lazy loading

If your project is built with the [`dist`](https://stenciljs.com/docs/distribution)
output target, import a small bootstrap script that registers all components
and loads individual component scripts lazily:

```html
<script type="module" src="https://static.devschile.cl/chucao/latest/chucao.esm.js"></script>
<!--
`latest/` always points to the newest release. To pin to a specific version
(immutable), list the published versions and use that versioned URL instead,
e.g. https://static.devschile.cl/chucao/1.3.0/chucao.esm.js
-->
<ch-button>Click me</ch-button>
```

Published versions are listed on the [npm package page](https://www.npmjs.com/package/@devschile/chucao)
(versions section); every release is also available as a versioned directory
under `https://static.devschile.cl/chucao/<version>/`.

You can also import the script as part of your `node_modules` in your
application's entry file:

```tsx
import '@devschile/chucao/dist/chucao/chucao.esm.js';
```

## Standalone

If you'd rather import components individually as plain Web Components (e.g.
in a Svelte/SvelteKit app, which has first-class custom-elements support and
needs no extra wrapper package), use the
[`dist-custom-elements`](https://stenciljs.com/docs/custom-elements) output
target:

```tsx
import '@devschile/chucao/ch-button';

function App() {
  return (
    <div>
      <ch-button>Click me</ch-button>
    </div>
  );
}

export default App;
```

## CDN (no build)

Every release is also published to the static CDN under an immutable,
versioned URL, so consumers can use the stylesheet (and the lazy-loading
bootstrap) without npm or a bundler:

```html
<link rel="stylesheet" href="https://static.devschile.cl/chucao/1.1.0/chucao.css" />

<script type="module" src="https://static.devschile.cl/chucao/1.1.0/chucao.esm.js"></script>
<ch-button>Click me</ch-button>
```

Pinned URLs are write-once: `1.1.0/` never changes, so it can be cached
forever (`Cache-Control: immutable`) and is fully reproducible. A mutable
`latest/` alias is also available (`.../chucao/latest/chucao.css`) for
consumers who want the newest release without editing their HTML, at the cost
of not being reproducible.

The stylesheet alone (`chucao.css`) carries the design tokens, utility
classes, and self-hosted fonts, so a plain HTML page that only needs the
design system's look can skip the JavaScript entirely:

```html
<link rel="stylesheet" href="https://static.devschile.cl/chucao/1.1.0/chucao.css" />
```

## Design tokens

`chucao.css` exposes the full token scale as CSS custom properties on `:root`,
so consumers can theme with the design system's language without using any
component: colors (`--color-*`), typography (`--typography-*`), a spacing scale
(`--spacing-2xs` … `--spacing-6xl`), radii (`--radius-sm/md/pill`), shadows,
durations, `z-index`, and more. The short `DESIGN.md`-style aliases (`--bg`,
`--accent`, `--radius`, `--text`, …) are also available. See
[`src/tokens/README.md`](https://github.com/devschile/chucao/blob/main/src/tokens/README.md)
for the naming conventions.

The interactive component gallery (live demos + usage snippets) is the
[docs site](https://devschile.github.io/chucao/) — its component section is
generated from `scripts/gallery-data.mjs` via `pnpm run generate:gallery`.

How these URLs get published (release pipeline, manual redeploy, secrets) is
documented in [`releasing.md`](releasing.md).

## Framework wrappers

In addition to the framework-agnostic Web Components above, this library
ships dedicated wrapper packages so components feel native in React and Vue.

### React

Components are wrapped with
[`@stencil/react-output-target`](https://www.npmjs.com/package/@stencil/react-output-target),
built to `dist-react/` and exposed as `@devschile/chucao/react`. Install the
runtime peer dependency in your React app:

```bash
pnpm install @stencil/react-output-target
```

```tsx
import { ChButton } from '@devschile/chucao/react';

function App() {
  return <ChButton>Click me</ChButton>;
}

export default App;
```

### Vue

Components are wrapped with
[`@stencil/vue-output-target`](https://www.npmjs.com/package/@stencil/vue-output-target),
built to `dist-vue/` and exposed as `@devschile/chucao/vue`. Install the
runtime peer dependency in your Vue app:

```bash
pnpm install @stencil/vue-output-target
```

```vue
<script setup lang="ts">
import { ChButton } from '@devschile/chucao/vue';
</script>

<template>
  <ChButton>Click me</ChButton>
</template>
```

The Vue wrappers automatically register their underlying custom elements on
import — no separate `@devschile/chucao/loader` import is required.

#### Vue / Nuxt SSR hydration

The library is built with Stencil's `hydrated` flag disabled
(`hydratedFlag: null` in `stencil.config.ts`), so the custom element host never
gains Stencil's `hydrated` class at runtime. This means Vue's hydration (e.g.
under Nuxt SSR) sees exactly the same `class` attribute that the server
rendered, and no `Hydration class mismatch` warnings are produced.

Trade-offs to be aware of:

- The `:host(:not(.hydrated))` visibility hook is not available; and the lazy
  `dist` build does not inject Stencil's prehydration `visibility: hidden`
  rule, so content is visible immediately on page load rather than only after
  hydration.
- If you ever observe a class mismatch for another reason, Vue 3.5+ allows
  suppressing it per element with `data-allow-mismatch="class"` (see the
  [Vue SSR docs](https://vuejs.org/api/ssr.html#data-allow-mismatch)).

True server-side rendering of the shadow DOM itself is possible with the
`@devschile/chucao/hydrate` renderer — see
[Server-side rendering](#server-side-rendering-ssr) below.

### Server-side rendering (SSR)

The library ships a Node server-side renderer (`@devschile/chucao/hydrate`) built
by Stencil's `dist-hydrate-script` output target. It executes the components in
Node and serializes their shadow roots as
[Declarative Shadow DOM](https://web.dev/articles/declarative-shadow-dom), so
server and client render the same markup — including each component's internal
styles — with no hydration mismatches:

```js
import { renderToString } from '@devschile/chucao/hydrate';

const { html } = await renderToString('<ch-button>Click me</ch-button>');
// → <!doctype html>…<ch-button><template shadowrootmode="open">…</template>…</ch-button>
```

The renderer is framework-agnostic: return `html` from any server route or hook
(e.g. a Nuxt server plugin, a SvelteKit `load`, or your own Node render step) and
let the framework hydrate the page on the client. Because the host never gains
Stencil's `hydrated` class (see `hydratedFlag: null` above), Vue/Nuxt hydration
sees exactly the `class` the server rendered.

Notes:

- `renderToString` accepts an HTML string or a single component and returns
  `{ html, diagnostics, … }`. See `dist/hydrate/index.d.ts` for the full option
  set (`beforeHydrate`/`afterHydrate` hooks, `clientHydrateAnnotations`, …).
- Both CJS (`require('@devschile/chucao/hydrate')`) and ESM
  (`import … from '@devschile/chucao/hydrate'`) entry points are published.
- The renderer bundles the components and their styles itself, so it does not
  require the Vue wrappers or the lazy-loader bootstrap.

### Svelte / SvelteKit

Svelte doesn't need a dedicated wrapper package — it has first-class support
for custom elements, so the standalone approach above (importing from
[`dist-custom-elements`](https://stenciljs.com/docs/custom-elements)) works
directly:

```svelte
<script lang="ts">
  import '@devschile/chucao/ch-button';
</script>

<ch-button>Click me</ch-button>
```

In SvelteKit, guard the import so it only runs in the browser (custom
elements rely on the DOM), e.g. inside `onMount` or a `+layout.ts` with
`browser` from `$app/environment`.
