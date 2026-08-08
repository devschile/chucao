import { Component, Host, Prop, h } from '@stencil/core';

export type ChBadgeVariant = 'default' | 'positive' | 'warning';

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

  render() {
    return (
      <Host>
        <span class={{ badge: true, [`badge--${this.variant}`]: true }}>
          <slot></slot>
        </span>
      </Host>
    );
  }
}
