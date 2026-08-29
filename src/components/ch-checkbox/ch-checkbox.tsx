import { AttachInternals, Component, Event, type EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';

let checkboxIds = 0;

@Component({
  tag: 'ch-checkbox',
  styleUrl: 'ch-checkbox.css',
  shadow: true,
  formAssociated: true,
})
export class ChCheckbox {
  private readonly checkboxId = `ch-checkbox-${++checkboxIds}`;
  private readonly hintId = `${this.checkboxId}-hint`;
  private readonly errorId = `${this.checkboxId}-error`;
  private initialChecked = false;

  @AttachInternals() internals!: ElementInternals;
  @State() formDisabled = false;

  /**
   * Visible label rendered next to the checkbox, associated with it via
   * `for`/`id`, so assistive technology announces the checkbox's purpose.
   */
  @Prop() label?: string;

  /**
   * The name of the checkbox, submitted with form data.
   */
  @Prop({ reflect: true }) name?: string;

  /**
   * The value of the checkbox, submitted with form data.
   */
  @Prop() value = 'on';

  /**
   * Whether the checkbox is checked.
   */
  @Prop({ mutable: true }) checked = false;

  /**
   * Whether the checkbox is disabled.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * Whether the checkbox is required.
   */
  @Prop({ reflect: true }) required = false;

  /**
   * Helper text rendered below the checkbox, associated via `aria-describedby`.
   * Replaced by `errorMessage` when the checkbox is invalid.
   */
  @Prop() hint?: string;

  /**
   * Error message rendered below the checkbox when it is invalid.
   */
  @Prop() errorMessage?: string;

  /**
   * Whether the checkbox is in an invalid state; toggles `aria-invalid` and error styling.
   */
  @Prop() invalid = false;

  /**
   * Emitted when the checked state changes, with the new checked value.
   */
  @Event() chChange: EventEmitter<boolean>;

  private handleChange = (ev: Event) => {
    this.checked = (ev.target as HTMLInputElement).checked;
    this.chChange.emit(this.checked);
  };

  @Watch('checked')
  @Watch('required')
  @Watch('invalid')
  @Watch('errorMessage')
  protected syncForm(): void {
    const internals = this.internals;
    if (typeof internals?.setFormValue !== 'function') {
      return;
    }
    internals.setFormValue(this.checked ? this.value : null);
    const flags: ValidityStateFlags = {};
    let message: string | undefined;
    if (this.required && !this.checked) {
      flags.valueMissing = true;
    }
    if (this.invalid && this.errorMessage) {
      flags.customError = true;
    }
    message = this.errorMessage ?? (flags.valueMissing ? 'Please fill out this field.' : undefined);
    internals.setValidity(flags, message);
  }

  componentDidLoad() {
    this.initialChecked = this.checked;
    this.syncForm();
  }

  formResetCallback(): void {
    this.checked = this.initialChecked;
  }

  formDisabledCallback(isDisabled: boolean): void {
    this.formDisabled = isDisabled;
  }

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
        <label class={{ 'control': true, 'control--disabled': this.disabled || this.formDisabled }} htmlFor={this.checkboxId}>
          <input
            id={this.checkboxId}
            class={{ 'input': true, 'input--invalid': this.invalid }}
            type="checkbox"
            name={this.name}
            value={this.value}
            checked={this.checked}
            disabled={this.disabled || this.formDisabled}
            required={this.required}
            aria-invalid={this.invalid ? 'true' : undefined}
            aria-describedby={this.describedBy}
            onChange={this.handleChange}
          />
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
