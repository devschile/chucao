import { describe, it, expect, beforeEach } from 'vitest';
import { cdp } from 'vitest/browser';
import '/dist/components/ch-timeline.js';

/**
 * List semantics and the rail pseudo-elements need a real browser: mock-doc
 * reports no layout and no accessibility tree.
 */

type AxNode = { role: string; name: string };

async function axTree(): Promise<AxNode[]> {
  const { frameTree } = await cdp().send('Page.getFrameTree');
  const frameIds: string[] = [];
  const walk = (node: { frame: { id: string }; childFrames?: { frame: { id: string } }[] }) => {
    frameIds.push(node.frame.id);
    (node.childFrames ?? []).forEach(walk);
  };
  walk(frameTree);
  const trees = await Promise.all(frameIds.map(id => cdp().send('Accessibility.getFullAXTree', { frameId: id })));
  return trees.flatMap(({ nodes }) => nodes.map(n => ({ role: n.role?.value ?? '', name: n.name?.value ?? '' })));
}

function mount() {
  const host = document.createElement('div');
  host.innerHTML = `
    <ch-timeline>
      <li id="first"><ch-icon name="check"></ch-icon> <time datetime="2026-11-02">2 nov</time> Pedido creado</li>
      <li id="second">En despacho</li>
      <li id="last">Entregado</li>
    </ch-timeline>
  `;
  document.body.append(host);
  return { host, items: Array.from(host.querySelectorAll('li')) };
}

function settle() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 50))));
}

function connectorOf(li: Element) {
  return getComputedStyle(li, '::after').content;
}

describe('ch-timeline', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('counts every slotted li as a list item', async () => {
    mount();
    await settle();

    const tree = await axTree();
    expect(tree.some(n => n.role === 'list')).toBe(true);
    expect(tree.filter(n => n.role === 'listitem').length).toBe(3);
  });

  it('marks every item with a dot and never connects past the last one', async () => {
    const { items } = mount();
    await settle();

    for (const item of items) {
      expect(getComputedStyle(item, '::before').content).not.toBe('none');
    }

    expect(connectorOf(items[0])).not.toBe('none');
    expect(connectorOf(items[1])).not.toBe('none');
    expect(connectorOf(items[2])).toBe('none');
  });

  it('renders an empty timeline as an empty ordered list', async () => {
    const host = document.createElement('div');
    host.innerHTML = '<ch-timeline></ch-timeline>';
    document.body.append(host);
    await settle();

    const element = host.querySelector('ch-timeline');
    const ol = element.shadowRoot.querySelector('ol');
    expect(ol).not.toBeNull();
    expect(ol.children.length).toBe(1); // the slot only
  });
});
