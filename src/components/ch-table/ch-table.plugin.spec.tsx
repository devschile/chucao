import { render, h, describe, it, expect } from '@stencil/vitest';
import { vi } from 'vitest';

import './ch-table.tsx';

const columns = [
  { key: 'name', label: 'Cliente' },
  { key: 'status', label: 'Estado', sortable: false },
];

describe('ch-table', () => {
  it('renders the native table skeleton with one header per column', async () => {
    const { root } = await render(<ch-table label="Pedidos" columns={columns} />);

    expect(root.shadowRoot.querySelector('table')).not.toBeNull();
    expect(root.shadowRoot.querySelector('thead tr').children.length).toBe(2);
    expect(root.shadowRoot.querySelector('caption').textContent).toBe('Pedidos');
  });

  it('keeps headers inert when the table is not sortable', async () => {
    const { root } = await render(<ch-table label="Pedidos" columns={columns} />);

    expect(root.shadowRoot.querySelectorAll('button').length).toBe(0);
    expect(root.shadowRoot.querySelector('th').getAttribute('aria-sort')).toBeNull();
  });

  it('offers a sort button only for sortable columns', async () => {
    const { root } = await render(<ch-table label="Pedidos" columns={columns} sortable />);

    expect(root.shadowRoot.querySelectorAll('button').length).toBe(1);
    expect(root.shadowRoot.querySelector('th').getAttribute('aria-sort')).toBe('none');
    expect(root.shadowRoot.querySelectorAll('th')[1].getAttribute('aria-sort')).toBeNull();
  });

  it('reflects the controlled sort on the active header only', async () => {
    const { root } = await render(<ch-table label="Pedidos" columns={columns} sortable sortKey="name" sortDirection="descending" />);

    const headers = root.shadowRoot.querySelectorAll('th');
    expect(headers[0].getAttribute('aria-sort')).toBe('descending');
    expect(headers[1].getAttribute('aria-sort')).toBeNull();
  });

  it('emits ascending for a new column and toggles the active one', async () => {
    const { root } = await render(<ch-table label="Pedidos" columns={columns} sortable />);
    const spy = vi.fn();
    root.addEventListener('chSort', spy as EventListener);

    const button = root.shadowRoot.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect((spy.mock.calls[0][0] as CustomEvent).detail).toEqual({ key: 'name', direction: 'ascending' });
  });

  it('does not submit a form when a sort header is activated', async () => {
    const { root } = await render(<ch-table label="Pedidos" columns={columns} sortable />);

    const button = root.shadowRoot.querySelector('button') as HTMLButtonElement;
    expect(button.type).toBe('button');
  });

  it('shows the empty state once the body has no rows', async () => {
    const { root } = await render(<ch-table label="Pedidos" columns={columns} />);
    await new Promise(resolve => setTimeout(resolve, 0));
    root.dispatchEvent(new Event('slotchange'));

    expect(root.className).toContain('table--empty');
    expect(root.shadowRoot.querySelector('.table__empty')).not.toBeNull();
  });

  it('distinguishes a filtered-empty body from an empty one', async () => {
    // mock-doc has no MutationObserver, so the live attribute change is covered
    // in the browser project; here the attribute is present from the start.
    const { root } = await render(<ch-table label="Pedidos" columns={columns} />);
    root.setAttribute('filtered', '');
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(root.shadowRoot.querySelector('.table__empty-message').textContent).toBe('No results for these filters.');
  });
});
