import { describe, it, expect, beforeEach } from 'vitest';
import { cdp } from 'vitest/browser';

/**
 * Platform evidence backing the semantic shape decisions for
 * `ch-description-list` (#81), `ch-timeline` (#83) and `ch-table` (#77).
 *
 * These assertions pin how real Chromium's accessibility tree and HTML parser
 * treat the candidate shapes. They test the platform, not a chucao component:
 * the custom elements used are minimal slot hosts defined inline. The
 * decisions recorded on those issues cite this file.
 */

/** Minimal custom element whose shadow root is a bare <slot>. */
function defineSlotHost(tag: string) {
  if (!customElements.get(tag)) {
    customElements.define(
      tag,
      class extends HTMLElement {
        connectedCallback() {
          if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' }).appendChild(document.createElement('slot'));
          }
        }
      },
    );
  }
}

type AxNode = { id: string; role: string; name: string; parentId: string | undefined };

/**
 * Chromium's AX tree for every frame on the page. The vitest orchestrator
 * runs each spec in an iframe, so the tree must be queried per frame id —
 * a bare `getFullAXTree` returns only the orchestrator UI.
 */
async function axTree(): Promise<AxNode[]> {
  const { frameTree } = await cdp().send('Page.getFrameTree');
  const frameIds: string[] = [];
  const walk = (node: { frame: { id: string }; childFrames?: { frame: { id: string } }[] }) => {
    frameIds.push(node.frame.id);
    (node.childFrames ?? []).forEach(walk);
  };
  walk(frameTree);
  const trees = await Promise.all(frameIds.map(id => cdp().send('Accessibility.getFullAXTree', { frameId: id })));
  return trees.flatMap(({ nodes }) =>
    nodes.map(n => ({
      id: n.nodeId,
      role: n.role?.value ?? '',
      name: n.name?.value ?? '',
      parentId: typeof n.parentId === 'string' ? n.parentId : undefined,
    })),
  );
}

function settle() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 50))));
}

describe('semantic shape evidence (platform measurements)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('keeps the dt term role through every candidate description-list shape', async () => {
    defineSlotHost('x-dl-item-slot');
    const stage = document.createElement('div');
    stage.innerHTML = `
      <dl><dt id="a">A</dt><dd>A-v</dd></dl>
      <dl><div><dt id="b">B</dt><dd>B-v</dd></div></dl>
      <dl><x-dl-item-slot><dt id="c">C</dt><dd>C-v</dd></x-dl-item-slot></dl>
      <dl><x-dl-item-slot style="display: contents"><dt id="e">E</dt><dd>E-v</dd></x-dl-item-slot></dl>
    `;
    document.body.append(stage);
    await settle();

    const tree = await axTree();
    const terms = tree.filter(n => n.role === 'term').map(n => n.name);
    for (const marker of ['A', 'B', 'C', 'E']) {
      expect(terms, `dt "${marker}" must keep the term role`).toContain(marker);
    }
  });

  it('counts a list item wrapped in a custom element inside the list', async () => {
    defineSlotHost('x-li-item-slot');
    const list = document.createElement('ol');
    list.innerHTML = '<li id="native">native</li><x-li-item-slot><li id="wrapped">wrapped</li></x-li-item-slot>';
    document.body.append(list);
    await settle();

    const tree = await axTree();
    const items = tree.filter(n => n.role === 'listitem');
    // The li's accessible name is not its text, so the count is the evidence:
    // the wrapped item is still counted as part of the list.
    expect(items.length).toBe(2);
    expect(tree.some(n => n.role === 'list')).toBe(true);
  });

  it('foster-parents custom row elements out of a native table, leaving it empty', () => {
    const stage = document.createElement('div');
    stage.innerHTML = '<table><thead><x-tr><th>H</th></x-tr></thead><tbody><x-tr><td>C</td></x-tr></tbody></table>';
    document.body.append(stage);

    const table = stage.querySelector('table')!;
    // The HTML parser only allows whitelisted element names between <table>
    // and its sections; unknown elements are hoisted out ("foster
    // parenting"), so a ch-table-row in light DOM can never work. The cell
    // content is garbled too: the parser re-inserts <th>/<td> as strays
    // directly into the sections, with no row left around them.
    expect(table.querySelector('x-tr')).toBe(null);
    expect(stage.firstElementChild!.tagName).toBe('X-TR');
    expect(table.querySelector('thead')!.children.length).toBe(1);
    expect(table.querySelector('tbody')!.children.length).toBe(1);
  });
});
