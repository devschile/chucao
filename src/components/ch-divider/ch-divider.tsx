import { Component, Host, Prop, h } from '@stencil/core';

export type ChDividerOrientation = 'horizontal' | 'vertical';

@Component({
  tag: 'ch-divider',
  styleUrl: 'ch-divider.css',
  shadow: true,
})
export class ChDivider {
  /**
   * The orientation of the divider. Either `horizontal` (default) or `vertical`.
   */
  @Prop() orientation: ChDividerOrientation = 'horizontal';

  render() {
    return (
      <Host class={{ 'divider--vertical': this.orientation === 'vertical' }}>
        <hr class={{ divider: true, [`divider--${this.orientation}`]: true }} aria-orientation={this.orientation} />
      </Host>
    );
  }
}
