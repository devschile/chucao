import { Component, Host, Prop, h } from '@stencil/core';

export type ChStackGap = 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
export type ChStackAlign = 'stretch' | 'start' | 'center' | 'end';
export type ChStackJustify = 'start' | 'center' | 'end' | 'between' | 'around';

const GAPS = new Set(['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']);

/**
 * Vertical flow: children stack top to bottom with a token-driven gap.
 *
 * It is a real host with `display: flex`, not `display: contents`, so a
 * consumer's own classes and attributes on `<ch-stack>` keep working.
 */
@Component({
  tag: 'ch-stack',
  styleUrl: 'ch-stack.css',
  shadow: true,
})
export class ChStack {
  /**
   * Space between children, as a step of the spacing scale (`2xs` … `6xl`),
   * or `none` for no gap. An unknown value falls back to `md`.
   */
  @Prop() gap: ChStackGap = 'md';

  /**
   * Cross-axis alignment of the children.
   */
  @Prop() align: ChStackAlign = 'stretch';

  /**
   * Main-axis distribution of the children.
   */
  @Prop() justify: ChStackJustify = 'start';

  private get gapStep() {
    return GAPS.has(this.gap) ? this.gap : 'md';
  }

  render() {
    return (
      <Host class={{ stack: true, [`stack--gap-${this.gapStep}`]: true, [`stack--align-${this.align}`]: true, [`stack--justify-${this.justify}`]: true }}>
        <slot></slot>
      </Host>
    );
  }
}
