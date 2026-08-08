import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-button.tsx';

describe('ch-button', () => {
  it('renders a primary button by default', async () => {
    const { root } = await render(<ch-button>Click me</ch-button>);
    await expect(root).toEqualHtml(`
      <ch-button class="hydrated">
        <mock:shadow-root>
          <button class="btn btn--primary" type="button">
            <slot></slot>
          </button>
        </mock:shadow-root>
        Click me
      </ch-button>
    `);
  });

  it('renders a secondary button when the variant is set', async () => {
    const { root } = await render(<ch-button variant="secondary">Click me</ch-button>);
    await expect(root).toEqualHtml(`
      <ch-button class="hydrated">
        <mock:shadow-root>
          <button class="btn btn--secondary" type="button">
            <slot></slot>
          </button>
        </mock:shadow-root>
        Click me
      </ch-button>
    `);
  });

  it('emits chClick when the internal button is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-button>Click me</ch-button>);
    const clickSpy = spyOnEvent('chClick');

    root.shadowRoot?.querySelector('button')?.click();
    await waitForChanges();

    expect(clickSpy).toHaveReceivedEvent();
  });

  it('renders a disabled button when the disabled prop is set', async () => {
    const { root } = await render(<ch-button disabled>Click me</ch-button>);
    await expect(root).toEqualHtml(`
      <ch-button class="hydrated">
        <mock:shadow-root>
          <button class="btn btn--primary" type="button" disabled>
            <slot></slot>
          </button>
        </mock:shadow-root>
        Click me
      </ch-button>
    `);
  });

  it('renders an aria-label on the native button when the label prop is set', async () => {
    const { root } = await render(<ch-button label="Cerrar">✕</ch-button>);
    const button = root.shadowRoot?.querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Cerrar');
  });
});
