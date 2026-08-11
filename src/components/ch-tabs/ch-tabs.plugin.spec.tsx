import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-tabs.tsx';

const tabs = [
  { label: 'Comunidad', value: 'community' },
  { label: 'Links', value: 'links' },
  { label: 'Eventos', value: 'events' },
];

describe('ch-tabs', () => {
  it('renders a tablist with one tab per entry', async () => {
    const { root } = await render(<ch-tabs tabs={tabs} />);
    const tablist = root.shadowRoot?.querySelector('[role="tablist"]');
    const buttons = root.shadowRoot?.querySelectorAll('[role="tab"]');

    expect(tablist).not.toBeNull();
    expect(buttons?.length).toBe(tabs.length);
  });

  it('marks the active tab with aria-selected and tabindex 0', async () => {
    const { root } = await render(<ch-tabs tabs={tabs} value="links" />);
    const active = root.shadowRoot?.querySelector('[role="tab"][data-value="links"]');
    const inactive = root.shadowRoot?.querySelector('[role="tab"][data-value="community"]');

    expect(active?.getAttribute('aria-selected')).toBe('true');
    expect(active?.getAttribute('tabindex')).toBe('0');
    expect(inactive?.getAttribute('aria-selected')).toBe('false');
    expect(inactive?.getAttribute('tabindex')).toBe('-1');
  });

  it('defaults to the first enabled tab', async () => {
    const { root } = await render(<ch-tabs tabs={tabs} />);
    const active = root.shadowRoot?.querySelector('[role="tab"][aria-selected="true"]');

    expect(active?.getAttribute('data-value')).toBe('community');
  });

  it('skips disabled tabs when choosing the default', async () => {
    const withDisabled = [
      { label: 'a', value: 'a', disabled: true },
      { label: 'b', value: 'b' },
    ];
    const { root } = await render(<ch-tabs tabs={withDisabled} />);
    const active = root.shadowRoot?.querySelector('[role="tab"][aria-selected="true"]');

    expect(active?.getAttribute('data-value')).toBe('b');
  });

  it('falls back to the first enabled tab when the value points to a disabled tab', async () => {
    const withDisabled = [
      { label: 'a', value: 'a' },
      { label: 'b', value: 'b', disabled: true },
    ];
    const { root } = await render(<ch-tabs tabs={withDisabled} value="b" />);
    const active = root.shadowRoot?.querySelector('[role="tab"][aria-selected="true"]');

    expect(active?.getAttribute('data-value')).toBe('a');
  });

  it('emits chChange and updates the value when a tab is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-tabs tabs={tabs} />);
    const changeSpy = spyOnEvent('chChange');

    (root.shadowRoot?.querySelector('[role="tab"][data-value="events"]') as HTMLButtonElement | null)?.click();
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEventDetail('events');
    expect((root as unknown as { value: string }).value).toBe('events');
    expect(root.shadowRoot?.querySelector('[role="tab"][data-value="events"]')?.getAttribute('aria-selected')).toBe('true');
  });

  it('renders a labelled tablist via aria-label', async () => {
    const { root } = await render(<ch-tabs tabs={tabs} label="Secciones" />);
    expect(root.shadowRoot?.querySelector('[role="tablist"]')?.getAttribute('aria-label')).toBe('Secciones');
  });

  it('renders a tabpanel per tab; only the active one is visible', async () => {
    const { root } = await render(<ch-tabs tabs={tabs} value="links" />);
    const panels = root.shadowRoot?.querySelectorAll('[role="tabpanel"]');
    const activePanel = root.shadowRoot?.querySelector('[role="tabpanel"]:not([hidden])');
    const activeTab = root.shadowRoot?.querySelector('[role="tab"][aria-selected="true"]');

    expect(panels?.length).toBe(tabs.length);
    expect(activePanel?.getAttribute('aria-labelledby')).toBe(activeTab?.id);
    expect(activePanel?.querySelector('slot')?.getAttribute('name')).toBe('panel-links');
  });

  it('distributes slotted content into the active panel', async () => {
    const { root } = await render(
      <ch-tabs tabs={tabs} value="links">
        <div slot="panel-links">Contenido</div>
      </ch-tabs>,
    );
    const slot = root.shadowRoot?.querySelector('[role="tabpanel"]:not([hidden]) slot') as HTMLSlotElement | null;

    expect(slot?.assignedNodes().some(node => node.textContent === 'Contenido')).toBe(true);
  });
});

describe('ch-tabs keyboard navigation', () => {
  it('moves selection and focus with ArrowRight, wrapping around', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-tabs tabs={tabs} value="events" />);
    const changeSpy = spyOnEvent('chChange');
    let focused: HTMLElement | null = null;
    root.shadowRoot?.querySelectorAll<HTMLElement>('[role="tab"]').forEach(btn => {
      btn.focus = () => {
        focused = btn;
      };
    });

    root.shadowRoot?.querySelector('[role="tablist"]')?.dispatchEvent(new KeyboardEvent('keyDown', { key: 'ArrowRight', bubbles: true, composed: true }));
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEventDetail('community');
    expect((root as unknown as { value: string }).value).toBe('community');
    expect(focused?.getAttribute('data-value')).toBe('community');
  });

  it('moves selection and focus with ArrowLeft, wrapping around', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-tabs tabs={tabs} value="community" />);
    const changeSpy = spyOnEvent('chChange');

    root.shadowRoot?.querySelector('[role="tablist"]')?.dispatchEvent(new KeyboardEvent('keyDown', { key: 'ArrowLeft', bubbles: true, composed: true }));
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEventDetail('events');
    expect((root as unknown as { value: string }).value).toBe('events');
  });

  it('moves to the first tab with Home', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-tabs tabs={tabs} value="links" />);
    const changeSpy = spyOnEvent('chChange');

    root.shadowRoot?.querySelector('[role="tablist"]')?.dispatchEvent(new KeyboardEvent('keyDown', { key: 'Home', bubbles: true, composed: true }));
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEventDetail('community');
  });

  it('moves to the last tab with End', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-tabs tabs={tabs} value="community" />);
    const changeSpy = spyOnEvent('chChange');

    root.shadowRoot?.querySelector('[role="tablist"]')?.dispatchEvent(new KeyboardEvent('keyDown', { key: 'End', bubbles: true, composed: true }));
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEventDetail('events');
  });

  it('skips disabled tabs while moving with the arrow keys', async () => {
    const withDisabled = [
      { label: 'a', value: 'a' },
      { label: 'b', value: 'b', disabled: true },
      { label: 'c', value: 'c' },
    ];
    const { root, spyOnEvent, waitForChanges } = await render(<ch-tabs tabs={withDisabled} value="a" />);
    const changeSpy = spyOnEvent('chChange');

    root.shadowRoot?.querySelector('[role="tablist"]')?.dispatchEvent(new KeyboardEvent('keyDown', { key: 'ArrowRight', bubbles: true, composed: true }));
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEventDetail('c');
  });

  it('does nothing for non-navigation keys', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-tabs tabs={tabs} value="community" />);
    const changeSpy = spyOnEvent('chChange');

    root.shadowRoot?.querySelector('[role="tablist"]')?.dispatchEvent(new KeyboardEvent('keyDown', { key: 'Enter', bubbles: true, composed: true }));
    await waitForChanges();

    expect(changeSpy).not.toHaveReceivedEvent();
  });

  it('does nothing when every tab is disabled', async () => {
    const allDisabled = [
      { label: 'a', value: 'a', disabled: true },
      { label: 'b', value: 'b', disabled: true },
    ];
    const { root, spyOnEvent, waitForChanges } = await render(<ch-tabs tabs={allDisabled} />);
    const changeSpy = spyOnEvent('chChange');

    root.shadowRoot?.querySelector('[role="tablist"]')?.dispatchEvent(new KeyboardEvent('keyDown', { key: 'ArrowRight', bubbles: true, composed: true }));
    await waitForChanges();

    expect(changeSpy).not.toHaveReceivedEvent();
  });
});
