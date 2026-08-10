import { Component, Event, type EventEmitter, Host, Prop, h } from '@stencil/core';

export interface ChRadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

let radioIds = 0;

@Component({
  tag: 'ch-radio',
  styleUrl: 'ch-radio.css',
  shadow: true,
})
export class ChRadio {
  private readonly groupId = `ch-radio-${++radioIds}`;
  private readonly labelId = `${this.groupId}-label`;
  private readonly hintId = `${this.groupId}-hint`;
  private readonly errorId = `${this.groupId}-error`;

  /**
   * Visible label describing the radio group, associated with it via
   * `aria-labelledby`.
   */
  @Prop() label?: string;

  /**
   * The list of options rendered as radio inputs.
   */
  @Prop() options: ChRadioOption[] = [];

  /**
   * The value of the selected option.
   */
  @Prop({ mutable: true }) value?: string;

  /**
   * The name shared by all radio inputs in the group. Defaults to an
   * auto-generated group name so options are mutually exclusive out of the box.
   */
  @Prop() name?: string;

  /**
   * Whether all radios in the group are disabled.
   */
  @Prop() disabled = false;

  /**
   * Whether a value is required.
   */
  @Prop() required = false;

  /**
   * Helper text rendered below the radio group, associated via `aria-describedby`.
   * Replaced by `errorMessage` when the group is invalid.
   */
  @Prop() hint?: string;

  /**
   * Error message rendered below the radio group when it is invalid.
   */
  @Prop() errorMessage?: string;

  /**
   * Whether the radio group is in an invalid state; toggles `aria-invalid` and error styling.
   */
  @Prop() invalid = false;

  /**
   * Emitted when a new option is selected, with the selected value.
   */
  @Event() chChange: EventEmitter<string>;

  private handleChange = (ev: Event) => {
    this.value = (ev.target as HTMLInputElement).value;
    this.chChange.emit(this.value);
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
    const groupName = this.name || `${this.groupId}-group`;
    return (
      <Host>
        {this.label && (
          <span class="group-label" id={this.labelId}>
            {this.label}
          </span>
        )}
        <div class="radio-group" role="radiogroup" aria-labelledby={this.label ? this.labelId : undefined}>
          {this.options.map(option => (
            <label class={{ 'control': true, 'control--disabled': this.disabled || option.disabled }}>
              <input
                class={{ 'input': true, 'input--invalid': this.invalid }}
                type="radio"
                name={groupName}
                value={option.value}
                checked={option.value === this.value}
                disabled={this.disabled || option.disabled}
                aria-invalid={this.invalid ? 'true' : undefined}
                aria-describedby={this.describedBy}
                onChange={this.handleChange}
              />
              <span class="mark"></span>
              <span class="label-text">{option.label}</span>
            </label>
          ))}
        </div>
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
