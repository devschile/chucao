import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-checkbox.tsx';

describe('ch-checkbox', () => {
  it('renders a checkbox with the associated label', async () => {
    const { root } = await render(<ch-checkbox label="Acepto los términos" />);
    const input = root.shadowRoot?.querySelector('input');
    const label = root.shadowRoot?.querySelector('label');

    expect(input?.type).toBe('checkbox');
    expect(input?.id).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(input?.id);
    expect(label?.textContent).toContain('Acepto los términos');
  });

  it('reflects the checked state and emits chChange with the new value', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-checkbox label="Sí" checked />);
    const changeSpy = spyOnEvent('chChange');
    const input = root.shadowRoot?.querySelector('input') as HTMLInputElement;

    expect(input?.checked).toBe(true);

    input.checked = false;
    input.dispatchEvent(new Event('change'));
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEvent();
    expect(changeSpy).toHaveReceivedEventDetail(false);
    expect((root as unknown as { checked: boolean }).checked).toBe(false);
  });

  it('renders the name and value attributes, disabled and required state', async () => {
    const { root } = await render(<ch-checkbox label="Sí" name="terms" value="yes" disabled required />);
    const input = root.shadowRoot?.querySelector('input');

    expect(input?.getAttribute('name')).toBe('terms');
    expect(input?.getAttribute('value')).toBe('yes');
    expect(input?.hasAttribute('disabled')).toBe(true);
    expect(input?.hasAttribute('required')).toBe(true);
  });

  it('renders no label element when the label prop is not set', async () => {
    const { root } = await render(<ch-checkbox />);
    expect(root.shadowRoot?.querySelector('.label-text')).toBeNull();
  });
});

describe('ch-checkbox validation states', () => {
  it('renders hint text wired via aria-describedby', async () => {
    const { root } = await render(<ch-checkbox label="Sí" hint="Marca esta casilla" />);
    const input = root.shadowRoot?.querySelector('input');
    const hint = root.shadowRoot?.querySelector('p.hint');

    expect(hint?.textContent).toBe('Marca esta casilla');
    expect(input?.getAttribute('aria-describedby')).toBe(hint?.id);
  });

  it('renders the error message and aria-invalid when invalid', async () => {
    const { root } = await render(<ch-checkbox label="Sí" invalid errorMessage="Debes aceptar" />);
    const input = root.shadowRoot?.querySelector('input');
    const error = root.shadowRoot?.querySelector('p.error');

    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.classList.contains('input--invalid')).toBe(true);
    expect(error?.getAttribute('role')).toBe('alert');
    expect(input?.getAttribute('aria-describedby')).toBe(error?.id);
  });
});
