import { describe, it, expect, beforeEach } from 'vitest';
import '/dist/components/ch-textarea.js';

const TICK = 0;

const settle = async () => {
  await customElements.whenDefined('ch-textarea');
  await new Promise(resolve => setTimeout(resolve, TICK));
};

const internals = (el: HTMLElement) => (el as unknown as { internals: ElementInternals }).internals;

describe('ch-textarea form association', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('submits its value with the form', async () => {
    document.body.innerHTML = `<form id="f"><ch-textarea name="bio" value="Hola"></ch-textarea></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-textarea') as HTMLElement;

    expect(form.elements.namedItem('bio')).toBe(el);
    expect(internals(el).form).toBe(form);
    expect(new FormData(form).get('bio')).toBe('Hola');
  });

  it('updates the submitted value on input', async () => {
    document.body.innerHTML = `<form id="f"><ch-textarea name="bio"></ch-textarea></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-textarea') as HTMLElement;
    const textarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

    textarea.value = 'Hola';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    await settle();

    expect(new FormData(form).get('bio')).toBe('Hola');
  });

  it('does not submit a disabled textarea', async () => {
    document.body.innerHTML = `<form id="f"><ch-textarea name="a" value="1"></ch-textarea><ch-textarea name="b" value="2" disabled></ch-textarea></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const fd = new FormData(form);

    expect(fd.get('a')).toBe('1');
    expect(fd.has('b')).toBe(false);
  });

  it('is invalid when required and empty and valid once filled', async () => {
    document.body.innerHTML = `<form id="f"><ch-textarea name="bio" required></ch-textarea></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-textarea') as HTMLElement;

    expect(internals(el).checkValidity()).toBe(false);
    expect(el.matches(':invalid')).toBe(true);
    expect(form.checkValidity()).toBe(false);

    const textarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'Hola';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    await settle();

    expect(internals(el).checkValidity()).toBe(true);
    expect(form.checkValidity()).toBe(true);
  });

  it('reflects the invalid/errorMessage props through the constraint validation API', async () => {
    document.body.innerHTML = `<form><ch-textarea name="bio" value="x" invalid error-message="Texto inválido"></ch-textarea></form>`;
    await settle();
    const el = document.querySelector('ch-textarea') as HTMLElement;

    expect(internals(el).checkValidity()).toBe(false);
    expect(internals(el).validationMessage).toBe('Texto inválido');
  });

  it('resets to the initial value on form reset', async () => {
    document.body.innerHTML = `<form id="f"><ch-textarea name="bio" value="Hola"></ch-textarea></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-textarea') as HTMLElement;
    const textarea = el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

    textarea.value = 'Cambió';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    await settle();

    form.reset();
    await settle();

    expect((el as unknown as { value: string }).value).toBe('Hola');
    expect(new FormData(form).get('bio')).toBe('Hola');
  });
});
