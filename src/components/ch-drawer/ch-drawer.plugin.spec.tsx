import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-drawer.tsx';

// mock-doc implements no part of the dialog API, so the backdrop tests stand a
// real box and a working close() in for it.
const DIALOG_BOX = { left: 300, top: 100, right: 500, bottom: 300 };
const ON_BACKDROP = { clientX: 10, clientY: 10 };
const INSIDE_DIALOG = { clientX: 350, clientY: 150 };
// A click synthesised from the keyboard reports no coordinates.
const NO_POINTER = { clientX: 0, clientY: 0 };

type Point = { clientX: number; clientY: number };

function mouseEvent(type: string, at: Point) {
  const event = new Event(type, { bubbles: true, composed: true });
  Object.assign(event, at);
  return event;
}

function pressAt(target: Element, at: Point) {
  target.dispatchEvent(mouseEvent('pointerdown', at));
  target.dispatchEvent(mouseEvent('click', at));
}

async function renderWithStubbedDialog() {
  const { root } = await render(
    <ch-drawer label="Filtros" open>
      Contenido
    </ch-drawer>,
  );
  const dialog = root.shadowRoot.querySelector('dialog');
  let closes = 0;
  Object.assign(dialog, {
    open: true,
    close: () => {
      closes += 1;
    },
    getBoundingClientRect: () => DIALOG_BOX,
  });
  return { root, dialog, closeCalls: () => closes };
}

describe('ch-drawer', () => {
  it('renders a closed dialog by default', async () => {
    const { root } = await render(<ch-drawer label="Filtros">Contenido</ch-drawer>);
    const dialog = root.shadowRoot.querySelector('dialog');
    expect(dialog).not.toBe(null);
    expect(dialog.className).toBe('drawer drawer--end');
    expect(dialog.hasAttribute('open')).toBe(false);
  });

  it('names the dialog from the label prop', async () => {
    const { root } = await render(<ch-drawer label="Filtros de búsqueda">Contenido</ch-drawer>);
    expect(root.shadowRoot.querySelector('dialog').getAttribute('aria-label')).toBe('Filtros de búsqueda');
  });

  it('anchors the panel to the requested side', async () => {
    const { root } = await render(
      <ch-drawer label="Filtros" side="start">
        Contenido
      </ch-drawer>,
    );
    expect(root.shadowRoot.querySelector('dialog').className).toBe('drawer drawer--start');
  });

  it('renders no close button without a label, so it can never be unnamed', async () => {
    const { root } = await render(<ch-drawer label="Filtros">Contenido</ch-drawer>);
    expect(root.shadowRoot.querySelector('.drawer-close')).toBe(null);
  });

  it('adds a named close button when closeLabel is given', async () => {
    const { root } = await render(
      <ch-drawer label="Filtros" closeLabel="Cerrar panel">
        Contenido
      </ch-drawer>,
    );
    const button = root.shadowRoot.querySelector('.drawer-close');
    expect(button).not.toBe(null);
    expect(button.getAttribute('aria-label')).toBe('Cerrar panel');
    expect(button.getAttribute('type')).toBe('button');
  });

  it('emits chClose when the close button is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <ch-drawer label="Filtros" closeLabel="Cerrar">
        Contenido
      </ch-drawer>,
    );
    const closeSpy = spyOnEvent('chClose');

    root.shadowRoot.querySelector<HTMLButtonElement>('.drawer-close').click();
    await waitForChanges();

    expect(closeSpy).toHaveReceivedEvent();
  });

  it('reflects open back to false when the close button is used', async () => {
    const { root, waitForChanges } = await render(
      <ch-drawer label="Filtros" closeLabel="Cerrar" open>
        Contenido
      </ch-drawer>,
    );

    root.shadowRoot.querySelector<HTMLButtonElement>('.drawer-close').click();
    await waitForChanges();

    expect((root as unknown as { open: boolean }).open).toBe(false);
  });

  it('does not throw where the dialog API is unavailable, as in SSR', async () => {
    const { root } = await render(
      <ch-drawer label="Filtros" open>
        Contenido
      </ch-drawer>,
    );
    // mock-doc implements neither showModal nor close; rendering with open set
    // must still produce markup rather than throwing.
    expect(root.shadowRoot.querySelector('dialog')).not.toBe(null);
    expect(typeof root.shadowRoot.querySelector('dialog').showModal).toBe('undefined');
  });

  it('puts the header slot before the close button so focus lands sensibly', async () => {
    const { root } = await render(
      <ch-drawer label="Filtros" closeLabel="Cerrar">
        Contenido
      </ch-drawer>,
    );
    const head = Array.from(root.shadowRoot.querySelector('.drawer-head').children);
    expect(head.map(el => el.tagName.toLowerCase())).toEqual(['slot', 'button']);
    expect(head[0].getAttribute('name')).toBe('header');
  });

  it('renders header, body and footer slots', async () => {
    const { root } = await render(
      <ch-drawer label="Filtros">
        <h4 slot="header">Filtros</h4>
        Contenido
        <div slot="footer">Acciones</div>
      </ch-drawer>,
    );
    expect(root.shadowRoot.querySelector('slot[name="header"]')).not.toBe(null);
    expect(root.shadowRoot.querySelector('slot:not([name])')).not.toBe(null);
    expect(root.shadowRoot.querySelector('slot[name="footer"]')).not.toBe(null);
  });

  it('does not throw when open is flipped after mount', async () => {
    const { root, waitForChanges } = await render(<ch-drawer label="Filtros">Contenido</ch-drawer>);
    const drawer = root as unknown as { open: boolean };

    drawer.open = true;
    await waitForChanges();
    drawer.open = false;
    await waitForChanges();

    expect(root.shadowRoot.querySelector('dialog')).not.toBe(null);
    expect(drawer.open).toBe(false);
  });

  it('leaves the page scroll alone when a drawer that never opened is removed', async () => {
    // Stands in for another overlay holding the lock: removing this one must not
    // hand the page back its scrollbar.
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    const { root: drawer } = await render(<ch-drawer label="Filtros">Contenido</ch-drawer>);

    drawer.remove();

    expect(root.style.overflow).toBe('hidden');
    root.style.overflow = '';
  });

  it('closes when a press starts and ends on the backdrop', async () => {
    const { dialog, closeCalls } = await renderWithStubbedDialog();

    pressAt(dialog, ON_BACKDROP);

    expect(closeCalls()).toBe(1);
  });

  it('stays open when a press starts inside the drawer and ends on the backdrop', async () => {
    const { dialog, closeCalls } = await renderWithStubbedDialog();

    dialog.dispatchEvent(mouseEvent('pointerdown', INSIDE_DIALOG));
    dialog.dispatchEvent(mouseEvent('click', ON_BACKDROP));

    expect(closeCalls()).toBe(0);
  });

  it('stays open for a keyboard-synthesised click, which reports no coordinates', async () => {
    const { dialog, closeCalls } = await renderWithStubbedDialog();

    dialog.dispatchEvent(mouseEvent('click', NO_POINTER));

    expect(closeCalls()).toBe(0);
  });

  it('stays open when the press lands on content inside the drawer', async () => {
    const { root, closeCalls } = await renderWithStubbedDialog();
    const body = root.shadowRoot.querySelector('.drawer-body');

    pressAt(body, ON_BACKDROP);

    expect(closeCalls()).toBe(0);
  });
});
