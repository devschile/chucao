# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [1.3.0](https://github.com/devschile/chucao/compare/1.2.0...1.3.0) (2026-08-10)

### Features

* **docs:** generate the component gallery from scripts ([9e72dc7](https://github.com/devschile/chucao/commit/9e72dc76cb2c277126cdc59cea8e1f183dcd5f8b))
* **tokens:** expand token schema and de-hardcode component styles ([27b063f](https://github.com/devschile/chucao/commit/27b063f2913f9867e5e252f9bff83e50bf8877e5))

## [1.2.0](https://github.com/devschile/chucao/compare/1.1.0...1.2.0) (2026-08-09)

### Features

* **ci:** publish docs site to GitHub Pages and CDN gallery ([6b7736e](https://github.com/devschile/chucao/commit/6b7736ef257ae848300f284d39a8eab9f4fbf9f1))
* **fonts:** serve self-hosted fonts from a static chucao/fonts/ prefix ([bfb8c98](https://github.com/devschile/chucao/commit/bfb8c9817a83539be69bd2d7c3a5fd81fe07b714))
* **readme:** update logo drawn by [@irmirx](https://github.com/irmirx) ([7f022dd](https://github.com/devschile/chucao/commit/7f022ddceea2c961f66d7abe00d172b4f0c7f805))

### Bug Fixes

* **ci:** rename .publish staging dir so upload-artifact picks it up ([b4996d0](https://github.com/devschile/chucao/commit/b4996d0fcd325c8324bef0d70d032d36a2179abb))

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
