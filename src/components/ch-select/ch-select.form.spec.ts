import { describe, it, expect, beforeEach } from 'vitest';
import '/dist/components/ch-select.js';

const TICK = 0;

const settle = async () => {
  await customElements.whenDefined('ch-select');
  await new Promise(resolve => setTimeout(resolve, TICK));
};

const internals = (el: HTMLElement) => (el as unknown as { internals: ElementInternals }).internals;

const makeForm = (props: Record<string, unknown> = {}) => {
  const form = document.createElement('form');
  form.id = 'f';
  const sel = document.createElement('ch-select');
  Object.assign(sel, {
    name: 'country',
    options: [
      { label: 'Chile', value: 'cl' },
      { label: 'Argentina', value: 'ar' },
    ],
    ...props,
  });
  form.appendChild(sel);
  document.body.appendChild(form);
  return { form, sel };
};

describe('ch-select form association', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('submits the selected value', async () => {
    const { form, sel } = makeForm({ value: 'cl' });
    await settle();

    expect(form.elements.namedItem('country')).toBe(sel);
    expect(internals(sel).form).toBe(form);
    expect(new FormData(form).get('country')).toBe('cl');
  });

  it('submits an empty string when nothing is selected', async () => {
    const { form } = makeForm();
    await settle();

    expect(new FormData(form).get('country')).toBe('');
  });

  it('updates the submitted value when the selection changes', async () => {
    const { form } = makeForm({ value: 'cl' });
    await settle();
    const sel = document.querySelector('ch-select') as HTMLElement;
    const select = sel.shadowRoot?.querySelector('select') as HTMLSelectElement;

    select.value = 'ar';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();

    expect(new FormData(form).get('country')).toBe('ar');
  });

  it('does not submit a disabled select', async () => {
    const { form } = makeForm({ value: 'cl', disabled: true });
    await settle();

    expect(new FormData(form).has('country')).toBe(false);
  });

  it('is invalid when required and empty and valid once selected', async () => {
    const { form } = makeForm({ required: true });
    await settle();
    const sel = document.querySelector('ch-select') as HTMLElement;

    expect(internals(sel).checkValidity()).toBe(false);
    expect(sel.matches(':invalid')).toBe(true);
    expect(form.checkValidity()).toBe(false);

    const select = sel.shadowRoot?.querySelector('select') as HTMLSelectElement;
    select.value = 'cl';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();

    expect(internals(sel).checkValidity()).toBe(true);
    expect(form.checkValidity()).toBe(true);
  });

  it('resets to the initial value on form reset', async () => {
    const { form } = makeForm({ value: 'cl' });
    await settle();
    const sel = document.querySelector('ch-select') as HTMLElement;
    const select = sel.shadowRoot?.querySelector('select') as HTMLSelectElement;

    select.value = 'ar';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();

    form.reset();
    await settle();

    expect((sel as unknown as { value: string }).value).toBe('cl');
    expect(new FormData(form).get('country')).toBe('cl');
  });
});
