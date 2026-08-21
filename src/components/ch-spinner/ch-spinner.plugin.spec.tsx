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

  it('treats an empty label as decorative rather than announcing an empty name', async () => {
    const { root } = await render(<ch-spinner label=""></ch-spinner>);
    const span = root.shadowRoot.querySelector('span');
    expect(span.getAttribute('aria-hidden')).toBe('true');
    expect(span.getAttribute('role')).toBe(null);
    expect(span.getAttribute('aria-label')).toBe(null);
  });

  it('stops announcing when the label is removed at runtime', async () => {
    const { root, waitForChanges } = await render(<ch-spinner label="Cargando"></ch-spinner>);
    const span = root.shadowRoot.querySelector('span');
    expect(span.getAttribute('role')).toBe('status');

    (root as HTMLChSpinnerElement).label = undefined;
    await waitForChanges();

    expect(span.getAttribute('role')).toBe(null);
    expect(span.getAttribute('aria-label')).toBe(null);
    expect(span.getAttribute('aria-hidden')).toBe('true');
  });

  it('falls back to the inherited size when given an unknown size', async () => {
    const { root } = await render(<ch-spinner size={'huge' as never}></ch-spinner>);
    const span = root.shadowRoot.querySelector('span');
    expect(span.classList.contains('spinner')).toBe(true);
    expect(span.className).toBe('spinner spinner--huge');
  });
});
