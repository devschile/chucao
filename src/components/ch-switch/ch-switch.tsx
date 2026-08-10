import { Component, Event, type EventEmitter, Host, Prop, h } from '@stencil/core';

let switchIds = 0;

@Component({
  tag: 'ch-switch',
  styleUrl: 'ch-switch.css',
  shadow: true,
})
export class ChSwitch {
  private readonly switchId = `ch-switch-${++switchIds}`;
  private readonly hintId = `${this.switchId}-hint`;
  private readonly errorId = `${this.switchId}-error`;

  /**
   * Visible label rendered next to the switch, associated with it via
   * `for`/`id`, so assistive technology announces the switch's purpose.
   */
  @Prop() label?: string;

  /**
   * The name of the switch, submitted with form data.
   */
  @Prop() name?: string;

  /**
   * The value of the switch, submitted with form data.
   */
  @Prop() value = 'on';

  /**
   * Whether the switch is on.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * Whether the switch is disabled.
   */
  @Prop() disabled = false;

  /**
   * Whether the switch is required.
   */
  @Prop() required = false;

  /**
   * Helper text rendered below the switch, associated via `aria-describedby`.
   * Replaced by `errorMessage` when the switch is invalid.
   */
  @Prop() hint?: string;

  /**
   * Error message rendered below the switch when it is invalid.
   */
  @Prop() errorMessage?: string;

  /**
   * Whether the switch is in an invalid state; toggles `aria-invalid` and error styling.
   */
  @Prop() invalid = false;

  /**
   * Emitted when the switch is toggled, with the new on/off state.
   */
  @Event() chChange: EventEmitter<boolean>;

  private handleChange = (ev: Event) => {
    this.checked = (ev.target as HTMLInputElement).checked;
    this.chChange.emit(this.checked);
  };

  private get describedBy(): string | undefined {
    if (this.invalid && this.errorMessage) {
      return this.errorId;
    }
    if (this.hint) {
      return this.hintId;
    }
    return undefined;
  }

  render() {
    return (
      <Host>
        <label class={{ 'control': true, 'control--disabled': this.disabled }} htmlFor={this.switchId}>
          <input
            id={this.switchId}
            class={{ 'input': true, 'input--invalid': this.invalid }}
            type="checkbox"
            role="switch"
            name={this.name}
            value={this.value}
            checked={this.checked}
            disabled={this.disabled}
            required={this.required}
            aria-checked={this.checked ? 'true' : 'false'}
            aria-invalid={this.invalid ? 'true' : undefined}
            aria-describedby={this.describedBy}
            onChange={this.handleChange}
          />
          <span class="track"></span>
          <span class="thumb"></span>
          {this.label && <span class="label-text">{this.label}</span>}
        </label>
        {this.hint && !(this.invalid && this.errorMessage) && (
          <p class="hint" id={this.hintId}>
            {this.hint}
          </p>
        )}
        {this.invalid && this.errorMessage && (
          <p class="error" id={this.errorId} role="alert">
            {this.errorMessage}
          </p>
        )}
      </Host>
    );
  }
}
