import { Component, Element, forceUpdate, Host, Listen, Prop, State, h } from '@stencil/core';

import { placeOverlay, type ChOverlayPlacement } from '../../utils/overlay';

export type ChTooltipPlacement = ChOverlayPlacement;

let tooltipIds = 0;

/** Space between the trigger and the bubble, matching `--spacing-md`. */
const GAP = 8;

/**
 * Short help text shown on hover and on focus.
 *
 * Both the trigger and the text come from the consumer's light DOM through
 * named slots. That is what makes the accessible association work: an
 * `aria-describedby` IDREF only resolves within a single tree, and slotted
 * nodes stay in the document tree even though they render inside the shadow
 * root. Keeping the text in the shadow root instead would need a reference
 * pointing into a shadow tree, which the platform does not allow — element
 * reflection only points outwards, and `referenceTarget` is not available yet.
 *
 * The trigger has to be a natively focusable element (`<button>`, `<a>`,
 * `<input>`). A chucao component such as `ch-button` will not be described,
 * because `aria-*` set on a custom element host does not reach the native
 * element inside it — see the discussion in issue #47.
 *
 * Positioning is measured, not purely CSS: `placement` is the preferred side,
 * and the bubble flips to the opposite side when the preferred one does not
 * fit, then shifts along the other axis to stay inside the viewport. It
 * re-measures on scroll, resize and visual-viewport changes, which is what
 * keeps it correct inside a scrolling modal or drawer and when a mobile
 * keyboard shrinks the visible area.
 */
@Component({
  tag: 'ch-tooltip',
  styleUrl: 'ch-tooltip.css',
  shadow: true,
})
export class ChTooltip {
  @Element() private el: HTMLElement;

  private readonly fallbackId = `ch-tooltip-${++tooltipIds}`;

  private bubbleEl?: HTMLElement;

  private probeEl?: HTMLElement;

  private cleanup?: () => void;

  /**
   * The side the bubble is placed on. It is a preference: when that side has no
   * room the bubble flips to the opposite one.
   */
  @Prop() placement: ChTooltipPlacement = 'top';

  // Hover and focus are tracked apart so that neither cancels the other: a
  // pointer passing over and away must not hide a tooltip whose trigger still
  // holds keyboard focus.
  @State() hovered = false;
  @State() focused = false;
  @State() dismissed = false;

  /** The placement actually used, which may differ from the prop after a flip. */
  @State() resolvedPlacement?: ChTooltipPlacement;

  /** Offset applied to the bubble once it has been measured. */
  private offset?: { top: number; left: number };

  private get visible() {
    return (this.hovered || this.focused) && !this.dismissed;
  }

  componentDidLoad() {
    this.associate();
  }

  connectedCallback() {
    this.watchViewport();
  }

  disconnectedCallback() {
    this.cleanup?.();
  }

  @Listen('mouseenter')
  handleMouseEnter() {
    this.hovered = true;
    this.dismissed = false;
    this.position();
  }

  @Listen('mouseleave')
  handleMouseLeave() {
    this.hovered = false;
  }

  @Listen('focusin')
  handleFocusIn() {
    this.focused = true;
    this.dismissed = false;
    this.position();
  }

  @Listen('focusout')
  handleFocusOut() {
    this.focused = false;
  }

  /**
   * Listens on the document because a tooltip opened by hovering leaves focus
   * wherever it was, so a host-scoped handler would never see the key.
   *
   * `preventDefault()` dismisses only the innermost surface: the platform's
   * close request for an open native `<dialog>` is the default action of this
   * same keydown, so cancelling it keeps an enclosing `ch-modal` open. Proven
   * against a real `ch-modal` in `tests/browser/ch-tooltip.browser.spec.ts`.
   */
  @Listen('keydown', { target: 'document' })
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.visible && !event.defaultPrevented) {
      event.preventDefault();
      this.dismissed = true;
    }
  }

  /** Cheap guard so scroll frames do not measure while nothing is shown. */
  @Listen('scroll', { target: 'window', capture: true, passive: true })
  handleScroll() {
    if (this.visible && this.offset) {
      this.position();
    }
  }

  @Listen('resize', { target: 'window', passive: true })
  handleResize() {
    this.position();
  }

  private watchViewport() {
    if (typeof window === 'undefined') {
      return;
    }
    const viewport = window.visualViewport;
    if (!viewport || this.cleanup) {
      return;
    }
    const update = () => this.position();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    this.cleanup = () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }

  private slotted(name: string) {
    return Array.from(this.el.children).find(child => child.getAttribute('slot') === name);
  }

  /**
   * Measures the anchor and the bubble and stores the offset that keeps the
   * bubble inside the viewport. Nothing is measured before the bubble has a
   * box to measure, so the pre-paint render uses plain CSS.
   *
   * A fixed bubble is positioned against the nearest ancestor that establishes
   * a containing block (a `transform`, `filter`, `backdrop-filter`, `contain`
   * or `will-change`), not necessarily the viewport. The probe is fixed at the
   * containing block's origin, so both the anchor and the viewport are
   * converted into that same space before `placeOverlay` does its maths.
   */
  private position() {
    if (typeof window === 'undefined') {
      return;
    }
    const bubble = this.bubbleEl ?? (this.bubbleEl = this.el.shadowRoot?.querySelector<HTMLElement>('.bubble') ?? undefined);
    const probe = this.probeEl ?? (this.probeEl = this.el.shadowRoot?.querySelector<HTMLElement>('.probe') ?? undefined);
    if (!bubble || !probe || bubble.offsetWidth === 0) {
      return;
    }

    const anchorRect = (this.slotted('trigger') as HTMLElement | undefined)?.getBoundingClientRect?.();
    if (!anchorRect) {
      return;
    }

    const probeRect = probe.getBoundingClientRect();
    const scaleX = probeRect.width || 1;
    const scaleY = probeRect.height || 1;
    const inContainingBlock = (rect: { top: number; left: number; width: number; height: number }) => ({
      top: (rect.top - probeRect.top) / scaleY,
      left: (rect.left - probeRect.left) / scaleX,
      width: rect.width / scaleX,
      height: rect.height / scaleY,
    });

    const surface = {
      width: bubble.offsetWidth + horizontalMargin(bubble),
      height: bubble.offsetHeight,
    };
    const viewport = window.visualViewport;

    const { placement, top, left } = placeOverlay({
      anchor: inContainingBlock(anchorRect),
      surface,
      viewport: inContainingBlock(
        viewport
          ? { top: viewport.offsetTop, left: viewport.offsetLeft, width: viewport.width, height: viewport.height }
          : { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight },
      ),
      preferred: this.placement,
      gap: GAP,
    });

    const current = this.offset;
    const unchanged = current?.top === top && current?.left === left && this.resolvedPlacement === placement;
    this.resolvedPlacement = placement;
    this.offset = { top, left };
    if (!unchanged) {
      forceUpdate(this);
    }
  }

  /**
   * Points the trigger at the text with `aria-describedby`. Re-run on
   * `slotchange` because a framework re-render can replace the slotted nodes
   * and take the attributes with them.
   */
  private associate = () => {
    const trigger = this.slotted('trigger');
    const content = this.slotted('content');
    if (!trigger || !content) {
      return;
    }
    if (!content.id) {
      content.id = this.fallbackId;
    }
    content.setAttribute('role', 'tooltip');
    trigger.setAttribute('aria-describedby', content.id);
  };

  render() {
    const { offset } = this;

    return (
      <Host>
        <span class="anchor">
          <span class="probe" aria-hidden="true" ref={el => (this.probeEl = el)}></span>
          {/* Pre-measure render uses the preferred side so the bubble never
              jumps from the wrong edge on its first frame. */}
          <slot name="trigger" onSlotchange={this.associate}></slot>
          <span
            ref={el => (this.bubbleEl = el)}
            style={{
              '--ch-tooltip-offset-top': offset ? `${offset.top}px` : null,
              '--ch-tooltip-offset-left': offset ? `${offset.left}px` : null,
            }}
            class={{
              'bubble': true,
              'bubble--positioned': Boolean(this.offset),
              [`bubble--${this.resolvedPlacement ?? this.placement}`]: true,
              'bubble--visible': this.visible,
            }}
          >
            <slot name="content" onSlotchange={this.associate}></slot>
          </span>
        </span>
      </Host>
    );
  }
}

function horizontalMargin(el: HTMLElement) {
  const style = getComputedStyle(el);
  return (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);
}
