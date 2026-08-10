# Backlog

## Shipped

### 1.0.0 — release-readiness backlog

The 1.0.0 release-readiness backlog (badge status variant, `ch-`/`chucao-` naming
fix, Stencil-starter boilerplate removal, version bump, npm metadata review, and
build/test verification) has been completed and shipped in `1.0.0`.

### CH-02 — Token schema expansion + CSS de-tokenization

- **CH-02.1** Expanded `chucao-tokens.json` from 20 → 61 tokens with new
  categories: `typography.size/weight/tracking`, `spacing` scale (2xs–6xl plus
  `shift`/`elevate`), `radius` (`sm`/`md`/`pill`), `border.width/accent-bar`,
  `shadow` (`focus-ring`/`card-hover`), `duration`, `easing`, `focus`,
  `opacity.disabled`, `z-index`, and `effect.blur`.
- **CH-02.2** Ran `toki build -f stencil` to regenerate `src/tokens/*`
  (`tokens.css`, `tokens.ts`, `tokens.d.ts`, `types.ts`, `README.md`) and
  formatted with Prettier.
- **CH-02.3** Refactored every component stylesheet (`ch-badge`, `ch-button`,
  `ch-card`, `ch-input`, `ch-select`) plus `src/global/chucao.css` to consume
  the new tokens — no hardcoded colors/sizes remain. The `--radius` alias in
  `chucao.css` now maps to the new `--radius-sm` token (was `--spacing-radius`).
- **CH-02.4** Verified: `pnpm run build`, `pnpm test` (21/21), `pnpm lint`
  all green; changed files are Prettier-clean.

## Planned — `1.3.0` (additive-only)

Target: minor release, purely additive (no breaking API/behavior changes).
Form-associated custom elements and multi-theme are intentionally deferred
(form-association needs a 2.0 major; multi-theme is blocked on `toki`).

### CH-01 — PR CI + docs hygiene

- **CH-01.1** Add `.github/workflows/ci.yml` running `pnpm install --frozen-lockfile` →
  `pnpm lint` → `pnpm test` → `pnpm build`, on `pull_request` and `push` to
  `main`, so every PR is gated on lint/test/build.
- **CH-01.2** Refresh this file (it previously claimed no open items remained) and fix the
  stale multi-theme/Phase-3 reference in `src/tokens/README.md`.
- **CH-01.3** Verify: `pnpm lint`, `pnpm test`, `pnpm build` pass locally; PR checks appear.

### CH-03 — Form controls: validation states + new controls

- **CH-03.1** Additive props on `ch-input`/`ch-select`: `hint`, `errorMessage`, `invalid` —
  wiring `aria-invalid`/`aria-describedby` and error styling.
- **CH-03.2** New components: `ch-checkbox`, `ch-radio` (group), `ch-switch`,
  `ch-textarea` (each `.tsx` + `.css` + `.plugin.spec.tsx` + auto `readme.md`).
- **CH-03.3** Verify: new spec files; full suite + coverage.

### CH-04 — Feedback components

- **CH-04.1** `ch-alert` (reuses `status.positive`/`warning` tokens), `ch-spinner`,
  `ch-tooltip` (lightweight CSS-positioned, accessible via `aria-describedby`).
- **CH-04.2** `ch-modal` (focus trap, ESC, scroll lock) is the heaviest — flag as optional
  within this increment if scope balloons.
- **CH-04.3** Verify: tests for each; a11y assertions (keyboard + aria) in specs.

### CH-05 — Navigation & content

- **CH-05.1** `ch-link`, `ch-divider`, `ch-tabs`, `ch-accordion`.
- **CH-05.2** Verify: per-component tests; update `docs/components.md` conventions if any
  new pattern (e.g. `ch-tabs` keyboard arrows) is added.

### CH-06 — Auto-generated gallery

- **CH-06.1** Replace the hand-authored component section in `docs-site/index.html` and the
  hardcoded `TAG`/`bind` list in `docs-site/assets/js/app.js` with a generator
  (e.g. `scripts/generate-gallery.mjs`) that scans `src/components/*` and emits
  the demos + event-log wiring.
- **CH-06.2** Wire it into the `.github/workflows/docs.yml` build step.
- **CH-06.3** Verify: `pnpm run generate:gallery` produces the gallery; docs site renders.

### CH-07 — Docs, changelog, release

- **CH-07.1** Update `docs/components.md`, `docs/using-the-library.md`, the root
  `README.md` docs table, and `DESIGN.md` (only if the design language gained
  tokens/patterns).
- **CH-07.2** `pnpm run release` → `1.3.0` (auto-changelog + signed tag + CI publish/CDN).

## Deferred (needs 2.0, breaking)

- **CH-08** Form-associated custom elements (`ElementInternals`) so `ch-input`/`ch-select`
  participate in native form `FormData`/submission.
- **CH-09** Event payload / API changes.
- **CH-10** Multi-theme support — blocked on `toki` first-class multi-theme output.
