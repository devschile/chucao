import { describe, it, expect, beforeEach } from 'vitest';
import { cdp, page } from 'vitest/browser';
import '/dist/components/ch-description-list.js';

/**
 * Semantics and responsive layout need a real browser: the accessibility
 * tree and viewport media queries cannot be asserted in mock-doc. The spec
 * runs inside the vitest iframe, so the responsive cases resize the iframe
 * element itself — page-level viewport emulation does not reach it.
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

function mount(columns: string | null) {
  const host = document.createElement('div');
  host.innerHTML = `
    <ch-description-list ${columns ? `columns="${columns}"` : ''}>
      <div><dt>Cliente</dt><dd>Aurora SpA</dd></div>
      <div><dt>Pedido</dt><dd>#1523</dd></div>
    </ch-description-list>
  `;
  document.body.append(host);
  const element = host.querySelector('ch-description-list');
  return { host, element };
}

function settle() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 50))));
}

async function viewport(width: number) {
  // Resizes the tester iframe through the orchestrator; a plain
  // Emulation.setDeviceMetricsOverride changes the page, not the iframe,
  // so the media query inside never sees it.
  await page.viewport(width, 800);
  await settle();
}

function columnsOf(element: Element) {
  const dl = element.shadowRoot.querySelector('dl');
  return getComputedStyle(dl).gridTemplateColumns.split(' ').length;
}

describe('ch-description-list', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('exposes the slotted terms with their native role', async () => {
    mount('1');
    await settle();

    const terms = (await axTree()).filter(n => n.role === 'term').map(n => n.name);
    expect(terms).toContain('Cliente');
    expect(terms).toContain('Pedido');
  });

  it('lays one pair group per column on a wide viewport and collapses to one on a narrow one', async () => {
    const two = mount('2');
    await settle();
    await viewport(1024);
    expect(columnsOf(two.element)).toBe(2);

    await viewport(400);
    expect(columnsOf(two.element)).toBe(1);

    await viewport(1024);
  });

  it('keeps three columns on a wide viewport and collapses them too', async () => {
    const three = mount('3');
    await settle();
    await viewport(1024);
    expect(columnsOf(three.element)).toBe(3);

    await viewport(400);
    expect(columnsOf(three.element)).toBe(1);

    await viewport(1024);
  });

  it('renders an empty list without inventing content', async () => {
    const host = document.createElement('div');
    host.innerHTML = '<ch-description-list></ch-description-list>';
    document.body.append(host);
    await settle();

    const element = host.querySelector('ch-description-list');
    expect(element.shadowRoot.querySelector('dl')).not.toBeNull();
    expect(element.shadowRoot.querySelector('dl').children.length).toBe(1); // the slot only
  });
});
