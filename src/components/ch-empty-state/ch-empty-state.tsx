import { Component, Host, Prop, h } from '@stencil/core';

export type ChEmptyStateSize = 'sm' | 'md';

/**
 * The standard "there is nothing here" block: an optional visual, a title, a
 * description and an action, laid out the same way everywhere.
 *
 * It works both inside a table cell and as a whole-page view: it fills its
 * container but never claims a fixed height.
 */
@Component({
  tag: 'ch-empty-state',
  styleUrl: 'ch-empty-state.css',
  shadow: true,
})
export class ChEmptyState {
  /**
   * Short heading stating what is missing, used as the accessible name of the
   * block.
   */
  @Prop() title!: string;

  /**
   * One or two sentences explaining what the user can do about it.
   */
  @Prop() description?: string;

  /**
   * Visual density. `sm` is for a region inside a page (a card, a table cell),
   * `md` for a whole view.
   */
  @Prop() size: ChEmptyStateSize = 'md';

  render() {
    return (
      <Host class={{ 'empty-state': true, [`empty-state--${this.size}`]: true }}>
        <div class="empty-state__inner">
          <div class="empty-state__icon" aria-hidden="true">
            <slot name="icon"></slot>
          </div>
          <h3 class="empty-state__title">{this.title}</h3>
          {this.description && <p class="empty-state__description">{this.description}</p>}
          <div class="empty-state__actions">
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
