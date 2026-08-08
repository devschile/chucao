import type { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'chucao',
  globalStyle: 'src/global/chucao.css',
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
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // Disable service workers
      // `chucao.css` is emitted as a standalone file and linked from
      // `index.html`'s <head> via `<link rel="stylesheet" href="/build/chucao.css">`,
      // So its relative font URLs (`./fonts/...`) resolve against
      // `www/build/chucao.css`. Copy the fonts to `www/build/fonts` to match that.
      copy: [{ src: 'global/fonts', dest: 'build/fonts' }],
    },
    reactOutputTarget({
      outDir: 'dist-react',
    }),
    vueOutputTarget({
      componentCorePackage: '@devschile/chucao',
      proxiesFile: 'dist-vue/index.ts',
      customElementsDir: 'dist/components',
    }),
  ],
};
