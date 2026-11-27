import { defineVitestConfig } from '@stencil/vitest/config';
import { stencilVitestPlugin } from '@stencil/vitest/plugin';
import { playwright } from '@vitest/browser-playwright';

export default defineVitestConfig({
  stencilConfig: './stencil.config.ts',
  test: {
    coverage: {
      // The default v8 provider maps bytecode coverage back to source via source maps.
      // That fabricates phantom branches, so use istanbul, which instruments the source directly.
      provider: 'istanbul',
      include: ['src/components/**/*.tsx'],
      exclude: ['src/components/**/*.plugin.spec.tsx', 'src/components/**/*.d.ts', 'src/components/**/readme.md'],
      // Stencil's `customelement` output target adds a hydration-only constructor guard.
      // Custom elements always get zero constructor args, so that guard is untestable.
      // Its source map wrongly points at @Component(...), showing a bogus uncovered branch there.
      // Excluding the generated constructor keeps the report limited to real, testable branches.
      ignoreClassMethods: ['constructor'],
    },
    projects: [
      // Component tests - compiles component source on-the-fly for reliable coverage
      {
        plugins: [stencilVitestPlugin()],
        test: {
          name: 'components',
          include: ['src/**/*.plugin.spec.{ts,tsx}', 'tests/*.spec.ts'],
          environment: 'stencil',
        },
      },
      // Browser tests run against the built `dist/` custom-elements output, which
      // `stencil-test` produces before running Vitest. They cover behavior that
      // mock-doc cannot model: ElementInternals for form association, and real box
      // geometry for overlay collision, focus and timing.
      {
        test: {
          name: 'browser',
          include: ['src/**/*.form.spec.{ts,tsx}', 'tests/browser/**/*.spec.{ts,tsx}'],
          coverage: { enabled: false },
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
