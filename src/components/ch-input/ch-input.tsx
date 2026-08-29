import { AttachInternals, Component, Element, Event, type EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';

let inputIds = 0;

@Component({
  tag: 'ch-input',
  styleUrl: 'ch-input.css',
  shadow: true,
  formAssociated: true,
})
export class ChInput {
  private readonly inputId = `ch-input-${++inputIds}`;
  private readonly hintId = `${this.inputId}-hint`;
  private readonly errorId = `${this.inputId}-error`;
  private initialValue = '';

  @AttachInternals() internals!: ElementInternals;
  @State() formDisabled = false;
  @Element() private host!: HTMLElement;

  /**
   * Visible label rendered above the input and associated with it via
   * `for`/`id`, so assistive technology announces the input's purpose.
   */
  @Prop() label?: string;

  /**
   * The type of the input, mirroring the native `<input type>` attribute.
   */
  @Prop() type = 'text';

  /**
   * The value of the input.
   */
  @Prop({ mutable: true }) value = '';

  /**
   * Placeholder text shown when the input is empty.
   */
  @Prop() placeholder?: string;

  /**
   * The name of the input, submitted with form data.
   */
  @Prop({ reflect: true }) name?: string;

  /**
   * Whether the input is disabled.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * Whether the input is required.
   */
  @Prop({ reflect: true }) required = false;

  /**
   * Helper text rendered below the input, associated via `aria-describedby`.
   * Replaced by `errorMessage` when the input is invalid.
   */
  @Prop() hint?: string;

  /**
   * Error message rendered below the input when it is invalid.
   */
  @Prop() errorMessage?: string;

  /**
   * Whether the input is in an invalid state; toggles `aria-invalid` and error styling.
   */
  @Prop() invalid = false;

  /**
   * Emitted on every keystroke, with the current input value.
   */
  @Event() chInput: EventEmitter<string>;

  /**
   * Emitted when the input value is committed (on native `change`).
   */
  @Event() chChange: EventEmitter<string>;

  private handleInput = (ev: InputEvent) => {
    this.value = (ev.target as HTMLInputElement).value;
    this.chInput.emit(this.value);
  };

  private handleChange = (ev: Event) => {
    this.value = (ev.target as HTMLInputElement).value;
    this.chChange.emit(this.value);
  };

  @Watch('value')
  @Watch('required')
  @Watch('invalid')
  @Watch('errorMessage')
  protected syncForm(): void {
    const internals = this.internals;
    if (typeof internals?.setFormValue !== 'function') {
      return;
    }
    internals.setFormValue(this.value);
    const flags: ValidityStateFlags = {};
    let message: string | undefined;
    if (this.required && this.value === '') {
      flags.valueMissing = true;
    }
    if (this.invalid && this.errorMessage) {
      flags.customError = true;
    }
    message = this.errorMessage ?? (flags.valueMissing ? 'Please fill out this field.' : undefined);
    internals.setValidity(flags, message);
  }

  componentDidLoad() {
    this.initialValue = this.value;
    this.syncForm();
    this.host.addEventListener('change', this.markTouched);
    this.host.addEventListener('focusout', this.markTouched);
    this.host.addEventListener('invalid', this.markTouched);
  }

  private markTouched = (): void => {
    this.host.setAttribute('data-touched', '');
  };

  formResetCallback(): void {
    this.value = this.initialValue;
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
        {this.label && (
          <label class="label" htmlFor={this.inputId}>
            {this.label}
          </label>
        )}
        <input
          id={this.label ? this.inputId : undefined}
          class={{ 'input': true, 'input--invalid': this.invalid }}
          type={this.type}
          name={this.name}
          placeholder={this.placeholder}
          disabled={this.disabled || this.formDisabled}
          required={this.required}
          value={this.value}
          aria-invalid={this.invalid ? 'true' : undefined}
          aria-describedby={this.describedBy}
          onInput={this.handleInput}
          onChange={this.handleChange}
        />
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
