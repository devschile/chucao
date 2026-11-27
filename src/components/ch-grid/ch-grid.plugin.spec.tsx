import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-grid.tsx';

describe('ch-grid', () => {
  it('fits as many columns as the minimum width allows by default', async () => {
    const { root } = await render(<ch-grid />);

    expect(root.classList.contains('grid')).toBe(true);
    expect(root.classList.contains('grid--gap-md')).toBe(true);
    expect(root.style.getPropertyValue('--ch-grid-columns')).toBe('repeat(auto-fit, minmax(min(16rem, 100%), 1fr))');
  });

  it('honours a custom minimum item width', async () => {
    const { root } = await render(<ch-grid minItemWidth="12rem" />);
    expect(root.style.getPropertyValue('--ch-grid-columns')).toBe('repeat(auto-fit, minmax(min(12rem, 100%), 1fr))');
  });

  it('renders a fixed column count', async () => {
    const { root } = await render(<ch-grid columns="3" />);
    expect(root.style.getPropertyValue('--ch-grid-columns')).toBe('repeat(3, minmax(0, 1fr))');
  });

  it('rejects a column count outside 1..12 and falls back to auto-fit', async () => {
    const zero = await render(<ch-grid columns="0" />);
    expect(zero.root.style.getPropertyValue('--ch-grid-columns')).toBe('repeat(auto-fit, minmax(min(16rem, 100%), 1fr))');

    const thirteen = await render(<ch-grid columns="13" />);
    expect(thirteen.root.style.getPropertyValue('--ch-grid-columns')).toBe('repeat(auto-fit, minmax(min(16rem, 100%), 1fr))');
  });

  it('ignores a non-numeric column value', async () => {
    const { root } = await render(<ch-grid columns="banana" />);
    expect(root.style.getPropertyValue('--ch-grid-columns')).toBe('repeat(auto-fit, minmax(min(16rem, 100%), 1fr))');
  });

  it('maps every gap scale step to its token class', async () => {
    for (const gap of ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']) {
      const { root } = await render(<ch-grid gap={gap as 'md'} />);
      expect(root.classList.contains(`grid--gap-${gap}`)).toBe(true);
    }
  });
});
