import { Component, Element, Host, Prop, h } from '@stencil/core';

export type ChGridGap = 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';

const GAPS = ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];

/**
 * Responsive grid of equal cells.
 *
 * `columns` takes a fixed count (`1`…`12`) or `auto-fit`, which fits as many
 * columns as `min-item-width` allows into the available width. That second mode
 * is the one a card list almost always wants: it needs no breakpoints and no
 * media queries of its own.
 */
@Component({
  tag: 'ch-grid',
  styleUrl: 'ch-grid.css',
  shadow: true,
})
export class ChGrid {
  @Element() el: HTMLChGridElement;

  /**
   * Number of equal columns (`1`…`12`), or `auto-fit` to fit as many as
   * `min-item-width` allows. An unknown value falls back to `auto-fit`.
   */
  @Prop() columns: string = 'auto-fit';

  /**
   * Space between cells in both axes, as a step of the spacing scale
   * (`2xs` … `6xl`), or `none`. An unknown value falls back to `md`.
   */
  @Prop() gap: ChGridGap = 'md';

  /**
   * Smallest width a cell may take in `auto-fit` mode, as a CSS length. It also
   * caps the column count in fixed mode, so a cell never gets narrower than it.
   */
  @Prop() minItemWidth = '16rem';

  private get gapStep() {
    return GAPS.includes(this.gap) ? this.gap : 'md';
  }

  private get fixedColumns() {
    const count = Number(this.columns);
    return Number.isInteger(count) && count >= 1 && count <= 12 ? count : null;
  }

  componentWillLoad() {
    this.applyColumns();
  }

  componentDidUpdate() {
    this.applyColumns();
  }

  /**
   * The column template is written as a CSS custom property rather than an
   * inline style: the template carries a comma and an internal `1fr`, and a
   * custom property keeps it out of the style string Stencil parses.
   */
  private applyColumns() {
    const template = this.fixedColumns === null ? `repeat(auto-fit, minmax(min(${this.minItemWidth}, 100%), 1fr))` : `repeat(${this.fixedColumns}, minmax(0, 1fr))`;
    this.el.style.setProperty('--ch-grid-columns', template);
  }

  render() {
    return (
      <Host class={{ grid: true, [`grid--gap-${this.gapStep}`]: true }}>
        <slot></slot>
      </Host>
    );
  }
}
