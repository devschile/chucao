import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-input.tsx';

describe('ch-input', () => {
  it('renders a text input by default', async () => {
    const { root } = await render(<ch-input placeholder="Type here" />);
    await expect(root).toEqualHtml(`
      <ch-input class="hydrated">
        <mock:shadow-root>
          <input class="input" type="text" placeholder="Type here" value>
        </mock:shadow-root>
      </ch-input>
    `);
  });

  it('renders a disabled input with the given type and value', async () => {
    const { root } = await render(<ch-input type="email" value="hi@devschile.cl" disabled />);
    await expect(root).toEqualHtml(`
      <ch-input disabled class="hydrated">
        <mock:shadow-root>
          <input class="input" type="email" disabled value="hi@devschile.cl">
        </mock:shadow-root>
      </ch-input>
    `);
    const input = root.shadowRoot?.querySelector('input');
    expect(input?.value).toBe('hi@devschile.cl');
  });

  it('renders the name attribute and required state', async () => {
    const { root } = await render(<ch-input name="email" required />);
    const input = root.shadowRoot?.querySelector('input');
    expect(input?.getAttribute('name')).toBe('email');
    expect(input?.required).toBe(true);
  });

  it('emits chInput on every keystroke and updates the value', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-input />);
    const inputSpy = spyOnEvent('chInput');
    const input = root.shadowRoot?.querySelector('input') as HTMLInputElement;

    input.value = 'hi@devschile.cl';
    input.dispatchEvent(new Event('input'));
    await waitForChanges();

    expect(inputSpy).toHaveReceivedEvent();
    expect(inputSpy).toHaveReceivedEventDetail('hi@devschile.cl');
    expect((root as unknown as { value: string }).value).toBe('hi@devschile.cl');
  });

  it('emits chChange when the value is committed', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-input />);
    const changeSpy = spyOnEvent('chChange');
    const input = root.shadowRoot?.querySelector('input') as HTMLInputElement;

    input.value = 'hi@devschile.cl';
    input.dispatchEvent(new Event('change'));
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEvent();
    expect(changeSpy).toHaveReceivedEventDetail('hi@devschile.cl');
  });

  it('renders an associated label when the label prop is set', async () => {
    const { root } = await render(<ch-input label="Correo electrónico" />);
    const label = root.shadowRoot?.querySelector('label');
    const input = root.shadowRoot?.querySelector('input');

    expect(label?.textContent).toBe('Correo electrónico');
    expect(input?.id).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(input?.id);
  });

  it('renders no label element when the label prop is not set', async () => {
    const { root } = await render(<ch-input />);
    expect(root.shadowRoot?.querySelector('label')).toBeNull();
  });
});

describe('ch-input validation states', () => {
  it('renders hint text wired via aria-describedby', async () => {
    const { root } = await render(<ch-input hint="Máx. 20 caracteres" />);
    const input = root.shadowRoot?.querySelector('input');
    const hint = root.shadowRoot?.querySelector('p.hint');

    expect(hint?.textContent).toBe('Máx. 20 caracteres');
    expect(input?.getAttribute('aria-describedby')).toBe(hint?.id);
    expect(input?.hasAttribute('aria-invalid')).toBe(false);
  });

  it('renders the error message and aria-invalid when invalid', async () => {
    const { root } = await render(<ch-input invalid errorMessage="Correo inválido" />);
    const input = root.shadowRoot?.querySelector('input');
    const error = root.shadowRoot?.querySelector('p.error');

    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.classList.contains('input--invalid')).toBe(true);
    expect(error?.textContent).toBe('Correo inválido');
    expect(error?.getAttribute('role')).toBe('alert');
    expect(input?.getAttribute('aria-describedby')).toBe(error?.id);
  });

  it('replaces the hint with the error message in the invalid state', async () => {
    const { root } = await render(<ch-input hint="Ayuda" invalid errorMessage="Algo salió mal" />);
    expect(root.shadowRoot?.querySelector('p.hint')).toBeNull();
    expect(root.shadowRoot?.querySelector('p.error')?.textContent).toBe('Algo salió mal');
  });

  it('does not render the error message when not invalid', async () => {
    const { root } = await render(<ch-input errorMessage="Correo inválido" />);
    const input = root.shadowRoot?.querySelector('input');
    expect(root.shadowRoot?.querySelector('p.error')).toBeNull();
    expect(input?.hasAttribute('aria-invalid')).toBe(false);
    expect(input?.hasAttribute('aria-describedby')).toBe(false);
  });
});
