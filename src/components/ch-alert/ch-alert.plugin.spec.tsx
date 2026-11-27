import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-alert.tsx';

describe('ch-alert', () => {
  it('renders a neutral alert announced politely by default', async () => {
    const { root } = await render(<ch-alert>Guardado</ch-alert>);
    await expect(root).toEqualHtml(`
      <ch-alert class="hydrated">
        <mock:shadow-root>
          <div class="alert alert--default" role="status">
            <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
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
            <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
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

  it('marks every variant with a decorative icon so the state is not colour-only', async () => {
    const seen = await Promise.all(
      (['default', 'positive', 'warning'] as const).map(async variant => {
        const { root } = await render(<ch-alert variant={variant}>Texto</ch-alert>);
        const icon = root.shadowRoot.querySelector('.alert-icon');
        return { present: icon !== null, hidden: icon.getAttribute('aria-hidden'), shapes: icon.children.length };
      }),
    );

    expect(seen.every(({ present, hidden, shapes }) => present && hidden === 'true' && shapes > 0)).toBe(true);
  });

  it('gives each variant a different glyph, so shape carries the meaning', async () => {
    const glyphs = await Promise.all(
      (['default', 'positive', 'warning'] as const).map(async variant => {
        const { root } = await render(<ch-alert variant={variant}>Texto</ch-alert>);
        return root.shadowRoot.querySelector('.alert-icon').innerHTML;
      }),
    );

    expect(new Set(glyphs).size).toBe(3);
  });

  it('lets the consumer drop the icon when the copy already carries the cue', async () => {
    const { root } = await render(<ch-alert statusCue={false}>Texto</ch-alert>);

    expect(root.shadowRoot.querySelector('.alert-icon')).toBe(null);
  });
});
