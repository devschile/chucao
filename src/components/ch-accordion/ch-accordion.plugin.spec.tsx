import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-accordion.tsx';

const items = [
  { title: '¿Qué es Chucao?', value: 'que-es' },
  { title: '¿Cómo instalo?', value: 'instalar' },
];

describe('ch-accordion', () => {
  it('renders one toggle button per item with its title', async () => {
    const { root } = await render(<ch-accordion items={items} />);
    const toggles = root.shadowRoot?.querySelectorAll('button.item-toggle');
    const titles: string[] = [];

    toggles?.forEach(toggle => titles.push(toggle.textContent ?? ''));
    expect(toggles?.length).toBe(items.length);
    expect(titles).toContain('¿Qué es Chucao?');
    expect(titles).toContain('¿Cómo instalo?');
  });

  it('keeps all items closed by default', async () => {
    const { root } = await render(<ch-accordion items={items} />);
    expect(root.shadowRoot?.querySelector('button[aria-expanded="true"]')).toBeNull();
  });

  it('opens the item matching the value prop', async () => {
    const { root } = await render(<ch-accordion items={items} value="instalar" />);
    const toggle = root.shadowRoot?.querySelector('button[data-value="instalar"]');
    const panel = root.shadowRoot?.querySelector(`#${toggle?.getAttribute('aria-controls')}`);

    expect(toggle?.getAttribute('aria-expanded')).toBe('true');
    expect(panel?.hasAttribute('hidden')).toBe(false);
  });

  it('opens an item on click, emitting chChange', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-accordion items={items} />);
    const changeSpy = spyOnEvent('chChange');
    const toggle = root.shadowRoot?.querySelector('button[data-value="que-es"]') as HTMLButtonElement;

    toggle.click();
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEventDetail('que-es');
    expect((root as unknown as { value: string }).value).toBe('que-es');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes the open item on click', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-accordion items={items} value="que-es" />);
    const changeSpy = spyOnEvent('chChange');
    const toggle = root.shadowRoot?.querySelector('button[data-value="que-es"]') as HTMLButtonElement;

    toggle.click();
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEventDetail(undefined);
    expect((root as unknown as { value: string }).value).toBeUndefined();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps a single item open when opening another (single-open)', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-accordion items={items} value="que-es" />);
    const changeSpy = spyOnEvent('chChange');

    root.shadowRoot?.querySelector('button[data-value="instalar"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEventDetail('instalar');
    const open = root.shadowRoot?.querySelector('button[aria-expanded="true"]');
    expect(open?.getAttribute('data-value')).toBe('instalar');
  });

  it('renders a disabled item button', async () => {
    const withDisabled = [
      { title: 'a', value: 'a' },
      { title: 'b', value: 'b', disabled: true },
    ];
    const { root } = await render(<ch-accordion items={withDisabled} />);
    expect(root.shadowRoot?.querySelector('button[data-value="b"]')?.hasAttribute('disabled')).toBe(true);
  });

  it('renders a region panel labelled by its toggle button', async () => {
    const { root } = await render(<ch-accordion items={items} value="que-es" />);
    const panel = root.shadowRoot?.querySelector('[role="region"]:not([hidden])');
    const toggle = root.shadowRoot?.querySelector('button[data-value="que-es"]');

    expect(panel?.getAttribute('aria-labelledby')).toBe(toggle?.id);
    expect(panel?.querySelector('slot')?.getAttribute('name')).toBe('panel-que-es');
  });

  it('distributes slotted content into an open panel', async () => {
    const { root } = await render(
      <ch-accordion items={items} value="que-es">
        <div slot="panel-que-es">Respuesta</div>
      </ch-accordion>,
    );
    const slot = root.shadowRoot?.querySelector('[role="region"]:not([hidden]) slot') as HTMLSlotElement | null;

    expect(slot?.assignedNodes().some(node => node.textContent === 'Respuesta')).toBe(true);
  });
});
