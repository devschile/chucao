import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-radio.tsx';

describe('ch-radio', () => {
  it('renders one radio input per option, all sharing the same name', async () => {
    const options = [
      { label: 'Chile', value: 'cl' },
      { label: 'Argentina', value: 'ar' },
    ];
    const { root } = await render(<ch-radio options={options} name="country" />);
    const cl = root.shadowRoot?.querySelector('input[value="cl"]') as HTMLInputElement;
    const ar = root.shadowRoot?.querySelector('input[value="ar"]') as HTMLInputElement;

    expect(cl.type).toBe('radio');
    expect(ar.type).toBe('radio');
    expect(cl.getAttribute('name')).toBe('country');
    expect(ar.getAttribute('name')).toBe('country');
    expect(root.shadowRoot?.querySelector('div')?.getAttribute('role')).toBe('radiogroup');
  });

  it('pre-selects the given value', async () => {
    const options = [
      { label: 'Chile', value: 'cl' },
      { label: 'Argentina', value: 'ar' },
    ];
    const { root } = await render(<ch-radio options={options} value="ar" />);
    const cl = root.shadowRoot?.querySelector('input[value="cl"]') as HTMLInputElement;
    const ar = root.shadowRoot?.querySelector('input[value="ar"]') as HTMLInputElement;

    expect(cl.checked).toBe(false);
    expect(ar.checked).toBe(true);
  });

  it('renders a disabled option and the group disabled state', async () => {
    const options = [
      { label: 'Chile', value: 'cl' },
      { label: 'Argentina', value: 'ar', disabled: true },
    ];
    const { root } = await render(<ch-radio options={options} disabled />);
    const cl = root.shadowRoot?.querySelector('input[value="cl"]') as HTMLInputElement;
    const ar = root.shadowRoot?.querySelector('input[value="ar"]') as HTMLInputElement;

    expect(cl.hasAttribute('disabled')).toBe(true);
    expect(ar.hasAttribute('disabled')).toBe(true);
  });

  it('emits chChange with the new value when an option is selected', async () => {
    const options = [
      { label: 'Chile', value: 'cl' },
      { label: 'Argentina', value: 'ar' },
    ];
    const { root, spyOnEvent, waitForChanges } = await render(<ch-radio options={options} />);
    const changeSpy = spyOnEvent('chChange');
    const ar = root.shadowRoot?.querySelector('input[value="ar"]') as HTMLInputElement;

    ar.checked = true;
    ar.dispatchEvent(new Event('change'));
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEvent();
    expect(changeSpy).toHaveReceivedEventDetail('ar');
    expect((root as unknown as { value: string }).value).toBe('ar');
  });

  it('renders the group label associated via aria-labelledby', async () => {
    const options = [{ label: 'Chile', value: 'cl' }];
    const { root } = await render(<ch-radio options={options} label="País" />);
    const group = root.shadowRoot?.querySelector('div[role="radiogroup"]');
    const label = root.shadowRoot?.querySelector('.group-label');

    expect(label?.textContent).toBe('País');
    expect(group?.getAttribute('aria-labelledby')).toBe(label?.id);
  });
});

describe('ch-radio validation states', () => {
  it('renders hint text wired via aria-describedby', async () => {
    const options = [{ label: 'Chile', value: 'cl' }];
    const { root } = await render(<ch-radio options={options} hint="Elige uno" />);
    const input = root.shadowRoot?.querySelector('input');
    const hint = root.shadowRoot?.querySelector('p.hint');

    expect(hint?.textContent).toBe('Elige uno');
    expect(input?.getAttribute('aria-describedby')).toBe(hint?.id);
  });

  it('renders the error message and aria-invalid when invalid', async () => {
    const options = [{ label: 'Chile', value: 'cl' }];
    const { root } = await render(<ch-radio options={options} invalid errorMessage="Debes elegir" />);
    const input = root.shadowRoot?.querySelector('input');
    const error = root.shadowRoot?.querySelector('p.error');

    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(error?.getAttribute('role')).toBe('alert');
    expect(input?.getAttribute('aria-describedby')).toBe(error?.id);
  });
});
