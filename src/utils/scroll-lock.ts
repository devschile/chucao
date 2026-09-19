let openOverlays = 0;
let previousOverflow = '';
let previousPaddingRight = '';

/**
 * Prevents the page behind an overlay from scrolling, compensating for the
 * scrollbar it removes so the layout does not shift.
 *
 * Reference-counted on a module-level counter, so concurrent overlays (a modal
 * over a drawer, several stacked dialogs) cannot unlock the page early:
 * whichever overlay closes first only decrements the count, and the last one
 * restores the original styles.
 *
 * Callers must pair every `lockScroll()` with exactly one `unlockScroll()`.
 */
export function lockScroll() {
  openOverlays += 1;
  if (openOverlays > 1) {
    return;
  }
  const root = document.documentElement;
  const scrollbar = window.innerWidth - root.clientWidth;
  previousOverflow = root.style.overflow;
  previousPaddingRight = root.style.paddingRight;
  root.style.overflow = 'hidden';
  if (scrollbar > 0) {
    root.style.paddingRight = `${scrollbar}px`;
  }
}

/**
 * Releases one scroll lock. Only the last lock restores the page; earlier calls
 * are a no-op so the overlay still open keeps the page frozen.
 */
export function unlockScroll() {
  openOverlays -= 1;
  if (openOverlays > 0) {
    return;
  }
  const root = document.documentElement;
  root.style.overflow = previousOverflow;
  root.style.paddingRight = previousPaddingRight;
}
