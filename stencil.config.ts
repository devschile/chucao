import type { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'chucao',
  globalStyle: 'src/global/chucao.css',
  hydratedFlag: null,
  sourceMap: true,
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [{ src: 'global/fonts', dest: 'fonts' }],
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'dist-hydrate-script',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // Disable service workers
      // `chucao.css` is emitted as a standalone file and linked from
      // `index.html`'s <head> via `<link rel="stylesheet" href="/build/chucao.css">`.
      // Fonts are referenced by absolute CDN URL in `chucao.css`, so the copy
      // Below is only a fallback for locally patched stylesheets. Copy them to
      // `www/build/fonts` to match the emitted path.
      copy: [{ src: 'global/fonts', dest: 'build/fonts' }],
    },
    reactOutputTarget({
      outDir: 'dist-react',
    }),
    vueOutputTarget({
      componentCorePackage: '@devschile/chucao',
      proxiesFile: 'dist-vue/index.ts',
      includeImportCustomElements: true,
      customElementsDir: 'dist/components',
    }),
  ],
};
