import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-badge.tsx';

describe('ch-badge', () => {
  it('renders a default badge with its status marker', async () => {
    const { root } = await render(<ch-badge>New</ch-badge>);
    await expect(root).toEqualHtml(`
      <ch-badge class="hydrated">
        <mock:shadow-root>
          <span class="badge badge--default">
            <span class="badge-dot" aria-hidden="true"></span>
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
            <span class="badge-dot" aria-hidden="true"></span>
            <slot></slot>
          </span>
        </mock:shadow-root>
        Disponible
      </ch-badge>
    `);
  });

  it('distinguishes every variant without relying on colour alone', async () => {
    const classes = await Promise.all(
      (['default', 'positive', 'warning'] as const).map(async variant => {
        const { root } = await render(<ch-badge variant={variant}>Estado</ch-badge>);
        const badge = root.shadowRoot.querySelector('.badge');
        const dot = root.shadowRoot.querySelector('.badge-dot');
        // Each variant has its own host class (border + colour) and the marker
        // element is present, so the state is not conveyed by hue alone.
        return { name: badge.className, hasDot: dot !== null };
      }),
    );

    expect(new Set(classes.map(({ name }) => name)).size).toBe(3);
    expect(classes.every(({ hasDot }) => hasDot)).toBe(true);
  });

  it('keeps the status marker out of the accessibility tree', async () => {
    const { root } = await render(<ch-badge variant="warning">Vencido</ch-badge>);

    expect(root.shadowRoot.querySelector('.badge-dot').getAttribute('aria-hidden')).toBe('true');
  });

  it('drops the marker when the cue would be redundant', async () => {
    const { root } = await render(
      <ch-badge variant="positive" statusCue={false}>
        Disponible
      </ch-badge>,
    );

    expect(root.shadowRoot.querySelector('.badge-dot')).toBe(null);
  });
});
