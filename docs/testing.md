# Testing

## Commands

```bash
pnpm test            # run the component tests
pnpm test:watch      # run in watch mode
pnpm run test:coverage  # run the tests with a coverage report
```

## How tests are written

Component tests live next to each component as `<component>.plugin.spec.tsx`
(e.g. `src/components/ch-badge/ch-badge.plugin.spec.tsx`) and import the
component's source file directly (e.g. `import './ch-badge.tsx';`). This uses
`@stencil/vitest`'s experimental `stencilVitestPlugin`, which compiles each
component on-the-fly instead of testing against pre-built `dist` bundles —
that's what makes the coverage report in `pnpm run test:coverage` reflect
real, per-component line/branch/function coverage. Testing against pre-built
bundles (the previous approach) doesn't give Vitest a way to instrument
individual source files, so coverage numbers were always 0%; see the
[`@stencil/vitest` README](https://github.com/stenciljs/vitest#stencil-vitest-plugin)
for more details, including its known limitation around cross-file class
inheritance.

## Browser tests

Two things mock-doc cannot model get a real Chromium, in two separate projects:

- `src/**/*.form.spec.ts` — form association, because `ElementInternals` does
  not exist outside a browser.
- `tests/browser/**/*.spec.ts` — behavior that depends on real box geometry or
  real timing: overlay collision and flipping, focus movement, live-region
  timing.

Both run against the built `dist/` custom-elements output, which
`stencil-test` produces before Vitest starts, so a stale `dist/` is the usual
cause of a browser test that "does nothing". They live outside `src/` on
purpose: Stencil type-checks everything under `src/` as part of the library
build, and a spec importing `node:fs` or using `offsetWidth` on an `Element`
would fail that build.

Never claim native semantics, focus, collision or hydration behavior from a
mock-doc test alone — assert it in the browser project instead.

`tests/*.spec.ts` runs in the mock-doc project and is for checks about the
package itself, such as the export matrix.

## Why `istanbul` instead of the default `v8` provider

Coverage uses the `istanbul` provider rather than the default `v8` provider,
and excludes the generated `constructor` method
(`coverage.ignoreClassMethods` in `vitest.config.mts`). The `v8` provider maps
coverage from compiled bytecode back to source via source maps, which
misattributed an untestable, framework-generated constructor branch (used
only for server-side hydration) back onto each component's `@Component(...)`
decorator, showing a bogus "else path not taken" there. `istanbul` instruments
the original source directly, so the branch numbers now reflect real,
testable code paths only.
