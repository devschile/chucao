import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-badge.tsx';

describe('ch-badge', () => {
  it('renders a default badge', async () => {
    const { root } = await render(<ch-badge>New</ch-badge>);
    await expect(root).toEqualHtml(`
      <ch-badge class="hydrated">
        <mock:shadow-root>
          <span class="badge badge--default">
            <slot></slot>
          </span>
        </mock:shadow-root>
        New
      </ch-badge>
    `);
  });

  it('renders a positive badge when the variant is set', async () => {
    const { root } = await render(<ch-badge variant="positive">Disponible</ch-badge>);
    await expect(root).toEqualHtml(`
      <ch-badge class="hydrated">
        <mock:shadow-root>
          <span class="badge badge--positive">
            <slot></slot>
          </span>
        </mock:shadow-root>
        Disponible
      </ch-badge>
    `);
  });
});
