import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-divider.tsx';

describe('ch-divider', () => {
  it('renders a horizontal separator by default', async () => {
    const { root } = await render(<ch-divider />);
    const hr = root.shadowRoot?.querySelector('hr');

    expect(hr).not.toBeNull();
    expect(hr?.classList.contains('divider--horizontal')).toBe(true);
    expect(hr?.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('renders a vertical separator with aria-orientation', async () => {
    const { root } = await render(<ch-divider orientation="vertical" />);
    const hr = root.shadowRoot?.querySelector('hr');

    expect(hr?.classList.contains('divider--vertical')).toBe(true);
    expect(hr?.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('marks the host with the vertical class', async () => {
    const { root } = await render(<ch-divider orientation="vertical" />);
    expect(root?.classList.contains('divider--vertical')).toBe(true);
  });
});
