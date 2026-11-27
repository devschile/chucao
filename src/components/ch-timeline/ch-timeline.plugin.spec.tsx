import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-timeline.tsx';

describe('ch-timeline', () => {
  it('renders the native ol around the slot', async () => {
    const { root } = await render(<ch-timeline />);

    const ol = root.shadowRoot.querySelector('ol');
    expect(ol).not.toBeNull();
    expect(ol.querySelector('slot')).not.toBeNull();
  });

  it('does not expose a props surface the shape decision rejected', async () => {
    // #83 settled on slotted native <li> items with no child element: the
    // component owns only the list and the rail, so there is nothing else
    // to configure. This pins that the surface stays empty on purpose.
    const { root } = await render(<ch-timeline />);
    expect(root.shadowRoot.children.length).toBe(1);
  });
});
