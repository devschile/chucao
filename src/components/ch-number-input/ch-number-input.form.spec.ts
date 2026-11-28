import { describe, it, expect, beforeEach } from 'vitest';
import '/dist/components/ch-number-input.js';

/**
 * Form association, `ElementInternals` and intermediate typing states need a
 * real browser: mock-doc models none of them.
 */

const settle = async () => {
  await customElements.whenDefined('ch-number-input');
  await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 30)));
};

const internals = (el: HTMLElement) => (el as unknown as { internals: ElementInternals }).internals;

async function mount(html: string) {
  await customElements.whenDefined('ch-number-input');
  document.body.innerHTML = html;
  await settle();
  return document.querySelector('ch-number-input') as HTMLElement;
}

function type(el: HTMLElement, text: string) {
  const input = el.shadowRoot.querySelector('input') as HTMLInputElement;
  input.value = text;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('ch-number-input form association', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('submits canonical CLP digits for a formatted display', async () => {
    const el = await mount(`<form id="f"><ch-number-input name="monto" format="clp" value="1234567"></ch-number-input></form>`);
    const form = document.getElementById('f') as HTMLFormElement;

    expect(new FormData(form).get('monto')).toBe('1234567');
    expect(internals(el).form).toBe(form);
  });

  it('submits an empty string, not zero, when the field is cleared', async () => {
    const el = await mount(`<form id="f"><ch-number-input name="monto" value="10"></ch-number-input></form>`);
    type(el, '');
    const form = document.getElementById('f') as HTMLFormElement;

    expect(new FormData(form).get('monto')).toBe('');
    expect(internals(el).checkValidity()).toBe(true);
  });

  it('is invalid when required and empty', async () => {
    await mount(`<form id="f"><ch-number-input name="monto" required></ch-number-input></form>`);
    const el = document.querySelector('ch-number-input') as HTMLElement;
    const form = document.getElementById('f') as HTMLFormElement;

    expect(internals(el).checkValidity()).toBe(false);
    expect(internals(el).validationMessage).not.toBe('');
    expect(form.checkValidity()).toBe(false);
  });

  it('marks a partial entry like a lone minus as empty, not as -0', async () => {
    const el = await mount(`<form id="f"><ch-number-input name="monto" required></ch-number-input></form>`);
    type(el, '-');
    const form = document.getElementById('f') as HTMLFormElement;

    expect(new FormData(form).get('monto')).toBe('');
    expect(internals(el).checkValidity()).toBe(false);
  });

  it('reports a custom error message through the constraint API', async () => {
    const el = await mount(`<form><ch-number-input name="monto" value="5" invalid error-message="Monto inválido"></ch-number-input></form>`);

    expect(internals(el).checkValidity()).toBe(false);
    expect(internals(el).validationMessage).toBe('Monto inválido');
  });

  it('does not submit inside a disabled fieldset', async () => {
    await mount(`<form id="f"><fieldset disabled><ch-number-input name="monto" value="7"></ch-number-input></fieldset></form>`);
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-number-input') as HTMLElement;
    const input = el.shadowRoot.querySelector('input') as HTMLInputElement;

    expect(input.disabled).toBe(true);
    expect(new FormData(form).has('monto')).toBe(false);
  });

  it('resets to its initial value', async () => {
    const el = await mount(`<form id="f"><ch-number-input name="monto" value="42"></ch-number-input></form>`);
    type(el, '99');
    const form = document.getElementById('f') as HTMLFormElement;

    form.reset();
    await settle();

    expect(new FormData(form).get('monto')).toBe('42');
    expect((el.shadowRoot.querySelector('input') as HTMLInputElement).value).toBe('42');
  });

  it('never submits a duplicate entry', async () => {
    await mount(`<form id="f"><ch-number-input name="monto" value="3"></ch-number-input></form>`);
    const form = document.getElementById('f') as HTMLFormElement;

    expect(new FormData(form).getAll('monto')).toEqual(['3']);
  });
});
