import { describe, it, expect, beforeEach } from 'vitest';
import '/dist/components/ch-switch.js';

const TICK = 0;

const settle = async () => {
  await customElements.whenDefined('ch-switch');
  await new Promise(resolve => setTimeout(resolve, TICK));
};

const internals = (el: HTMLElement) => (el as unknown as { internals: ElementInternals }).internals;

describe('ch-switch form association', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('submits its value only when on', async () => {
    document.body.innerHTML = `<form id="f"><ch-switch name="theme" checked></ch-switch><ch-switch name="optin"></ch-switch></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const fd = new FormData(form);

    expect(form.elements.namedItem('theme')).toBeInstanceOf(HTMLElement);
    expect(fd.get('theme')).toBe('on');
    expect(fd.has('optin')).toBe(false);
  });

  it('does not submit a disabled switch', async () => {
    document.body.innerHTML = `<form id="f"><ch-switch name="a" checked></ch-switch><ch-switch name="b" checked disabled></ch-switch></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const fd = new FormData(form);

    expect(fd.has('a')).toBe(true);
    expect(fd.has('b')).toBe(false);
  });

  it('is invalid when required and off and valid once turned on', async () => {
    document.body.innerHTML = `<form id="f"><ch-switch name="accept" required></ch-switch></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-switch') as HTMLElement;

    expect(internals(el).checkValidity()).toBe(false);
    expect(el.matches(':invalid')).toBe(true);
    expect(form.checkValidity()).toBe(false);

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();

    expect(internals(el).checkValidity()).toBe(true);
    expect(form.checkValidity()).toBe(true);
  });

  it('resets to the initial state on form reset', async () => {
    document.body.innerHTML = `<form id="f"><ch-switch name="accept" checked></ch-switch></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-switch') as HTMLElement;
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;

    input.checked = false;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();

    form.reset();
    await settle();

    expect((el as unknown as { checked: boolean }).checked).toBe(true);
    expect(new FormData(form).get('accept')).toBe('on');
  });
});
