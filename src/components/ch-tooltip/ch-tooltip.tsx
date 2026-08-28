import { Component, Element, Host, Listen, Prop, State, h } from '@stencil/core';

export type ChTooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

let tooltipIds = 0;

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
 */
@Component({
  tag: 'ch-tooltip',
  styleUrl: 'ch-tooltip.css',
  shadow: true,
})
export class ChTooltip {
  @Element() private el: HTMLElement;

  private readonly fallbackId = `ch-tooltip-${++tooltipIds}`;

  /**
   * Which side of the trigger the bubble is placed on.
   */
  @Prop() placement: ChTooltipPlacement = 'top';

  // Hover and focus are tracked apart so that neither cancels the other: a
  // pointer passing over and away must not hide a tooltip whose trigger still
  // holds keyboard focus.
  @State() hovered = false;
  @State() focused = false;
  @State() dismissed = false;

  private get visible() {
    return (this.hovered || this.focused) && !this.dismissed;
  }

  componentDidLoad() {
    this.associate();
  }

  @Listen('mouseenter')
  handleMouseEnter() {
    this.hovered = true;
    this.dismissed = false;
  }

  @Listen('mouseleave')
  handleMouseLeave() {
    this.hovered = false;
  }

  @Listen('focusin')
  handleFocusIn() {
    this.focused = true;
    this.dismissed = false;
  }

  @Listen('focusout')
  handleFocusOut() {
    this.focused = false;
  }

  /**
   * Listens on the document because a tooltip opened by hovering leaves focus
   * wherever it was, so a host-scoped handler would never see the key.
   */
  @Listen('keydown', { target: 'document' })
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.visible) {
      this.dismissed = true;
    }
  }

  private slotted(name: string) {
    return Array.from(this.el.children).find(child => child.getAttribute('slot') === name);
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
    return (
      <Host>
        <span class="anchor">
          <slot name="trigger" onSlotchange={this.associate}></slot>
          <span class={{ 'bubble': true, [`bubble--${this.placement}`]: true, 'bubble--visible': this.visible }}>
            <slot name="content" onSlotchange={this.associate}></slot>
          </span>
        </span>
      </Host>
    );
  }
}
