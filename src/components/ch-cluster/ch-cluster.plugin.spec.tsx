import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-cluster.tsx';

describe('ch-cluster', () => {
  it('wraps by default with a centred cross-axis', async () => {
    const { root } = await render(<ch-cluster />);

    expect(root.classList.contains('cluster')).toBe(true);
    expect(root.classList.contains('cluster--gap-md')).toBe(true);
    expect(root.classList.contains('cluster--align-center')).toBe(true);
    expect(root.classList.contains('cluster--nowrap')).toBe(false);
  });

  it('turns wrapping off when wrap is false', async () => {
    const { root } = await render(<ch-cluster wrap={false} />);
    expect(root.classList.contains('cluster--nowrap')).toBe(true);
  });

  it('maps every gap scale step to its token class', async () => {
    const gaps = ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
    const roots = await Promise.all(gaps.map(gap => render(<ch-cluster gap={gap as 'md'} />)));
    gaps.forEach((gap, index) => {
      expect(roots[index].root.classList.contains(`cluster--gap-${gap}`)).toBe(true);
    });
  });

  it('falls back to md for an unknown gap', async () => {
    const { root } = await render(<ch-cluster gap={'huge' as never} />);
    expect(root.classList.contains('cluster--gap-md')).toBe(true);
  });

  it('supports baseline alignment', async () => {
    const { root } = await render(<ch-cluster align="baseline" />);
    expect(root.classList.contains('cluster--align-baseline')).toBe(true);
  });
});
