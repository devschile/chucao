import { Component, Host, Prop, h } from '@stencil/core';

export type ChClusterGap = 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
export type ChClusterAlign = 'stretch' | 'start' | 'center' | 'end' | 'baseline';
export type ChClusterJustify = 'start' | 'center' | 'end' | 'between' | 'around';

const GAPS = ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];

/**
 * Horizontal flow that wraps when it runs out of room, with a token-driven
 * gap in both axes — the layout a toolbar, a tag list or a button row needs.
 */
@Component({
  tag: 'ch-cluster',
  styleUrl: 'ch-cluster.css',
  shadow: true,
})
export class ChCluster {
  /**
   * Space between children in both axes, as a step of the spacing scale
   * (`2xs` … `6xl`), or `none`. An unknown value falls back to `md`.
   */
  @Prop() gap: ChClusterGap = 'md';

  /**
   * Cross-axis alignment of the children.
   */
  @Prop() align: ChClusterAlign = 'center';

  /**
   * Main-axis distribution of the children.
   */
  @Prop() justify: ChClusterJustify = 'start';

  /**
   * Whether the children wrap onto a new line when they run out of room.
   */
  @Prop() wrap = true;

  private get gapStep() {
    return GAPS.includes(this.gap) ? this.gap : 'md';
  }

  render() {
    return (
      <Host
        class={{
          'cluster': true,
          [`cluster--gap-${this.gapStep}`]: true,
          [`cluster--align-${this.align}`]: true,
          [`cluster--justify-${this.justify}`]: true,
          'cluster--nowrap': !this.wrap,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
