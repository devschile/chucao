import { describe, it, expect, beforeEach } from 'vitest';
import '/dist/components/ch-segmented-control.js';

const TICK = 0;

const settle = async () => {
  await customElements.whenDefined('ch-segmented-control');
  await new Promise(resolve => setTimeout(resolve, TICK));
};

const internals = (el: HTMLElement) => (el as unknown as { internals: ElementInternals }).internals;

const makeForm = (props: Record<string, unknown> = {}) => {
  const form = document.createElement('form');
  form.id = 'f';
  const group = document.createElement('ch-segmented-control');
  Object.assign(group, {
    name: 'kind',
    options: [
      { label: 'Todas', value: 'all' },
      { label: 'Entradas', value: 'in' },
      { label: 'Salidas', value: 'out' },
    ],
    ...props,
  });
  form.appendChild(group);
  document.body.appendChild(form);
  return { form, group };
};

describe('ch-segmented-control form association', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('submits the selected value under the group name', async () => {
    const { form, group } = makeForm({ value: 'in' });
    await settle();

    expect(form.elements.namedItem('kind')).toBe(group);
    expect(internals(group).form).toBe(form);
    expect(new FormData(form).get('kind')).toBe('in');
  });

  it('does not submit when no option is selected', async () => {
    const { form } = makeForm();
    await settle();

    expect(new FormData(form).has('kind')).toBe(false);
  });

  it('updates the submitted value when the selection changes', async () => {
    const { form } = makeForm({ value: 'all' });
    await settle();
    const group = document.querySelector('ch-segmented-control') as HTMLElement;
    const out = group.shadowRoot?.querySelector('input[value="out"]') as HTMLInputElement;

    out.checked = true;
    out.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();

    expect(new FormData(form).get('kind')).toBe('out');
  });

  it('does not submit a disabled group', async () => {
    const { form } = makeForm({ value: 'all', disabled: true });
    await settle();

    expect(new FormData(form).has('kind')).toBe(false);
  });

  it('is invalid when required and empty and valid once selected', async () => {
    const { form } = makeForm({ required: true });
    await settle();
    const group = document.querySelector('ch-segmented-control') as HTMLElement;

    expect(internals(group).checkValidity()).toBe(false);
    expect(group.matches(':invalid')).toBe(true);
    expect(form.checkValidity()).toBe(false);

    const input = group.shadowRoot?.querySelector('input[value="in"]') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();

    expect(internals(group).checkValidity()).toBe(true);
    expect(form.checkValidity()).toBe(true);
  });

  it('resets to the initial value on form reset', async () => {
    const { form } = makeForm({ value: 'all' });
    await settle();
    const group = document.querySelector('ch-segmented-control') as HTMLElement;
    const input = group.shadowRoot?.querySelector('input[value="out"]') as HTMLInputElement;

    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();

    form.reset();
    await settle();

    expect((group as unknown as { value: string }).value).toBe('all');
    expect(new FormData(form).get('kind')).toBe('all');
  });
});
