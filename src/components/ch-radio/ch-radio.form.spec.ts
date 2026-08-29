import { describe, it, expect, beforeEach } from 'vitest';
import '/dist/components/ch-radio.js';

const TICK = 0;

const settle = async () => {
  await customElements.whenDefined('ch-radio');
  await new Promise(resolve => setTimeout(resolve, TICK));
};

const internals = (el: HTMLElement) => (el as unknown as { internals: ElementInternals }).internals;

const makeForm = (props: Record<string, unknown> = {}) => {
  const form = document.createElement('form');
  form.id = 'f';
  const group = document.createElement('ch-radio');
  Object.assign(group, {
    name: 'country',
    options: [
      { label: 'Chile', value: 'cl' },
      { label: 'Argentina', value: 'ar' },
    ],
    ...props,
  });
  form.appendChild(group);
  document.body.appendChild(form);
  return { form, group };
};

describe('ch-radio form association', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('submits the selected value under the group name', async () => {
    const { form, group } = makeForm({ value: 'ar' });
    await settle();

    expect(form.elements.namedItem('country')).toBe(group);
    expect(internals(group).form).toBe(form);
    expect(new FormData(form).get('country')).toBe('ar');
  });

  it('does not submit when no option is selected', async () => {
    const { form } = makeForm();
    await settle();

    expect(new FormData(form).has('country')).toBe(false);
  });

  it('updates the submitted value when the selection changes', async () => {
    const { form } = makeForm({ value: 'cl' });
    await settle();
    const group = document.querySelector('ch-radio') as HTMLElement;
    const ar = group.shadowRoot?.querySelector('input[value="ar"]') as HTMLInputElement;

    ar.checked = true;
    ar.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();

    expect(new FormData(form).get('country')).toBe('ar');
  });

  it('does not submit a disabled group', async () => {
    const { form } = makeForm({ value: 'cl', disabled: true });
    await settle();

    expect(new FormData(form).has('country')).toBe(false);
  });

  it('is invalid when required and empty and valid once selected', async () => {
    const { form } = makeForm({ required: true });
    await settle();
    const group = document.querySelector('ch-radio') as HTMLElement;

    expect(internals(group).checkValidity()).toBe(false);
    expect(group.matches(':invalid')).toBe(true);
    expect(form.checkValidity()).toBe(false);

    const ar = group.shadowRoot?.querySelector('input[value="ar"]') as HTMLInputElement;
    ar.checked = true;
    ar.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();

    expect(internals(group).checkValidity()).toBe(true);
    expect(form.checkValidity()).toBe(true);
  });

  it('resets to the initial value on form reset', async () => {
    const { form } = makeForm({ value: 'cl' });
    await settle();
    const group = document.querySelector('ch-radio') as HTMLElement;
    const ar = group.shadowRoot?.querySelector('input[value="ar"]') as HTMLInputElement;

    ar.checked = true;
    ar.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();

    form.reset();
    await settle();

    expect((group as unknown as { value: string }).value).toBe('cl');
    expect(new FormData(form).get('country')).toBe('cl');
  });
});
