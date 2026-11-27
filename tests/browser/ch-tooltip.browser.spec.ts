import { describe, it, expect, beforeEach } from 'vitest';
import '/dist/components/ch-tooltip.js';

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

  it('closes only the tooltip on Escape, not an enclosing modal', async () => {
    const { element, trigger } = mount('top');
    await settle();
    trigger.focus();
    await settle();
    await new Promise(resolve => setTimeout(resolve, 50));

    let modalSawEscape = false;
    const modal = document.createElement('div');
    modal.addEventListener('keydown', () => {
      modalSawEscape = true;
    });
    document.body.append(modal);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();

    expect(bubbleBox(element).bubble.className).not.toContain('bubble--visible');
    expect(modalSawEscape).toBe(false);
  });
});
