import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-alert.tsx';

describe('ch-alert', () => {
  it('renders a neutral alert announced politely by default', async () => {
    const { root } = await render(<ch-alert>Guardado</ch-alert>);
    await expect(root).toEqualHtml(`
      <ch-alert class="hydrated">
        <mock:shadow-root>
          <div class="alert alert--default" role="status">
            <div class="alert-content">
              <slot></slot>
            </div>
          </div>
        </mock:shadow-root>
        Guardado
      </ch-alert>
    `);
  });

  it('announces a warning assertively', async () => {
    const { root } = await render(<ch-alert variant="warning">Algo falló</ch-alert>);
    await expect(root).toEqualHtml(`
      <ch-alert class="hydrated">
        <mock:shadow-root>
          <div class="alert alert--warning" role="alert">
            <div class="alert-content">
              <slot></slot>
            </div>
          </div>
        </mock:shadow-root>
        Algo falló
      </ch-alert>
    `);
  });

  it('announces a positive alert politely, since success is not urgent', async () => {
    const { root } = await render(<ch-alert variant="positive">Listo</ch-alert>);
    const alert = root.shadowRoot.querySelector('.alert');
    expect(alert.className).toBe('alert alert--positive');
    expect(alert.getAttribute('role')).toBe('status');
  });

  it('renders no dismiss button without a label, so it can never be unnamed', async () => {
    const { root } = await render(<ch-alert>Guardado</ch-alert>);
    expect(root.shadowRoot.querySelector('button')).toBe(null);
  });

  it('adds the dismiss button when a label is given, and names it', async () => {
    const { root } = await render(<ch-alert dismissLabel="Descartar aviso">Guardado</ch-alert>);
    const button = root.shadowRoot.querySelector('button');
    expect(button).not.toBe(null);
    expect(button.getAttribute('aria-label')).toBe('Descartar aviso');
    expect(button.getAttribute('type')).toBe('button');
  });

  it('emits chDismiss when the dismiss button is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-alert dismissLabel="Descartar">Guardado</ch-alert>);
    const dismissSpy = spyOnEvent('chDismiss');

    root.shadowRoot.querySelector('button').click();
    await waitForChanges();

    expect(dismissSpy).toHaveReceivedEvent();
  });

  it('keeps the alert in the DOM after dismissing, leaving removal to the consumer', async () => {
    const { root, waitForChanges } = await render(<ch-alert dismissLabel="Descartar">Guardado</ch-alert>);

    root.shadowRoot.querySelector('button').click();
    await waitForChanges();

    expect(root.shadowRoot.querySelector('.alert')).not.toBe(null);
  });

  it('replaces the node when the variant escalates, rather than mutating its role', async () => {
    const { root, waitForChanges } = await render(<ch-alert>Guardado</ch-alert>);
    const original = root.shadowRoot.querySelector('.alert');
    expect(original.getAttribute('role')).toBe('status');

    (root as HTMLChAlertElement).variant = 'warning';
    await waitForChanges();

    const updated = root.shadowRoot.querySelector('.alert');
    expect(updated.getAttribute('role')).toBe('alert');
    expect(updated.className).toBe('alert alert--warning');
    // A live region that only had its role mutated is not reliably re-announced.
    expect(updated).not.toBe(original);
  });
});
