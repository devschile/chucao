import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-segmented-control.tsx';

describe('ch-segmented-control', () => {
  it('renders one radio input per option, all sharing the same name', async () => {
    const options = [
      { label: 'Todas', value: 'all' },
      { label: 'Entradas', value: 'in' },
      { label: 'Salidas', value: 'out' },
    ];
    const { root } = await render(<ch-segmented-control options={options} name="kind" />);
    const all = root.shadowRoot?.querySelector('input[value="all"]') as HTMLInputElement;
    const out = root.shadowRoot?.querySelector('input[value="out"]') as HTMLInputElement;

    expect(all.type).toBe('radio');
    expect(out.type).toBe('radio');
    expect(all.getAttribute('name')).toBe('kind');
    expect(out.getAttribute('name')).toBe('kind');
    expect(root.shadowRoot?.querySelector('div[role="radiogroup"]')).not.toBe(null);
  });

  it('pre-selects the given value', async () => {
    const options = [
      { label: 'Todas', value: 'all' },
      { label: 'Entradas', value: 'in' },
    ];
    const { root } = await render(<ch-segmented-control options={options} value="in" />);
    const all = root.shadowRoot?.querySelector('input[value="all"]') as HTMLInputElement;
    const input = root.shadowRoot?.querySelector('input[value="in"]') as HTMLInputElement;

    expect(all.checked).toBe(false);
    expect(input.checked).toBe(true);
  });

  it('renders the md size by default and the sm size when set', async () => {
    const options = [{ label: 'Todas', value: 'all' }];
    const md = await render(<ch-segmented-control options={options} />);
    expect(md.root.shadowRoot?.querySelector('[role="radiogroup"]')?.className).toContain('segmented--md');

    const sm = await render(<ch-segmented-control options={options} size="sm" />);
    expect(sm.root.shadowRoot?.querySelector('[role="radiogroup"]')?.className).toContain('segmented--sm');
  });

  it('disables an option and the whole group', async () => {
    const options = [
      { label: 'Todas', value: 'all' },
      { label: 'Entradas', value: 'in', disabled: true },
    ];
    const { root } = await render(<ch-segmented-control options={options} disabled />);
    const all = root.shadowRoot?.querySelector('input[value="all"]') as HTMLInputElement;
    const input = root.shadowRoot?.querySelector('input[value="in"]') as HTMLInputElement;

    expect(all.hasAttribute('disabled')).toBe(true);
    expect(input.hasAttribute('disabled')).toBe(true);
  });

  it('emits chChange with the new value when a segment is selected', async () => {
    const options = [
      { label: 'Todas', value: 'all' },
      { label: 'Entradas', value: 'in' },
    ];
    const { root, spyOnEvent, waitForChanges } = await render(<ch-segmented-control options={options} />);
    const changeSpy = spyOnEvent('chChange');
    const input = root.shadowRoot?.querySelector('input[value="in"]') as HTMLInputElement;

    input.checked = true;
    input.dispatchEvent(new Event('change'));
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEvent();
    expect(changeSpy).toHaveReceivedEventDetail('in');
    expect((root as unknown as { value: string }).value).toBe('in');
  });

  it('renders the group label associated via aria-labelledby', async () => {
    const options = [{ label: 'Todas', value: 'all' }];
    const { root } = await render(<ch-segmented-control options={options} label="Tipo de movimiento" />);
    const group = root.shadowRoot?.querySelector('div[role="radiogroup"]');
    const label = root.shadowRoot?.querySelector('.group-label');

    expect(label?.textContent).toBe('Tipo de movimiento');
    expect(group?.getAttribute('aria-labelledby')).toBe(label?.id);
  });
});
