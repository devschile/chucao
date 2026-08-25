import { Component, Event, type EventEmitter, Host, Prop, h } from '@stencil/core';

export type ChAlertVariant = 'default' | 'positive' | 'warning';

/**
 * Block-level status message.
 *
 * `warning` carries `role="alert"` and is announced assertively; `default` and
 * `positive` use `role="status"`, since a confirmation is not urgent enough to
 * interrupt. Both announce reliably when the alert is added to the page in
 * response to something — an alert already present at load may not be read out,
 * which is how live regions work rather than something this component controls.
 */
@Component({
  tag: 'ch-alert',
  styleUrl: 'ch-alert.css',
  shadow: true,
})
export class ChAlert {
  /**
   * The kind of message. `default` is neutral, `positive` confirms, and
   * `warning` covers both warnings and errors — the token scale has a single
   * status colour for the two of them.
   */
  @Prop() variant: ChAlertVariant = 'default';

  /**
   * Accessible label for the dismiss button, set as `aria-label`. Setting it
   * is what adds the button: the button's only content is a decorative glyph,
   * so without a label it would have no accessible name at all.
   */
  @Prop() dismissLabel?: string;

  /**
   * Emitted when the dismiss button is clicked. The alert stays in the DOM —
   * whether to remove it is the consumer's decision. If you do remove it, move
   * focus somewhere sensible first: removing the focused button drops focus to
   * `<body>`.
   */
  @Event() chDismiss: EventEmitter<void>;

  private handleDismiss = () => {
    this.chDismiss.emit();
  };

  render() {
    const role = this.variant === 'warning' ? 'alert' : 'status';

    return (
      <Host>
        {/* Keyed on the role so a variant change replaces the node instead of
            mutating its role in place, which assistive technology does not
            reliably re-announce. */}
        <div key={role} class={{ alert: true, [`alert--${this.variant}`]: true }} role={role}>
          <div class="alert-content">
            <slot></slot>
          </div>
          {this.dismissLabel && (
            <button class="alert-dismiss" type="button" aria-label={this.dismissLabel} onClick={this.handleDismiss}>
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
      </Host>
    );
  }
}
