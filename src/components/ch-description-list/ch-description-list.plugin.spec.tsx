import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-description-list.tsx';

describe('ch-description-list', () => {
  it('renders the native dl around the slot', async () => {
    const { root } = await render(<ch-description-list />);

    const dl = root.shadowRoot.querySelector('dl');
    expect(dl).not.toBeNull();
    expect(dl.querySelector('slot')).not.toBeNull();
  });

  it('defaults to a single column', async () => {
    const { root } = await render(<ch-description-list />);
    expect(root.shadowRoot.querySelector('dl').className).toBe('list list--columns-1');
  });

  it('maps each column count to its class', async () => {
    const one = await render(<ch-description-list columns="1" />);
    const two = await render(<ch-description-list columns="2" />);
    const three = await render(<ch-description-list columns="3" />);

    expect(one.root.shadowRoot.querySelector('dl').className).toBe('list list--columns-1');
    expect(two.root.shadowRoot.querySelector('dl').className).toBe('list list--columns-2');
    expect(three.root.shadowRoot.querySelector('dl').className).toBe('list list--columns-3');
  });

  it('falls back to one column on an unknown value', async () => {
    const { root } = await render(<ch-description-list columns="banana" />);
    expect(root.shadowRoot.querySelector('dl').className).toBe('list list--columns-1');
  });
});
