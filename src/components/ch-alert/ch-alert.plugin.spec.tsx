import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-alert.tsx';

describe('ch-alert', () => {
  it('renders an informational alert announced politely by default', async () => {
    const { root } = await render(<ch-alert>Guardado</ch-alert>);
    const alert = root.shadowRoot.querySelector('.alert');
    expect(alert.className).toBe('alert alert--info');
    expect(alert.getAttribute('role')).toBe('status');
  });

  it('announces a warning assertively', async () => {
    const { root } = await render(<ch-alert variant="warning">Algo falló</ch-alert>);
    const alert = root.shadowRoot.querySelector('.alert');
    expect(alert.className).toBe('alert alert--warning');
    expect(alert.getAttribute('role')).toBe('alert');
  });

  it('announces a positive alert politely, since success is not urgent', async () => {
    const { root } = await render(<ch-alert variant="positive">Listo</ch-alert>);
    const alert = root.shadowRoot.querySelector('.alert');
    expect(alert.className).toBe('alert alert--positive');
    expect(alert.getAttribute('role')).toBe('status');
  });

  it('renders no dismiss button unless asked', async () => {
    const { root } = await render(<ch-alert>Guardado</ch-alert>);
    expect(root.shadowRoot.querySelector('button')).toBe(null);
  });

  it('labels the dismiss button from the dismissLabel prop', async () => {
    const { root } = await render(
      <ch-alert dismissible dismissLabel="Descartar aviso">
        Guardado
      </ch-alert>,
    );
    const button = root.shadowRoot.querySelector('button');
    expect(button).not.toBe(null);
    expect(button.getAttribute('aria-label')).toBe('Descartar aviso');
    expect(button.getAttribute('type')).toBe('button');
  });

  it('emits chDismiss when the dismiss button is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <ch-alert dismissible dismissLabel="Descartar">
        Guardado
      </ch-alert>,
    );
    const dismissSpy = spyOnEvent('chDismiss');

    root.shadowRoot.querySelector('button').click();
    await waitForChanges();

    expect(dismissSpy).toHaveReceivedEvent();
  });

  it('keeps the alert in the DOM after dismissing, leaving removal to the consumer', async () => {
    const { root, waitForChanges } = await render(
      <ch-alert dismissible dismissLabel="Descartar">
        Guardado
      </ch-alert>,
    );

    root.shadowRoot.querySelector('button').click();
    await waitForChanges();

    expect(root.shadowRoot.querySelector('.alert')).not.toBe(null);
  });
});
