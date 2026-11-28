import { describe, it, expect, beforeEach } from 'vitest';
import { userEvent } from 'vitest/browser';
import '/dist/components/ch-tooltip.js';
import '/dist/components/ch-modal.js';

/**
 * Geometry only exists in a real browser: mock-doc reports every box as
 * 0x0, so the collision behavior cannot be asserted there.
 */
function mount(placement: string | null) {
  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.inset = '0';
  host.innerHTML = `
    <ch-tooltip ${placement ? `placement="${placement}"` : ''}>
      <button slot="trigger">Guardar</button>
      <span slot="content">Se publica al CDN con cada release</span>
    </ch-tooltip>
  `;
  document.body.append(host);
  const element = host.querySelector('ch-tooltip');
  const trigger = host.querySelector('button');
  return { host, element, trigger };
}

function bubbleBox(element: HTMLElement) {
  const bubble = element.shadowRoot.querySelector('.bubble');
  const rect = bubble.getBoundingClientRect();
  return { rect, bubble };
}

function settle() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

/**
 * Mounts the tooltip inside a real `ch-modal` — the platform close request
 * only answers to a real key press, so a `<div>` stub proves nothing.
 */
function mountInModal() {
  const host = document.createElement('div');
  host.innerHTML = `
    <ch-modal label="Publicar" close-label="Cerrar">
      <ch-tooltip placement="top">
        <button slot="trigger">Guardar</button>
        <span slot="content">Se publica al CDN con cada release</span>
      </ch-tooltip>
    </ch-modal>
  `;
  document.body.append(host);
  return {
    host,
    modal: host.querySelector('ch-modal'),
    element: host.querySelector('ch-tooltip'),
    trigger: host.querySelector('button'),
  };
}

function dialogOf(modal: Element) {
  return modal.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
}

describe('ch-tooltip collision', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.style.overflow = '';
  });

  it('flips to the bottom when the trigger sits against the top edge', async () => {
    const { element, trigger } = mount('top');
    trigger.style.marginTop = '0px';
    await settle();

    trigger.focus();
    await settle();
    await new Promise(resolve => setTimeout(resolve, 50));

    const { rect, bubble } = bubbleBox(element);
    expect(bubble.className).toContain('bubble--bottom');
    expect(rect.top).toBeGreaterThan(trigger.getBoundingClientRect().bottom);
  });

  it('keeps the bubble inside the right edge of the viewport', async () => {
    const { host, element, trigger } = mount('top');
    host.style.justifyContent = 'flex-end';
    host.style.display = 'flex';
    host.style.alignItems = 'flex-start';
    await settle();

    trigger.focus();
    await settle();
    await new Promise(resolve => setTimeout(resolve, 50));

    const { rect } = bubbleBox(element);
    expect(rect.right).toBeLessThanOrEqual(globalThis.innerWidth + 1);
  });

  it('keeps the bubble inside the left edge of the viewport', async () => {
    const { element, trigger } = mount('top');
    await settle();

    trigger.focus();
    await settle();
    await new Promise(resolve => setTimeout(resolve, 50));

    const { rect } = bubbleBox(element);
    expect(rect.left).toBeGreaterThanOrEqual(-1);
  });

  it('never adds horizontal document overflow', async () => {
    const { element, trigger } = mount('right');
    await settle();

    trigger.focus();
    await settle();
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(globalThis.innerWidth + 1);
    bubbleBox(element);
  });

  it('uses fixed placement so a scrollable ancestor cannot clip it', async () => {
    const { element, trigger } = mount('top');
    await settle();

    trigger.focus();
    await settle();
    await new Promise(resolve => setTimeout(resolve, 50));

    const { bubble } = bubbleBox(element);
    expect(getComputedStyle(bubble).position).toBe('fixed');
  });

  it('stays aligned when an ancestor establishes a fixed containing block', async () => {
    const host = document.createElement('div');
    host.style.padding = '40px';
    host.style.backdropFilter = 'blur(10px)';
    host.style.margin = '120px 0 0 60px';
    host.innerHTML = `
      <ch-tooltip placement="top">
        <button slot="trigger">Guardar</button>
        <span slot="content">Se publica al CDN con cada release</span>
      </ch-tooltip>
    `;
    document.body.append(host);
    const element = host.querySelector('ch-tooltip');
    const trigger = host.querySelector('button');
    await settle();

    trigger.focus();
    await settle();
    await new Promise(resolve => setTimeout(resolve, 50));

    const triggerRect = trigger.getBoundingClientRect();
    const { rect } = bubbleBox(element);
    expect(Math.abs(rect.left + rect.width / 2 - (triggerRect.left + triggerRect.width / 2))).toBeLessThanOrEqual(3);
    expect(Math.abs(triggerRect.top - rect.bottom - 8)).toBeLessThanOrEqual(20);
  });

  it('repositions when the viewport resizes', async () => {
    const { element, trigger } = mount('top');
    await settle();
    trigger.focus();
    await settle();
    await new Promise(resolve => setTimeout(resolve, 50));
    const before = bubbleBox(element).rect.top;

    globalThis.dispatchEvent(new Event('resize'));
    await settle();

    const after = bubbleBox(element).rect.top;
    expect(after).toBe(before);
  });

  it('closes only the tooltip on Escape inside an open modal, and the modal stays open', async () => {
    const { modal, element, trigger } = mountInModal();
    modal.open = true;
    await settle();

    // A synthetic KeyboardEvent cannot trigger the platform close request
    // that a native <dialog> answers to, so the key must be pressed for real.
    trigger.focus();
    await settle();
    await new Promise(resolve => setTimeout(resolve, 50));

    const dialog = dialogOf(modal);
    expect(dialog.open).toBe(true);
    expect(bubbleBox(element).bubble.className).toContain('bubble--visible');

    await userEvent.keyboard('{Escape}');
    await settle();

    expect(bubbleBox(element).bubble.className).not.toContain('bubble--visible');
    expect(dialog.open).toBe(true);
  });

  it('still closes the modal on Escape when no tooltip is visible', async () => {
    const { host, modal } = mountInModal();
    modal.open = true;
    await settle();
    (host.querySelector('ch-tooltip button') as HTMLElement).focus();
    await settle();
    await new Promise(resolve => setTimeout(resolve, 50));
    (host.querySelector('ch-tooltip button') as HTMLElement).blur();
    await settle();

    const dialog = dialogOf(modal);
    expect(dialog.open).toBe(true);

    await userEvent.keyboard('{Escape}');
    await settle();

    expect(dialog.open).toBe(false);
  });
});
