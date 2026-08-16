import { Component, Event, type EventEmitter, Host, Prop, h } from '@stencil/core';

export type ChLinkVariant = 'default' | 'muted';

@Component({
  tag: 'ch-link',
  styleUrl: 'ch-link.css',
  shadow: true,
})
export class ChLink {
  /**
   * The URL the link points to.
   */
  @Prop() href?: string;

  /**
   * The browsing context the link opens in (e.g. `_blank`). For `_blank`, a
   * `noopener noreferrer` `rel` is added automatically.
   */
  @Prop() target?: string;

  /**
   * The visual style of the link. Either `default` or `muted`.
   */
  @Prop() variant: ChLinkVariant = 'default';

  /**
   * Whether the link is disabled. Renders a non-interactive element with
   * `aria-disabled="true"` instead of an anchor.
   */
  @Prop() disabled = false;

  /**
   * Emitted when the link is clicked.
   */
  @Event() chClick: EventEmitter<MouseEvent>;

  private handleClick = (ev: MouseEvent) => {
    this.chClick.emit(ev);
  };

  render() {
    if (this.disabled) {
      return (
        <Host>
          <span class={{ 'link': true, [`link--${this.variant}`]: true, 'link--disabled': true }} part="link" aria-disabled="true">
            <slot></slot>
          </span>
        </Host>
      );
    }
    return (
      <Host>
        <a
          class={{ link: true, [`link--${this.variant}`]: true }}
          part="link"
          href={this.href}
          target={this.target}
          rel={this.target === '_blank' ? 'noopener noreferrer' : undefined}
          onClick={this.handleClick}
        >
          <slot></slot>
        </a>
      </Host>
    );
  }
}
