# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
