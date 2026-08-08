import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-card.tsx';

describe('ch-card', () => {
  it('renders a card', async () => {
    const { root } = await render(<ch-card>Content</ch-card>);
    await expect(root).toEqualHtml(`
      <ch-card class="hydrated">
        <mock:shadow-root>
          <div class="card">
            <slot></slot>
          </div>
        </mock:shadow-root>
        Content
      </ch-card>
    `);
  });
});
