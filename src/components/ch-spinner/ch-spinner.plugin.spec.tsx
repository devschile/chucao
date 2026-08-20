import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-spinner.tsx';

describe('ch-spinner', () => {
  it('renders a medium spinner hidden from assistive technology by default', async () => {
    const { root } = await render(<ch-spinner></ch-spinner>);
    await expect(root).toEqualHtml(`
      <ch-spinner class="hydrated">
        <mock:shadow-root>
          <span class="spinner spinner--md" aria-hidden="true"></span>
        </mock:shadow-root>
      </ch-spinner>
    `);
  });

  it('announces itself when a label is given', async () => {
    const { root } = await render(<ch-spinner label="Cargando resultados"></ch-spinner>);
    await expect(root).toEqualHtml(`
      <ch-spinner class="hydrated">
        <mock:shadow-root>
          <span class="spinner spinner--md" role="status" aria-label="Cargando resultados"></span>
        </mock:shadow-root>
      </ch-spinner>
    `);
  });

  it('applies the size variant class', async () => {
    const { root } = await render(<ch-spinner size="lg"></ch-spinner>);
    await expect(root).toEqualHtml(`
      <ch-spinner class="hydrated">
        <mock:shadow-root>
          <span class="spinner spinner--lg" aria-hidden="true"></span>
        </mock:shadow-root>
      </ch-spinner>
    `);
  });

  it('does not mark a labelled spinner as hidden', async () => {
    const { root } = await render(<ch-spinner label="Cargando"></ch-spinner>);
    const span = root.shadowRoot.querySelector('span');
    expect(span.getAttribute('aria-hidden')).toBe(null);
    expect(span.getAttribute('role')).toBe('status');
  });

  it('hides a decorative spinner and gives it no role', async () => {
    const { root } = await render(<ch-spinner></ch-spinner>);
    const span = root.shadowRoot.querySelector('span');
    expect(span.getAttribute('aria-hidden')).toBe('true');
    expect(span.getAttribute('role')).toBe(null);
    expect(span.getAttribute('aria-label')).toBe(null);
  });
});
