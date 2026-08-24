import { Component, Event, type EventEmitter, Host, Prop, h } from '@stencil/core';

export type ChAlertVariant = 'info' | 'positive' | 'warning';

/**
 * Block-level status message.
 *
 * `warning` is announced assertively via `role="alert"`; `info` and `positive`
 * use `role="status"`, since a confirmation is not urgent enough to interrupt.
 */
@Component({
  tag: 'ch-alert',
  styleUrl: 'ch-alert.css',
  shadow: true,
})
export class ChAlert {
  /**
   * The kind of message. `info` is neutral, `positive` confirms, and `warning`
   * covers both warnings and errors — the token scale has a single status
   * colour for the two of them.
   */
  @Prop() variant: ChAlertVariant = 'info';

  /**
   * Whether to render a dismiss button that emits `chDismiss`.
   */
  @Prop() dismissible = false;

  /**
   * Accessible label for the dismiss button, set as `aria-label`. Set it
   * whenever `dismissible` is used: the button carries no text of its own.
   */
  @Prop() dismissLabel?: string;

  /**
   * Emitted when the dismiss button is clicked. The alert stays in the DOM —
   * whether to remove it is the consumer's decision.
   */
  @Event() chDismiss: EventEmitter<void>;

  private handleDismiss = () => {
    this.chDismiss.emit();
  };

  render() {
    return (
      <Host>
        <div class={{ alert: true, [`alert--${this.variant}`]: true }} role={this.variant === 'warning' ? 'alert' : 'status'}>
          <div class="alert-content">
            <slot></slot>
          </div>
          {this.dismissible && (
            <button class="alert-dismiss" type="button" aria-label={this.dismissLabel} onClick={this.handleDismiss}>
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
      </Host>
    );
  }
}
