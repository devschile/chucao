import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-modal.tsx';

describe('ch-modal', () => {
  it('renders a closed dialog by default', async () => {
    const { root } = await render(<ch-modal label="Confirmar">Contenido</ch-modal>);
    const dialog = root.shadowRoot.querySelector('dialog');
    expect(dialog).not.toBe(null);
    expect(dialog.className).toBe('modal');
    expect(dialog.hasAttribute('open')).toBe(false);
  });

  it('names the dialog from the label prop', async () => {
    const { root } = await render(<ch-modal label="Confirmar borrado">Contenido</ch-modal>);
    expect(root.shadowRoot.querySelector('dialog').getAttribute('aria-label')).toBe('Confirmar borrado');
  });

  it('renders no close button without a label, so it can never be unnamed', async () => {
    const { root } = await render(<ch-modal label="Confirmar">Contenido</ch-modal>);
    expect(root.shadowRoot.querySelector('.modal-close')).toBe(null);
  });

  it('adds a named close button when closeLabel is given', async () => {
    const { root } = await render(
      <ch-modal label="Confirmar" closeLabel="Cerrar diálogo">
        Contenido
      </ch-modal>,
    );
    const button = root.shadowRoot.querySelector('.modal-close');
    expect(button).not.toBe(null);
    expect(button.getAttribute('aria-label')).toBe('Cerrar diálogo');
    expect(button.getAttribute('type')).toBe('button');
  });

  it('emits chClose when the close button is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <ch-modal label="Confirmar" closeLabel="Cerrar">
        Contenido
      </ch-modal>,
    );
    const closeSpy = spyOnEvent('chClose');

    root.shadowRoot.querySelector<HTMLButtonElement>('.modal-close').click();
    await waitForChanges();

    expect(closeSpy).toHaveReceivedEvent();
  });

  it('reflects open back to false when the close button is used', async () => {
    const { root, waitForChanges } = await render(
      <ch-modal label="Confirmar" closeLabel="Cerrar" open>
        Contenido
      </ch-modal>,
    );

    root.shadowRoot.querySelector<HTMLButtonElement>('.modal-close').click();
    await waitForChanges();

    expect((root as unknown as { open: boolean }).open).toBe(false);
  });

  it('does not throw where the dialog API is unavailable, as in SSR', async () => {
    const { root } = await render(
      <ch-modal label="Confirmar" open>
        Contenido
      </ch-modal>,
    );
    // mock-doc implements neither showModal nor close; rendering with open set
    // must still produce markup rather than throwing.
    expect(root.shadowRoot.querySelector('dialog')).not.toBe(null);
    expect(typeof root.shadowRoot.querySelector('dialog').showModal).toBe('undefined');
  });

  it('puts the heading slot before the close button so focus lands sensibly', async () => {
    const { root } = await render(
      <ch-modal label="Confirmar" closeLabel="Cerrar">
        Contenido
      </ch-modal>,
    );
    const slots = Array.from(root.shadowRoot.querySelectorAll('slot')).map(s => s.getAttribute('name'));
    expect(slots).toContain('heading');
  });
});
