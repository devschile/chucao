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
