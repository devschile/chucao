import { describe, it, expect, beforeEach } from 'vitest';
import '/dist/components/ch-checkbox.js';

const TICK = 0;

const settle = async () => {
  await customElements.whenDefined('ch-checkbox');
  await new Promise(resolve => setTimeout(resolve, TICK));
};

const internals = (el: HTMLElement) => (el as unknown as { internals: ElementInternals }).internals;

describe('ch-checkbox form association', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('submits its value only when checked', async () => {
    document.body.innerHTML = `<form id="f"><ch-checkbox name="accept" checked></ch-checkbox><ch-checkbox name="optin"></ch-checkbox></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const fd = new FormData(form);

    expect(form.elements.namedItem('accept')).toBeInstanceOf(HTMLElement);
    expect(fd.get('accept')).toBe('on');
    expect(fd.has('optin')).toBe(false);
  });

  it('submits the configured value when checked', async () => {
    document.body.innerHTML = `<form id="f"><ch-checkbox name="accept" value="yes" checked></ch-checkbox></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;

    expect(new FormData(form).get('accept')).toBe('yes');
  });

  it('starts submitting its value when checked', async () => {
    document.body.innerHTML = `<form id="f"><ch-checkbox name="accept"></ch-checkbox></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-checkbox') as HTMLElement;
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;

    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();

    expect(new FormData(form).get('accept')).toBe('on');
  });

  it('does not submit a disabled checkbox', async () => {
    document.body.innerHTML = `<form id="f"><ch-checkbox name="a" checked></ch-checkbox><ch-checkbox name="b" checked disabled></ch-checkbox></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const fd = new FormData(form);

    expect(fd.has('a')).toBe(true);
    expect(fd.has('b')).toBe(false);
  });

  it('is invalid when required and unchecked and valid once checked', async () => {
    document.body.innerHTML = `<form id="f"><ch-checkbox name="accept" required></ch-checkbox></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-checkbox') as HTMLElement;

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

  it('resets to the initial checked state on form reset', async () => {
    document.body.innerHTML = `<form id="f"><ch-checkbox name="accept" checked></ch-checkbox></form>`;
    await settle();
    const form = document.getElementById('f') as HTMLFormElement;
    const el = document.querySelector('ch-checkbox') as HTMLElement;
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
