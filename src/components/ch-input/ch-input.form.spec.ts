import { describe, it, expect, beforeEach } from 'vitest';
import '/dist/components/ch-input.js';

const TICK = 0;

const settle = async () => {
  await customElements.whenDefined('ch-input');
  await new Promise(resolve => setTimeout(resolve, TICK));
};

const internals = (el: HTMLElement) => (el as unknown as { internals: ElementInternals }).internals;

describe('ch-input form association', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('submits its value with the form', async () => {
    document.body.innerHTML = `<form id="f"><ch-input name="email" value="hi@devschile.cl"></ch-input></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-input') as HTMLElement;

    expect(form.elements.namedItem('email')).toBe(el);
    expect(internals(el).form).toBe(form);
    expect(new FormData(form).get('email')).toBe('hi@devschile.cl');
  });

  it('submits an empty value when the input is empty', async () => {
    document.body.innerHTML = `<form id="f"><ch-input name="email"></ch-input></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;

    expect(new FormData(form).get('email')).toBe('');
  });

  it('updates the submitted value on input', async () => {
    document.body.innerHTML = `<form id="f"><ch-input name="email"></ch-input></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-input') as HTMLElement;
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;

    input.value = 'hi@devschile.cl';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle();

    expect(new FormData(form).get('email')).toBe('hi@devschile.cl');
  });

  it('does not submit a disabled input', async () => {
    document.body.innerHTML = `<form id="f"><ch-input name="a" value="1"></ch-input><ch-input name="b" value="2" disabled></ch-input></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const fd = new FormData(form);

    expect(fd.get('a')).toBe('1');
    expect(fd.has('b')).toBe(false);
  });

  it('is disabled and not submitted inside a disabled fieldset', async () => {
    document.body.innerHTML = `<form id="f"><fieldset disabled><ch-input name="a" value="1"></ch-input></fieldset></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-input') as HTMLElement;
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;

    expect(input.disabled).toBe(true);
    expect(new FormData(form).has('a')).toBe(false);
  });

  it('is valid by default', async () => {
    document.body.innerHTML = `<form id="f"><ch-input name="email" value="hi@devschile.cl"></ch-input></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-input') as HTMLElement;

    expect(internals(el).checkValidity()).toBe(true);
    expect(el.matches(':valid')).toBe(true);
    expect(internals(el).validationMessage).toBe('');
    expect(form.checkValidity()).toBe(true);
  });

  it('is invalid when required and empty', async () => {
    document.body.innerHTML = `<form id="f"><ch-input name="email" required></ch-input></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-input') as HTMLElement;

    expect(internals(el).checkValidity()).toBe(false);
    expect(el.matches(':invalid')).toBe(true);
    expect(internals(el).validationMessage).not.toBe('');
    expect(form.checkValidity()).toBe(false);
  });

  it('does not mark a required-empty field as touched on focus, only after blur or submit', async () => {
    document.body.innerHTML = `<form id="f"><ch-input name="email" required></ch-input></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-input') as HTMLElement;
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;

    expect(el.hasAttribute('data-touched')).toBe(false);

    input.focus();
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle();
    expect(el.hasAttribute('data-touched')).toBe(false);

    input.blur();
    await settle();
    expect(el.hasAttribute('data-touched')).toBe(true);

    el.removeAttribute('data-touched');
    form.requestSubmit();
    await settle();
    expect(el.hasAttribute('data-touched')).toBe(true);
  });

  it('becomes valid when a required empty input receives a value', async () => {
    document.body.innerHTML = `<form id="f"><ch-input name="email" required></ch-input></form>`;
    await settle();
    const el = document.querySelector('ch-input') as HTMLElement;
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;

    input.value = 'hi@devschile.cl';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle();

    expect(internals(el).checkValidity()).toBe(true);
    expect(el.matches(':invalid')).toBe(false);
  });

  it('reflects the invalid/errorMessage props through the constraint validation API', async () => {
    document.body.innerHTML = `<form><ch-input name="email" value="x" invalid error-message="Correo inválido"></ch-input></form>`;
    await settle();
    const el = document.querySelector('ch-input') as HTMLElement;

    expect(internals(el).checkValidity()).toBe(false);
    expect(internals(el).validationMessage).toBe('Correo inválido');
  });

  it('resets to the initial value on form reset', async () => {
    document.body.innerHTML = `<form id="f"><ch-input name="email" value="hi@devschile.cl"></ch-input></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-input') as HTMLElement;
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;

    input.value = 'changed@devschile.cl';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle();

    form.reset();
    await settle();

    expect((el as unknown as { value: string }).value).toBe('hi@devschile.cl');
    expect(new FormData(form).get('email')).toBe('hi@devschile.cl');
  });
});
