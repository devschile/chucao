import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-textarea.tsx';

describe('ch-textarea', () => {
  it('renders a textarea with the given value, name, rows and placeholder', async () => {
    const { root } = await render(<ch-textarea value="Hola" name="message" rows={6} placeholder="Escribe aquí" />);
    const textarea = root.shadowRoot?.querySelector('textarea');

    expect(textarea?.getAttribute('value')).toBe('Hola');
    expect(textarea?.getAttribute('name')).toBe('message');
    expect(textarea?.getAttribute('rows')).toBe('6');
    expect(textarea?.getAttribute('placeholder')).toBe('Escribe aquí');
  });

  it('renders a disabled and required textarea', async () => {
    const { root } = await render(<ch-textarea disabled required />);
    const textarea = root.shadowRoot?.querySelector('textarea');

    expect(textarea?.hasAttribute('disabled')).toBe(true);
    expect(textarea?.hasAttribute('required')).toBe(true);
  });

  it('emits chInput on every keystroke and updates the value', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-textarea />);
    const inputSpy = spyOnEvent('chInput');
    const textarea = root.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

    textarea.value = 'hola mundo';
    textarea.dispatchEvent(new Event('input'));
    await waitForChanges();

    expect(inputSpy).toHaveReceivedEvent();
    expect(inputSpy).toHaveReceivedEventDetail('hola mundo');
    expect((root as unknown as { value: string }).value).toBe('hola mundo');
  });

  it('emits chChange when the value is committed', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-textarea />);
    const changeSpy = spyOnEvent('chChange');
    const textarea = root.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

    textarea.value = 'hola mundo';
    textarea.dispatchEvent(new Event('change'));
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEvent();
    expect(changeSpy).toHaveReceivedEventDetail('hola mundo');
  });

  it('renders an associated label when the label prop is set', async () => {
    const { root } = await render(<ch-textarea label="Mensaje" />);
    const label = root.shadowRoot?.querySelector('label');
    const textarea = root.shadowRoot?.querySelector('textarea');

    expect(label?.textContent).toBe('Mensaje');
    expect(textarea?.id).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(textarea?.id);
  });
});

describe('ch-textarea validation states', () => {
  it('renders hint text wired via aria-describedby', async () => {
    const { root } = await render(<ch-textarea hint="Máx. 280 caracteres" />);
    const textarea = root.shadowRoot?.querySelector('textarea');
    const hint = root.shadowRoot?.querySelector('p.hint');

    expect(hint?.textContent).toBe('Máx. 280 caracteres');
    expect(textarea?.getAttribute('aria-describedby')).toBe(hint?.id);
  });

  it('renders the error message and aria-invalid when invalid', async () => {
    const { root } = await render(<ch-textarea invalid errorMessage="Revisa el texto" />);
    const textarea = root.shadowRoot?.querySelector('textarea');
    const error = root.shadowRoot?.querySelector('p.error');

    expect(textarea?.getAttribute('aria-invalid')).toBe('true');
    expect(textarea?.classList.contains('textarea--invalid')).toBe(true);
    expect(error?.getAttribute('role')).toBe('alert');
    expect(textarea?.getAttribute('aria-describedby')).toBe(error?.id);
  });
});
