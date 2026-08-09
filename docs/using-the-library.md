# Using this library

There are two strategies to consume Stencil component libraries published to
npm. You can read more about them in the
[Stencil docs](https://stenciljs.com/docs/publishing).

## Lazy loading

If your project is built with the [`dist`](https://stenciljs.com/docs/distribution)
output target, import a small bootstrap script that registers all components
and loads individual component scripts lazily:

```html
<script type="module" src="https://unpkg.com/@devschile/chucao"></script>
<!--
To avoid unpkg.com redirects to the actual file, you can also directly import:
https://unpkg.com/@devschile/chucao@1.0.0/dist/chucao/chucao.esm.js
-->
<ch-button>Click me</ch-button>
```

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
<link rel="stylesheet" href="https://static.devschile.cl/chucao/1.1.0/chucao.css">

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
<link rel="stylesheet" href="https://static.devschile.cl/chucao/1.1.0/chucao.css">
```

> **Known limitation:** cross-origin pages are subject to CORS. A
> `<link rel="stylesheet">` loads cross-origin without extra setup, but the
> `.woff2` fonts (via `@font-face`) and the `<script type="module">` bootstrap
> require `Access-Control-Allow-Origin` on the bucket. This is deferred until
> a consumer actually needs it.

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
