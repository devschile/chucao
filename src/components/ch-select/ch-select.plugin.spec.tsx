import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-select.tsx';

describe('ch-select', () => {
  it('renders the given options', async () => {
    const options = [
      { label: 'Chile', value: 'cl' },
      { label: 'Argentina', value: 'ar' },
    ];
    const { root } = await render(<ch-select options={options} />);
    expect(root.shadowRoot?.innerHTML).toBe('<select class="select"><option value="cl">Chile</option><option value="ar">Argentina</option></select>');
  });

  it('renders a disabled placeholder option and pre-selects the given value', async () => {
    const options = [
      { label: 'Chile', value: 'cl' },
      { label: 'Argentina', value: 'ar' },
    ];
    const { root } = await render(<ch-select options={options} value="ar" placeholder="Elige un país" />);
    expect(root.shadowRoot?.innerHTML).toBe(
      '<select class="select"><option value="" disabled="" hidden="">Elige un país</option><option value="cl">Chile</option><option value="ar" selected="">Argentina</option></select>',
    );
    const select = root.shadowRoot?.querySelector('select');
    expect(select?.querySelector('option[selected]')?.getAttribute('value')).toBe('ar');
  });

  it('renders the name attribute, disabled and required state', async () => {
    const options = [{ label: 'Chile', value: 'cl' }];
    const { root } = await render(<ch-select options={options} name="country" disabled required />);
    const select = root.shadowRoot?.querySelector('select');
    expect(select?.getAttribute('name')).toBe('country');
    expect(select?.hasAttribute('disabled')).toBe(true);
    expect(select?.hasAttribute('required')).toBe(true);
  });

  it('emits chChange with the new value when an option is selected', async () => {
    const options = [
      { label: 'Chile', value: 'cl' },
      { label: 'Argentina', value: 'ar' },
    ];
    const { root, spyOnEvent, waitForChanges } = await render(<ch-select options={options} />);
    const changeSpy = spyOnEvent('chChange');
    const select = root.shadowRoot?.querySelector('select') as HTMLSelectElement;

    select.value = 'ar';
    select.dispatchEvent(new Event('change'));
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEvent();
    expect(changeSpy).toHaveReceivedEventDetail('ar');
    expect((root as unknown as { value: string }).value).toBe('ar');
  });

  it('renders an associated label when the label prop is set', async () => {
    const options = [{ label: 'Chile', value: 'cl' }];
    const { root } = await render(<ch-select options={options} label="País" />);
    const label = root.shadowRoot?.querySelector('label');
    const select = root.shadowRoot?.querySelector('select');

    expect(label?.textContent).toBe('País');
    expect(select?.id).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(select?.id);
  });

  it('renders no label element when the label prop is not set', async () => {
    const options = [{ label: 'Chile', value: 'cl' }];
    const { root } = await render(<ch-select options={options} />);
    expect(root.shadowRoot?.querySelector('label')).toBeNull();
  });
});
