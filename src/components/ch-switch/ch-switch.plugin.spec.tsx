import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-switch.tsx';

describe('ch-switch', () => {
  it('renders a switch with the associated label', async () => {
    const { root } = await render(<ch-switch label="Notificaciones" />);
    const input = root.shadowRoot?.querySelector('input');
    const label = root.shadowRoot?.querySelector('label');

    expect(input?.type).toBe('checkbox');
    expect(input?.getAttribute('role')).toBe('switch');
    expect(input?.id).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(input?.id);
    expect(label?.textContent).toContain('Notificaciones');
  });

  it('reflects the checked state via aria-checked', async () => {
    const { root } = await render(<ch-switch label="Sí" checked />);
    const input = root.shadowRoot?.querySelector('input');

    expect(input?.checked).toBe(true);
    expect(input?.getAttribute('aria-checked')).toBe('true');
  });

  it('emits chChange when toggled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-switch label="Sí" checked />);
    const changeSpy = spyOnEvent('chChange');
    const input = root.shadowRoot?.querySelector('input') as HTMLInputElement;

    input.checked = false;
    input.dispatchEvent(new Event('change'));
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEvent();
    expect(changeSpy).toHaveReceivedEventDetail(false);
    expect((root as unknown as { checked: boolean }).checked).toBe(false);
  });

  it('renders the name and value attributes, disabled and required state', async () => {
    const { root } = await render(<ch-switch label="Sí" name="alerts" value="yes" disabled required />);
    const input = root.shadowRoot?.querySelector('input');

    expect(input?.getAttribute('name')).toBe('alerts');
    expect(input?.getAttribute('value')).toBe('yes');
    expect(input?.hasAttribute('disabled')).toBe(true);
    expect(input?.hasAttribute('required')).toBe(true);
  });

  it('renders no label element when the label prop is not set', async () => {
    const { root } = await render(<ch-switch />);
    expect(root.shadowRoot?.querySelector('.label-text')).toBeNull();
  });
});

describe('ch-switch validation states', () => {
  it('renders hint text wired via aria-describedby', async () => {
    const { root } = await render(<ch-switch label="Sí" hint="Recibirás un correo" />);
    const input = root.shadowRoot?.querySelector('input');
    const hint = root.shadowRoot?.querySelector('p.hint');

    expect(hint?.textContent).toBe('Recibirás un correo');
    expect(input?.getAttribute('aria-describedby')).toBe(hint?.id);
  });

  it('renders the error message and aria-invalid when invalid', async () => {
    const { root } = await render(<ch-switch label="Sí" invalid errorMessage="Obligatorio" />);
    const input = root.shadowRoot?.querySelector('input');
    const error = root.shadowRoot?.querySelector('p.error');

    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(error?.getAttribute('role')).toBe('alert');
    expect(input?.getAttribute('aria-describedby')).toBe(error?.id);
  });
});
