import { Component, Host, Prop, h } from '@stencil/core';

export type ChDescriptionListColumns = '1' | '2' | '3';

const COLUMNS = new Set(['1', '2', '3']);

/**
 * Label/value pairs for detail views, on a native `<dl>`.
 *
 * The component renders the `<dl>` and the layout; the consumer writes the
 * terms and descriptions. Group each pair in a `<div>` (valid HTML 5.2
 * grouping) — the group is the grid item, which is what keeps a pair from
 * splitting across columns:
 *
 * ```html
 * <ch-description-list columns="2">
 *   <div><dt>Cliente</dt><dd>Aurora SpA</dd></div>
 *   <div><dt>Pedido</dt><dd>#1523</dd></div>
 * </ch-description-list>
 * ```
 *
 * The markup stays native in the light DOM, so the `term` role reaches the
 * accessibility tree untouched — the shape decision on #81 measured that a
 * custom wrapper adds nothing in Chromium while risking other browsers. No
 * `ch-description-item` element exists for the same reason.
 */
@Component({
  tag: 'ch-description-list',
  styleUrl: 'ch-description-list.css',
  shadow: true,
})
export class ChDescriptionList {
  /**
   * How many pairs share a row on a wide viewport. One column is the stacked
   * layout. An unknown value falls back to one column.
   */
  @Prop() columns: ChDescriptionListColumns = '1';

  private get columnCount() {
    return COLUMNS.has(this.columns) ? this.columns : '1';
  }

  render() {
    return (
      <Host>
        <dl class={`list list--columns-${this.columnCount}`}>
          <slot></slot>
        </dl>
      </Host>
    );
  }
}
