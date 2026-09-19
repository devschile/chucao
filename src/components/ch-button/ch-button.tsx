import { Component, Event, type EventEmitter, Host, Prop, h } from '@stencil/core';

export type ChButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ChButtonSize = 'sm' | 'md' | 'lg';

@Component({
  tag: 'ch-button',
  styleUrl: 'ch-button.css',
  shadow: true,
})
export class ChButton {
  /**
   * The visual style of the button. One of `primary`, `secondary`, `ghost`,
   * or `danger`.
   */
  @Prop() variant: ChButtonVariant = 'primary';

  /**
   * The size of the button. One of `sm`, `md`, or `lg`.
   */
  @Prop() size: ChButtonSize = 'md';

  /**
   * Whether the button is disabled.
   */
  @Prop() disabled = false;

  /**
   * Whether the button is loading. Shows a spinner, disables interaction, and
   * announces the busy state with `aria-busy`.
   */
  @Prop() loading = false;

  /**
   * When set, the button renders as an `<a>` pointing to this URL while
   * keeping the button styling.
   */
  @Prop() href?: string;

  /**
   * The browsing context the link opens in (e.g. `_blank`). Only used when
   * `href` is set. For `_blank`, a `noopener noreferrer` `rel` is added
   * automatically.
   */
  @Prop() target?: string;

  /**
   * Accessible label set as `aria-label` on the native element. Use it when
   * the button's content doesn't convey its purpose on its own (e.g. an
   * icon-only button).
   */
  @Prop() label?: string;

  /**
   * Emitted when the button is clicked.
   */
  @Event() chClick: EventEmitter<MouseEvent>;

  private handleClick = (ev: MouseEvent) => {
    if (this.disabled || this.loading) {
      ev.preventDefault();
      return;
    }
    this.chClick.emit(ev);
  };

  private get spinnerSize() {
    return this.size === 'lg' ? 'md' : 'sm';
  }

  private renderContent() {
    return [this.loading ? <ch-spinner size={this.spinnerSize}></ch-spinner> : <slot name="start"></slot>, <slot></slot>, <slot name="end"></slot>];
  }

  render() {
    const classes = {
      'btn': true,
      [`btn--${this.variant}`]: true,
      [`btn--${this.size}`]: true,
      'btn--loading': this.loading,
    };

    if (this.href && !this.disabled && !this.loading) {
      return (
        <Host>
          <a
            class={classes}
            href={this.href}
            target={this.target}
            rel={this.target === '_blank' ? 'noopener noreferrer' : undefined}
            aria-label={this.label}
            onClick={this.handleClick}
          >
            {this.renderContent()}
          </a>
        </Host>
      );
    }

    if (this.href) {
      return (
        <Host>
          <span class={{ ...classes, 'btn--disabled': true }} aria-label={this.label} aria-disabled="true" aria-busy={this.loading ? 'true' : undefined}>
            {this.renderContent()}
          </span>
        </Host>
      );
    }

    return (
      <Host>
        <button
          class={classes}
          type="button"
          disabled={this.disabled || this.loading}
          aria-label={this.label}
          aria-busy={this.loading ? 'true' : undefined}
          onClick={this.handleClick}
        >
          {this.renderContent()}
        </button>
      </Host>
    );
  }
}
