import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-empty-state.tsx';

describe('ch-empty-state', () => {
  it('renders the title as a heading', async () => {
    const { root } = await render(<ch-empty-state title="Sin resultados" />);
    const heading = root.shadowRoot.querySelector('h3');

    expect(heading).not.toBe(null);
    expect(heading.textContent).toBe('Sin resultados');
    expect(root.classList.contains('empty-state--md')).toBe(true);
  });

  it('renders the description when given', async () => {
    const { root } = await render(<ch-empty-state title="Sin resultados" description="Prueba con otra búsqueda" />);
    expect(root.shadowRoot.querySelector('.empty-state__description').textContent).toBe('Prueba con otra búsqueda');
  });

  it('omits the description when absent', async () => {
    const { root } = await render(<ch-empty-state title="Sin resultados" />);
    expect(root.shadowRoot.querySelector('.empty-state__description')).toBe(null);
  });

  it('applies the small size variant', async () => {
    const { root } = await render(<ch-empty-state title="Sin datos" size="sm" />);
    expect(root.classList.contains('empty-state--sm')).toBe(true);
    expect(root.classList.contains('empty-state--md')).toBe(false);
  });

  it('exposes an icon slot and a default action slot', async () => {
    const { root } = await render(
      <ch-empty-state title="Nada por acá">
        <span slot="icon">🐾</span>
        <ch-button size="sm">Crear</ch-button>
      </ch-empty-state>,
    );

    expect(root.shadowRoot.querySelector('slot[name="icon"]')).not.toBe(null);
    expect(root.shadowRoot.querySelector('slot:not([name])')).not.toBe(null);
    expect(root.shadowRoot.querySelector('.empty-state__icon').getAttribute('aria-hidden')).toBe('true');
  });
});
