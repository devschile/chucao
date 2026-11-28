import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-number-input.tsx';

describe('ch-number-input', () => {
  it('renders a text input with a numeric inputmode, not type=number', async () => {
    const { root } = await render(<ch-number-input label="Monto" />);

    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('text');
    expect(input.getAttribute('inputmode')).toBe('decimal');
  });

  it('uses a numeric inputmode without decimals for CLP', async () => {
    const { root } = await render(<ch-number-input label="Monto" format="clp" />);

    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('inputmode')).toBe('numeric');
  });

  it('displays a preformatted CLP value and keeps the canonical digits', async () => {
    const { root } = await render(<ch-number-input label="Monto" format="clp" value="1234567" />);

    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input.value.replace(/\u00a0|\./gu, '')).toBe('1234567');
    expect((root as unknown as { value: string }).value).toBe('1234567');
  });

  it('association: renders the label bound to the input id', async () => {
    const { root } = await render(<ch-number-input label="Monto" />);

    const label = root.shadowRoot.querySelector('label') as HTMLLabelElement;
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(label.htmlFor).toBe(input.id);
  });

  it('strips grouping and symbols from CLP before emitting', async () => {
    const { root } = await render(<ch-number-input label="Monto" format="clp" />);
    const emitted: string[] = [];
    root.addEventListener('chInput', ev => emitted.push((ev as CustomEvent<string>).detail));

    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    input.value = '1.234.567';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(emitted).toEqual(['1234567']);
  });

  it('keeps an in-progress decimal draft instead of eating the separator', async () => {
    const { root } = await render(<ch-number-input label="Precio" />);
    const emitted: string[] = [];
    root.addEventListener('chInput', ev => emitted.push((ev as CustomEvent<string>).detail));

    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    input.value = '12.';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(input.value).toBe('12.');
    expect(emitted).toEqual(['12.']);
  });

  it('is empty, not zero, when the field is cleared', async () => {
    const { root } = await render(<ch-number-input label="Precio" value="5" />);
    const emitted: string[] = [];
    root.addEventListener('chInput', ev => emitted.push((ev as CustomEvent<string>).detail));

    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(emitted).toEqual(['']);
  });

  it('shows a range error as a custom message', async () => {
    const { root } = await render(<ch-number-input label="Cantidad" min={1} max={99} value="500" />);
    root.dispatchEvent(new Event('slotchange'));
    await new Promise(resolve => setTimeout(resolve, 0));

    const { rangeError } = root as unknown as { rangeError: () => string | undefined };
    expect(rangeError.call(root)).toBe('Enter a value of at most 99.');
  });
});
