import { describe, it, expect } from '@stencil/vitest';

import { placeOverlay } from './overlay';

const viewport = { top: 0, left: 0, width: 400, height: 300 };
const anchor = (top: number, left: number, width = 40, height = 20) => ({ top, left, width, height });
const surface = { width: 120, height: 40 };
const call = (
  a: { top: number; left: number; width: number; height: number },
  surf: { width: number; height: number },
  vp: { top: number; left: number; width: number; height: number },
  preferred: 'top' | 'bottom' | 'left' | 'right',
  gap: number,
) => placeOverlay({ anchor: a, surface: surf, viewport: vp, preferred, gap });

describe('placeOverlay', () => {
  it('keeps the preferred side when the surface fits', () => {
    const result = call(anchor(140, 180), surface, viewport, 'top', 8);

    expect(result.placement).toBe('top');
    expect(result.top).toBe(92);
    expect(result.left).toBe(140);
  });

  it('flips to the opposite side when the preferred one is off the top edge', () => {
    const result = call(anchor(4, 180), surface, viewport, 'top', 8);

    expect(result.placement).toBe('bottom');
    expect(result.top).toBe(32);
  });

  it('flips from bottom to top when the anchor sits at the bottom edge', () => {
    const result = call(anchor(286, 180), surface, viewport, 'bottom', 8);

    expect(result.placement).toBe('top');
    expect(result.top).toBe(238);
  });

  it('flips from left to right when the anchor sits on the left edge', () => {
    const result = call(anchor(140, 2), surface, viewport, 'left', 8);

    expect(result.placement).toBe('right');
    expect(result.left).toBe(50);
  });

  it('flips from right to left when the anchor sits on the right edge', () => {
    const result = call(anchor(140, 358), surface, viewport, 'right', 8);

    expect(result.placement).toBe('left');
    expect(result.left).toBe(230);
  });

  it('shifts a vertical surface back inside the right edge without horizontal overflow', () => {
    const result = call(anchor(140, 320), surface, viewport, 'top', 8);

    expect(result.placement).toBe('top');
    expect(result.left + surface.width).toBeLessThanOrEqual(viewport.width);
    expect(result.left).toBeGreaterThanOrEqual(0);
  });

  it('shifts a vertical surface back inside the left edge', () => {
    const result = call(anchor(140, 4), surface, viewport, 'top', 8);

    expect(result.left).toBe(0);
  });

  it('shifts a horizontal surface back inside the bottom edge', () => {
    const result = call(anchor(280, 200), surface, viewport, 'left', 8);

    expect(result.top + surface.height).toBeLessThanOrEqual(viewport.height);
  });

  it('never returns negative offsets for a surface wider than the viewport', () => {
    const wide = { width: 600, height: 40 };
    const result = call(anchor(140, 4), wide, viewport, 'top', 8);

    expect(result.left).toBeLessThanOrEqual(0);
    expect(result.left).toBe(0);
  });

  it('honours the gap between anchor and surface', () => {
    const none = call(anchor(140, 180), surface, viewport, 'bottom', 0);
    const wide = call(anchor(140, 180), surface, viewport, 'bottom', 16);

    expect(wide.top - none.top).toBe(16);
  });
});
