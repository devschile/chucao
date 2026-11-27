import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-icon.tsx';

function svg(root: HTMLElement) {
  return root.shadowRoot.querySelector('svg');
}

describe('ch-icon', () => {
  it('draws the requested glyph', async () => {
    const { root } = await render(<ch-icon name="check"></ch-icon>);

    expect(svg(root).querySelector('path').getAttribute('d')).toBe('M20 6 9 17l-5-5');
  });

  it('draws a multi-shape glyph', async () => {
    const { root } = await render(<ch-icon name="alert"></ch-icon>);

    expect(svg(root).querySelectorAll('path').length).toBe(3);
  });

  it('is decorative by default', async () => {
    const { root } = await render(<ch-icon name="check"></ch-icon>);

    expect(svg(root).getAttribute('aria-hidden')).toBe('true');
    expect(svg(root).hasAttribute('aria-label')).toBe(false);
    expect(svg(root).hasAttribute('role')).toBe(false);
  });

  it('becomes an image with a name when labelled', async () => {
    const { root } = await render(<ch-icon name="check" label="Disponible"></ch-icon>);

    expect(svg(root).getAttribute('role')).toBe('img');
    expect(svg(root).getAttribute('aria-label')).toBe('Disponible');
    expect(svg(root).hasAttribute('aria-hidden')).toBe(false);
  });

  it('sizes through the three token-backed steps', async () => {
    const { root } = await render(<ch-icon name="check" size="lg"></ch-icon>);

    expect(svg(root).getAttribute('class')).toContain('icon--lg');
  });

  it('is not a tab stop', async () => {
    const { root } = await render(<ch-icon name="check"></ch-icon>);

    expect(svg(root).getAttribute('focusable')).toBe('false');
  });

  it('renders nothing for an unknown name instead of throwing', async () => {
    const { root } = await render(<ch-icon name={'no-existe' as never}></ch-icon>);

    expect(svg(root).children.length).toBe(0);
  });

  it('keeps the Lucide 24x24 grid so stroke weight is consistent', async () => {
    const { root } = await render(<ch-icon name="search"></ch-icon>);

    expect(svg(root).getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg(root).getAttribute('stroke')).toBe('currentColor');
    expect(svg(root).getAttribute('stroke-width')).toBe('2');
  });
});
