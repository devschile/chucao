# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [2.0.0](https://github.com/devschile/chucao/compare/1.8.0...2.0.0) (2026-08-29)

### Features

* **forms:** make form controls participate in native forms via ElementInternals ([#63](https://github.com/devschile/chucao/issues/63)) ([8d64838](https://github.com/devschile/chucao/commit/8d6483831e38cf32b8b2df7ae4caf891ba393d91)), closes [#22](https://github.com/devschile/chucao/issues/22)

## [1.8.0](https://github.com/devschile/chucao/compare/1.7.0...1.8.0) (2026-08-28)

### Features

* **docs-site:** mostrar la escala de tamaños de tipografía ([#46](https://github.com/devschile/chucao/issues/46)) ([51e4aa4](https://github.com/devschile/chucao/commit/51e4aa46ade1a619bae7abe0110cbb9c84485282)), closes [#43](https://github.com/devschile/chucao/issues/43)
* **modal:** add ch-modal built on the native dialog element ([#48](https://github.com/devschile/chucao/issues/48)) ([5067a62](https://github.com/devschile/chucao/commit/5067a62d57a8175efe61349cd98ffb711336d94d)), closes [#20](https://github.com/devschile/chucao/issues/20) [#20](https://github.com/devschile/chucao/issues/20), references [#20](https://github.com/devschile/chucao/issues/20)
* **tooltip:** add ch-tooltip with slot-based accessible association ([#52](https://github.com/devschile/chucao/issues/52)) ([2363df3](https://github.com/devschile/chucao/commit/2363df38a8590dea375986bdc8649defce92bfcb)), closes [#19](https://github.com/devschile/chucao/issues/19), references [#19](https://github.com/devschile/chucao/issues/19) [#47](https://github.com/devschile/chucao/issues/47)

### Bug Fixes

* **docs-site:** keep main-content inside the page-shell wrap width ([4629138](https://github.com/devschile/chucao/commit/4629138afb28c45ce04a9572569ca698464f8e52))

## [1.7.0](https://github.com/devschile/chucao/compare/1.6.0...1.7.0) (2026-08-25)

### Features

* **alert:** add ch-alert status message component ([#44](https://github.com/devschile/chucao/issues/44)) ([6ff199c](https://github.com/devschile/chucao/commit/6ff199c1b4c41fc72a1cef1eb4b2090892100dba)), closes [#17](https://github.com/devschile/chucao/issues/17), references [#17](https://github.com/devschile/chucao/issues/17) [#17](https://github.com/devschile/chucao/issues/17)
* **docs-site:** add docs:serve to preview the gallery against the local build ([#33](https://github.com/devschile/chucao/issues/33)) ([e1f22ea](https://github.com/devschile/chucao/commit/e1f22eaccffd3a1973e08ab0ce56eff839f55328)), closes [#18](https://github.com/devschile/chucao/issues/18)
* **docs-site:** make the component gallery navigable ([#35](https://github.com/devschile/chucao/issues/35)) ([afa36da](https://github.com/devschile/chucao/commit/afa36dad161d25044dcfc6281895984cafda2e2c)), references [#34](https://github.com/devschile/chucao/issues/34)
* **spinner:** add ch-spinner loading indicator ([#32](https://github.com/devschile/chucao/issues/32)) ([b6bbb8a](https://github.com/devschile/chucao/commit/b6bbb8a613a18c03e4b82411adacc11ea73bad24)), closes [#16](https://github.com/devschile/chucao/issues/16), references [#27](https://github.com/devschile/chucao/issues/27) [#16](https://github.com/devschile/chucao/issues/16)
* **tokens:** reproducible token regeneration via a fixed toki (closes [#21](https://github.com/devschile/chucao/issues/21), addresses [#29](https://github.com/devschile/chucao/issues/29)) ([#30](https://github.com/devschile/chucao/issues/30)) ([9849696](https://github.com/devschile/chucao/commit/9849696e39cb91ba374f98c7f1341723f727c4c5))

## [1.6.0](https://github.com/devschile/chucao/compare/1.5.3...1.6.0) (2026-08-16)

### Features

- **ssr:** ship server-side renderer via dist-hydrate-script ([a6b99d9](https://github.com/devschile/chucao/commit/a6b99d9f6e6fc8b37928fd7e77de0716eb5ff8fc))

## [1.5.3](https://github.com/devschile/chucao/compare/1.5.2...1.5.3) (2026-08-16)

### Bug Fixes

- **build:** disable stencil hydrated flag to prevent SSR hydration mismatch ([4e1b420](https://github.com/devschile/chucao/commit/4e1b4207ef2aa241ba8c02dbbe2b79ff8d27bfe9))

## [1.5.2](https://github.com/devschile/chucao/compare/1.5.1...1.5.2) (2026-08-16)

### Bug Fixes

- **link:** expose underline opt-out via custom property and part ([3db9000](https://github.com/devschile/chucao/commit/3db9000b2c0d7b1bfc21e8877465a6e2965defe7))

## [1.5.1](https://github.com/devschile/chucao/compare/1.5.0...1.5.1) (2026-08-11)

### Bug Fixes

- **switch:** keep thumb inside the track when checked ([f2b9544](https://github.com/devschile/chucao/commit/f2b9544d0f40f13565a58fd8da7a01a2331b62da))

## [1.5.0](https://github.com/devschile/chucao/compare/1.4.0...1.5.0) (2026-08-11)

### Features

- **nav:** add ch-link, ch-divider, ch-tabs and ch-accordion ([97fdbe6](https://github.com/devschile/chucao/commit/97fdbe6fb276e72d25aa69d89ca8db18dda0b288))

## [1.4.0](https://github.com/devschile/chucao/compare/1.3.0...1.4.0) (2026-08-10)

### Features

- **form:** add validation states and four new form controls ([ef6901d](https://github.com/devschile/chucao/commit/ef6901def5bb85802dd78b5f9fda14d25ecd4275))

## [1.3.0](https://github.com/devschile/chucao/compare/1.2.0...1.3.0) (2026-08-10)

### Features

- **docs:** generate the component gallery from scripts ([9e72dc7](https://github.com/devschile/chucao/commit/9e72dc76cb2c277126cdc59cea8e1f183dcd5f8b))
- **tokens:** expand token schema and de-hardcode component styles ([27b063f](https://github.com/devschile/chucao/commit/27b063f2913f9867e5e252f9bff83e50bf8877e5))

## [1.2.0](https://github.com/devschile/chucao/compare/1.1.0...1.2.0) (2026-08-09)

### Features

- **ci:** publish docs site to GitHub Pages and CDN gallery ([6b7736e](https://github.com/devschile/chucao/commit/6b7736ef257ae848300f284d39a8eab9f4fbf9f1))
- **fonts:** serve self-hosted fonts from a static chucao/fonts/ prefix ([bfb8c98](https://github.com/devschile/chucao/commit/bfb8c9817a83539be69bd2d7c3a5fd81fe07b714))
- **readme:** update logo drawn by [@irmirx](https://github.com/irmirx) ([7f022dd](https://github.com/devschile/chucao/commit/7f022ddceea2c961f66d7abe00d172b4f0c7f805))

### Bug Fixes

- **ci:** rename .publish staging dir so upload-artifact picks it up ([b4996d0](https://github.com/devschile/chucao/commit/b4996d0fcd325c8324bef0d70d032d36a2179abb))

## Unreleased

### Added

- CDN deployment: every npm release now also publishes `dist/chucao/` to
  versioned, immutable URLs (`https://static.devschile.cl/chucao/<version>/`)
  plus a mutable `latest/` alias, with a manual redeploy workflow
  (`.github/workflows/deploy-cdn.yml`). Documented in
  [`docs/releasing.md`](docs/releasing.md).

### Changed

- Restructured the documentation: the root `README.md` is now a concise
  Spanish index, and its technical/brand content was split into `docs/`
  (`components.md`, `using-the-library.md`, `testing.md`, `assets.md`).
  Added `AGENTS.md` documenting repo rules for AI agents and contributors,
  including the rule that the root `README.md` must stay in Spanish.

## 1.1.0 (2026-08-08)

### Features

- **project:** rename project ([98d1871](https://github.com/devschile/chucao/commit/98d18718b25350ffa28bd75b513ef27827a29faa))

## [1.0.0] - 2026-08-08

### Added

- Initial release of `@devschile/chucao`, a StencilJS design-system component
  library published as `dist` (lazy-loading), `dist-custom-elements`
  (standalone), `react`, `vue`, and `loader` consumption targets.
- Components: `ch-badge`, `ch-button`, `ch-card`, `ch-input`, `ch-select`,
  each with `shadow: true`, a design-token-driven stylesheet, and a
  `@stencil/vitest` test file.
  - `ch-badge`: `variant` prop (`ChBadgeVariant`).
  - `ch-button`: `variant`, `disabled` and `label` props (`ChButtonVariant`),
    `chClick` event, and a visible `:focus-visible` outline.
  - `ch-card`: slot-only container.
  - `ch-input`: `type`, `value`, `placeholder`, `name`, `disabled`,
    `required` and `label` props, `chInput`/`chChange` events.
  - `ch-select`: `options`, `value`, `placeholder`, `name`, `disabled`,
    `required` and `label` props, `chChange` event.
- Accessibility baseline: `ch-input`/`ch-select` render an associated
  `<label>` (via a generated `id`/`for` pair) when their `label` prop is
  set, and `ch-button` applies its `label` prop as `aria-label` on the
  native `<button>` for icon-only usage. All interactive components rely on
  native, keyboard-accessible elements, so Tab/Space/Enter navigation works
  without extra wiring.
- Design-token pipeline: `chucao-tokens.json` → `toki` → `src/tokens/{tokens.css,tokens.ts,types.ts}`,
  consumed by `src/global/chucao.css` and every component's stylesheet.
- Documentation: `README.md` (project structure, consumption strategies,
  and a "Naming & API conventions" checklist for future components),
  `DESIGN.md` (brand identity and web design system reference), and
  auto-generated per-component `readme.md` files via the `docs-readme`
  Stencil output target.

### Fixed

- `ch-button` was missing a `disabled` prop, unlike its sibling interactive
  components `ch-input`/`ch-select`; it now exposes `disabled`, wired to the
  native `<button disabled>` attribute with a matching `.btn:disabled` style.

[1.0.0]: https://github.com/devschile/chucao/releases/tag/v1.0.0
