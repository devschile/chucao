import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-button.tsx';

describe('ch-button', () => {
  it('renders a primary button by default', async () => {
    const { root } = await render(<ch-button>Click me</ch-button>);
    await expect(root).toEqualHtml(`
      <ch-button class="hydrated">
        <mock:shadow-root>
          <button class="btn btn--primary btn--md" type="button">
            <slot name="start"></slot>
            <slot></slot>
            <slot name="end"></slot>
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
          <button class="btn btn--secondary btn--md" type="button">
            <slot name="start"></slot>
            <slot></slot>
            <slot name="end"></slot>
          </button>
        </mock:shadow-root>
        Click me
      </ch-button>
    `);
  });

  it('renders ghost and danger variants', async () => {
    const ghost = await render(<ch-button variant="ghost">Ghost</ch-button>);
    expect(ghost.root.shadowRoot?.querySelector('button')?.className).toContain('btn--ghost');

    const danger = await render(<ch-button variant="danger">Eliminar</ch-button>);
    expect(danger.root.shadowRoot?.querySelector('button')?.className).toContain('btn--danger');
  });

  it('applies the size modifier class', async () => {
    const sm = await render(<ch-button size="sm">Pequeño</ch-button>);
    expect(sm.root.shadowRoot?.querySelector('button')?.className).toContain('btn--sm');

    const lg = await render(<ch-button size="lg">Grande</ch-button>);
    expect(lg.root.shadowRoot?.querySelector('button')?.className).toContain('btn--lg');
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
          <button class="btn btn--primary btn--md" type="button" disabled>
            <slot name="start"></slot>
            <slot></slot>
            <slot name="end"></slot>
          </button>
        </mock:shadow-root>
        Click me
      </ch-button>
    `);
  });

  it('blocks interaction and shows a spinner when loading', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-button loading>Guardando</ch-button>);
    const clickSpy = spyOnEvent('chClick');
    const button = root.shadowRoot?.querySelector('button');

    expect(button?.className).toContain('btn--loading');
    expect(button?.hasAttribute('disabled')).toBe(true);
    expect(button?.getAttribute('aria-busy')).toBe('true');
    expect(root.shadowRoot?.querySelector('ch-spinner')).not.toBeNull();

    button?.click();
    await waitForChanges();

    expect(clickSpy).not.toHaveReceivedEvent();
  });

  it('renders an anchor when href is set', async () => {
    const { root } = await render(<ch-button href="https://example.com">Ir</ch-button>);
    await expect(root).toEqualHtml(`
      <ch-button class="hydrated">
        <mock:shadow-root>
          <a class="btn btn--primary btn--md" href="https://example.com">
            <slot name="start"></slot>
            <slot></slot>
            <slot name="end"></slot>
          </a>
        </mock:shadow-root>
        Ir
      </ch-button>
    `);
  });

  it('adds noopener noreferrer when the anchor opens a new tab', async () => {
    const { root } = await render(
      <ch-button href="https://example.com" target="_blank">
        Ir
      </ch-button>,
    );
    const anchor = root.shadowRoot?.querySelector('a');
    expect(anchor?.getAttribute('target')).toBe('_blank');
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders a non-interactive element when an href button is disabled', async () => {
    const { root } = await render(
      <ch-button href="https://example.com" disabled>
        Ir
      </ch-button>,
    );
    expect(root.shadowRoot?.querySelector('a')).toBeNull();
    const span = root.shadowRoot?.querySelector('span.btn');
    expect(span?.getAttribute('aria-disabled')).toBe('true');
  });

  it('emits chClick when the anchor is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-button href="https://example.com">Ir</ch-button>);
    const clickSpy = spyOnEvent('chClick');

    root.shadowRoot?.querySelector('a')?.click();
    await waitForChanges();

    expect(clickSpy).toHaveReceivedEvent();
  });

  it('renders start and end icon slots', async () => {
    const { root } = await render(
      <ch-button>
        <span slot="start">+</span>
        Texto
        <span slot="end">→</span>
      </ch-button>,
    );
    expect(root.shadowRoot?.querySelector('slot[name="start"]')).not.toBeNull();
    expect(root.shadowRoot?.querySelector('slot[name="end"]')).not.toBeNull();
  });

  it('renders an aria-label on the native button when the label prop is set', async () => {
    const { root } = await render(<ch-button label="Cerrar">✕</ch-button>);
    const button = root.shadowRoot?.querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Cerrar');
  });
});
