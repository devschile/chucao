import { describe, it, expect, beforeEach } from 'vitest';
import { cdp } from 'vitest/browser';
import '/dist/components/ch-table.js';

/**
 * The table's claims are geometry, keyboard and accessibility-tree claims, none
 * of which mock-doc can model: whether a wide table widens the page, whether
 * `aria-sort` reaches the tree, and whether a header is operable from the
 * keyboard.
 *
 * `ch-table` upgrades lazily, so every mount waits for `whenDefined` first —
 * mounting before the definition exists yields an unupgraded element with no
 * shadow root and every assertion silently probes nothing.
 */

interface RawAxNode {
  role?: { value?: string };
  name?: { value?: string };
}

/**
 * The spec runs inside the vitest iframe, so a plain `getFullAXTree` inspects
 * the top-level page and finds none of the mounted components.
 */
async function axNodes(): Promise<AxNode[]> {
  const { frameTree } = await cdp().send('Page.getFrameTree');
  const frameIds: string[] = [];
  const walk = (node: { frame: { id: string }; childFrames?: { frame: { id: string } }[] }) => {
    frameIds.push(node.frame.id);
    (node.childFrames ?? []).forEach(walk);
  };
  walk(frameTree);
  const trees = await Promise.all(frameIds.map(frameId => cdp().send('Accessibility.getFullAXTree', { frameId })));
  // CDP reports role and name as `{ value }` descriptors, not bare strings.
  return trees.flatMap(({ nodes }) => (nodes as unknown as RawAxNode[]).map(node => ({ role: node.role?.value ?? '', name: node.name?.value ?? '' })));
}

const ROWS = () =>
  rows([
    ['Aurora SpA', 'En despacho'],
    ['Bosque Ltda', 'Pendiente'],
  ]);

function settle() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 60))));
}

const COLUMNS = [
  { key: 'name', label: 'Cliente' },
  { key: 'status', label: 'Estado' },
];

/**
 * Rows are built with `createElement`, never `innerHTML`: the HTML parser
 * rejects a `<tr>` outside a `<table>` context, so `<ch-table><tr>…</tr></ch-table>`
 * parsed from a string yields a text node instead of rows. Consumers hit the
 * same rule and `ch-table` documents it.
 */
function rows(cells: string[][]): HTMLTableRowElement[] {
  return cells.map(values => {
    const row = document.createElement('tr');
    for (const value of values) {
      const cellEl = document.createElement('td');
      cellEl.textContent = value;
      row.append(cellEl);
    }
    return row;
  });
}

function applyAttributes(table: HTMLElement, attrs: string): void {
  for (const attr of attrs.split(' ').filter(Boolean)) {
    const [name, value] = attr.split('=');
    table.setAttribute(name, value ? value.replaceAll('"', '') : '');
  }
}

async function mount(attrs: string, body: HTMLTableRowElement[]): Promise<HTMLElement> {
  await customElements.whenDefined('ch-table');
  const table = document.createElement('ch-table') as HTMLElement & { columns: typeof COLUMNS };
  table.setAttribute('label', 'Pedidos');
  table.id = 'stage';
  applyAttributes(table, attrs);
  table.columns = COLUMNS;
  table.append(...body);
  document.body.append(table);
  await settle();
  return table;
}

describe('ch-table', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.scrollTo(0, 0);
  });

  it('scrolls a wide table horizontally without widening the page', async () => {
    const body = rows(Array.from({ length: 12 }, (_unused, index) => [`Columna larga número ${index} con texto suficiente`, 'valor']));
    const table = await mount('', body);

    const scroll = table.shadowRoot.querySelector('.table__scroll') as HTMLElement;
    scroll.style.width = '200px';
    await settle();

    // A wide body scrolls inside the box instead of widening the page.
    const box = scroll.getBoundingClientRect();
    expect(scroll.scrollWidth).toBeGreaterThan(scroll.clientWidth);
    expect(box.width).toBeLessThanOrEqual(200);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth + 1);
  });

  it('exposes column headers and body cells to the accessibility tree', async () => {
    await mount('', ROWS());

    const axNodesList = await axNodes();
    const columnHeaders = axNodesList.filter(node => node.role === 'columnheader').map(node => node.name);
    const cellNames = axNodesList.filter(node => node.role === 'cell').map(node => node.name);

    expect(columnHeaders).toEqual(['Cliente', 'Estado']);
    expect(cellNames).toContain('Aurora SpA');
    expect(cellNames).toContain('En despacho');
  });

  it('carries aria-sort on the active header and emits the toggled direction', async () => {
    const table = await mount('sortable sort-key="name" sort-direction="ascending"', ROWS());

    const headers = Array.from(table.shadowRoot.querySelectorAll('th')) as HTMLElement[];
    expect(headers[0].getAttribute('aria-sort')).toBe('ascending');
    // Both columns are sortable here, so the inactive one reports 'none' —
    // that is what tells assistive technology the column is sortable.
    expect(headers[1].getAttribute('aria-sort')).toBe('none');

    const emitted: unknown[] = [];
    table.addEventListener('chSort', ev => emitted.push((ev as CustomEvent).detail));

    (headers[0].querySelector('button') as HTMLButtonElement).click();
    await settle();

    expect(emitted).toEqual([{ key: 'name', direction: 'descending' }]);
  });

  it('sorts with the keyboard from the header button', async () => {
    const table = await mount('sortable', ROWS());

    const emitted: unknown[] = [];
    table.addEventListener('chSort', ev => emitted.push((ev as CustomEvent).detail));

    const button = table.shadowRoot.querySelector('button') as HTMLButtonElement;
    button.focus();
    expect(button.getRootNode()).toBe(table.shadowRoot);

    for (const key of ['Enter', ' ']) {
      button.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, composed: true }));
    }
    await settle();

    expect(emitted).toEqual([
      { key: 'name', direction: 'ascending' },
      { key: 'name', direction: 'ascending' },
    ]);
  });

  it('replaces the rows with the empty state once the body is emptied', async () => {
    const table = await mount('', ROWS());
    expect(table.classList.contains('table--empty')).toBe(false);

    for (const row of Array.from(table.querySelectorAll('tr'))) {
      row.remove();
    }
    await settle();

    expect(table.shadowRoot.querySelector('.table__empty-message').textContent).toBe('Nothing here yet.');
  });

  it('reports a filtered-empty body with its own message', async () => {
    const table = await mount('filtered', []);

    expect(table.shadowRoot.querySelector('.table__empty-message').textContent).toBe('No results for these filters.');
  });
});
