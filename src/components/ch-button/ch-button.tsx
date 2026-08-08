import { Component, Event, type EventEmitter, Host, Prop, h } from '@stencil/core';

export type ChButtonVariant = 'primary' | 'secondary';

@Component({
  tag: 'ch-button',
  styleUrl: 'ch-button.css',
  shadow: true,
})
export class ChButton {
  /**
   * The visual style of the button. Either `primary` or `secondary`.
   */
  @Prop() variant: ChButtonVariant = 'primary';

  /**
   * Whether the button is disabled.
   */
  @Prop() disabled = false;

  /**
   * Accessible label set as `aria-label` on the native `<button>`. Use it
   * when the button's content doesn't convey its purpose on its own (e.g.
   * an icon-only button).
   */
  @Prop() label?: string;

  /**
   * Emitted when the button is clicked.
   */
  @Event() chClick: EventEmitter<MouseEvent>;

  private handleClick = (ev: MouseEvent) => {
    this.chClick.emit(ev);
  };

  render() {
    return (
      <Host>
        <button
          class={{ btn: true, [`btn--${this.variant}`]: true }}
          type="button"
          disabled={this.disabled}
          aria-label={this.label}
          onClick={this.handleClick}
        >
          <slot></slot>
        </button>
      </Host>
    );
  }
}
