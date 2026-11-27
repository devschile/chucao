import { Component, Host, Prop, h } from '@stencil/core';

export type ChBadgeVariant = 'default' | 'positive' | 'warning';

/**
 * Small status label.
 *
 * Variants are not colour-only: each one also changes the leading dot's shape
 * and adds a matching border, so a badge still says which state it is in when
 * printed in grayscale or seen with colour-vision deficiency. `default` uses a
 * filled dot, `positive` a ring, and `warning` a filled square.
 */
@Component({
  tag: 'ch-badge',
  styleUrl: 'ch-badge.css',
  shadow: true,
})
export class ChBadge {
  /**
   * The visual style of the badge. Either `default`, `positive`, or `warning`.
   */
  @Prop() variant: ChBadgeVariant = 'default';

  /**
   * Whether to show the variant marker. On by default so the state does not
   * depend on colour; turn it off for a badge that only repeats text already
   * carrying the meaning.
   */
  @Prop() statusCue = true;

  render() {
    return (
      <Host>
        <span class={{ badge: true, [`badge--${this.variant}`]: true }}>
          {this.statusCue && <span class="badge-dot" aria-hidden="true"></span>}
          <slot></slot>
        </span>
      </Host>
    );
  }
}
