export type ChOverlayPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface ChOverlayPosition {
  /** Placement after flipping when the preferred side does not fit. */
  placement: ChOverlayPlacement;
  /** Offset from the anchor's top-left corner, in pixels. */
  top: number;
  left: number;
}

export interface ChOverlayRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ChOverlayViewport {
  top: number;
  left: number;
  width: number;
  height: number;
}

const OPPOSITE: Record<ChOverlayPlacement, ChOverlayPlacement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

const AXIS: Record<ChOverlayPlacement, 'vertical' | 'horizontal'> = {
  top: 'vertical',
  bottom: 'vertical',
  left: 'horizontal',
  right: 'horizontal',
};

/**
 * How far a placed surface overflows each viewport edge. Positive values are
 * overflow. Used both to pick a placement and to shift the surface back in.
 */
export function overflowOf(surface: ChOverlayRect, viewport: ChOverlayViewport) {
  return {
    top: viewport.top - surface.top,
    left: viewport.left - surface.left,
    bottom: surface.top + surface.height - (viewport.top + viewport.height),
    right: surface.left + surface.width - (viewport.left + viewport.width),
  };
}

function offsetFor(placement: ChOverlayPlacement, anchor: ChOverlayRect, surface: { width: number; height: number }, gap: number) {
  switch (placement) {
    case 'top':
      return {
        top: anchor.top - surface.height - gap,
        left: anchor.left + (anchor.width - surface.width) / 2,
      };
    case 'bottom':
      return {
        top: anchor.top + anchor.height + gap,
        left: anchor.left + (anchor.width - surface.width) / 2,
      };
    case 'left':
      return {
        top: anchor.top + (anchor.height - surface.height) / 2,
        left: anchor.left - surface.width - gap,
      };
    case 'right':
      return {
        top: anchor.top + (anchor.height - surface.height) / 2,
        left: anchor.left + anchor.width + gap,
      };
  }
}

/**
 * Picks the placement that overflows least and then shifts the surface along
 * the cross axis so it stays inside the viewport.
 *
 * The main-axis overflow is not compensated with a translate: a tooltip pinned
 * to the top edge would cover its own trigger. Flipping to the other side is
 * what keeps it readable, and the caller decides whether to accept the
 * remaining overflow.
 */
export function placeOverlay({
  anchor,
  surface,
  viewport,
  preferred,
  gap,
}: {
  anchor: ChOverlayRect;
  surface: { width: number; height: number };
  viewport: ChOverlayViewport;
  preferred: ChOverlayPlacement;
  gap: number;
}): ChOverlayPosition {
  const candidates: ChOverlayPlacement[] = [preferred, OPPOSITE[preferred]];
  let placement = preferred;
  let best = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    const { top, left } = offsetFor(candidate, anchor, surface, gap);
    const rect = { top, left, width: surface.width, height: surface.height };
    const overflow = overflowOf(rect, viewport);
    const main = AXIS[candidate] === 'vertical' ? clamp(overflow.top) + clamp(overflow.bottom) : clamp(overflow.left) + clamp(overflow.right);

    if (main < best) {
      best = main;
      placement = candidate;
    }
  }

  const { top, left } = offsetFor(placement, anchor, surface, gap);
  const rect = { top, left, width: surface.width, height: surface.height };
  const overflow = overflowOf(rect, viewport);

  const shifted = AXIS[placement] === 'vertical' ? { top, left: left + correction(overflow.left, overflow.right) } : { top: top + correction(overflow.top, overflow.bottom), left };

  return { placement, top: shifted.top, left: shifted.left };
}

/** Only real overflow counts: the side that fits contributes nothing. */
function clamp(overflow: number) {
  return overflow > 0 ? overflow : 0;
}

/**
 * Turns the two overflows on an axis into a shift. `before` is the overflow on
 * the leading edge (top or left), `after` the one on the trailing edge; both
 * are positive when the surface spills past that edge.
 *
 * Pushing away from the leading edge moves the surface inwards, so the shift is
 * `+before`. The trailing edge needs the opposite sign. When both overflow the
 * surface is larger than the viewport: pin it to the leading edge and let
 * `max-width` stop the spill.
 */
function correction(before: number, after: number) {
  if (before > 0) {
    return before;
  }
  if (after > 0) {
    return -after;
  }
  return 0;
}
