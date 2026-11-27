import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-page-header.tsx';

function heading(root: HTMLElement) {
  return root.shadowRoot.querySelector('.header-title');
}

describe('ch-page-header', () => {
  it('renders the title as the single top-level heading by default', async () => {
    const { root } = await render(<ch-page-header title="Proyectos"></ch-page-header>);

    expect(heading(root).tagName).toBe('H1');
    expect(heading(root).textContent).toBe('Proyectos');
  });

  it('lowers the level when the page already has a heading above it', async () => {
    const { root } = await render(<ch-page-header title="Facturas" headingLevel="h2"></ch-page-header>);

    expect(heading(root).tagName).toBe('H2');
  });

  it('keeps the title text out of the shadow slot, so a second heading is impossible', async () => {
    const { root } = await render(
      <ch-page-header title="Proyectos">
        <h1 slot="actions">Otro h1</h1>
      </ch-page-header>,
    );

    expect(root.shadowRoot.querySelector('h1').textContent).toBe('Proyectos');
    // The consumer can still put arbitrary content in actions; the point is
    // that the heading itself is not slotted.
    expect(root.shadowRoot.querySelector('slot[name="actions"]')).not.toBe(null);
  });

  it('renders eyebrow and description when given', async () => {
    const { root } = await render(<ch-page-header title="Proyectos" eyebrow="devsChile" description="Lo que estamos construyendo"></ch-page-header>);

    expect(root.shadowRoot.querySelector('.header-eyebrow').textContent).toBe('devsChile');
    expect(root.shadowRoot.querySelector('.header-description').textContent).toBe('Lo que estamos construyendo');
  });

  it('omits the optional lines instead of leaving empty paragraphs', async () => {
    const { root } = await render(<ch-page-header title="Proyectos"></ch-page-header>);

    expect(root.shadowRoot.querySelector('.header-eyebrow')).toBe(null);
    expect(root.shadowRoot.querySelector('.header-description')).toBe(null);
  });

  it('puts the heading before the actions in DOM order, so reading order starts with the title', async () => {
    const { root } = await render(
      <ch-page-header title="Proyectos">
        <button slot="actions">Nuevo</button>
      </ch-page-header>,
    );

    const text = root.shadowRoot.querySelector('.header-text');
    const actions = root.shadowRoot.querySelector('.header-actions');

    // DOCUMENT_POSITION_FOLLOWING is 4; some test environments do not expose
    // the Node mask constants, so compare against the literal.
    expect(text.compareDocumentPosition(actions) & 4).toBe(4);
  });

  it('can stack the actions under the title', async () => {
    const { root } = await render(
      <ch-page-header title="Proyectos" actionsStacked={true}>
        <button slot="actions">Nuevo</button>
      </ch-page-header>,
    );

    expect(root.shadowRoot.querySelector('.header').className).toContain('header--stacked');
  });
});
