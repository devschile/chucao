import { AttachInternals, Component, Element, Event, type EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';

export interface ChSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

let selectIds = 0;

@Component({
  tag: 'ch-select',
  styleUrl: 'ch-select.css',
  shadow: true,
  formAssociated: true,
})
export class ChSelect {
  private readonly selectId = `ch-select-${++selectIds}`;
  private readonly hintId = `${this.selectId}-hint`;
  private readonly errorId = `${this.selectId}-error`;
  private initialValue: string | undefined;

  @AttachInternals() internals!: ElementInternals;
  @State() formDisabled = false;
  @Element() private host!: HTMLElement;

  /**
   * Visible label rendered above the select and associated with it via
   * `for`/`id`, so assistive technology announces the select's purpose.
   */
  @Prop() label?: string;

  /**
   * The list of options rendered inside the select.
   */
  @Prop() options: ChSelectOption[] = [];

  /**
   * The value of the selected option.
   */
  @Prop({ mutable: true }) value?: string;

  /**
   * Placeholder shown as a disabled, hidden first option when no value is selected.
   */
  @Prop() placeholder?: string;

  /**
   * The name of the select, submitted with form data.
   */
  @Prop({ reflect: true }) name?: string;

  /**
   * Whether the select is disabled.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * Whether a value is required.
   */
  @Prop({ reflect: true }) required = false;

  /**
   * Helper text rendered below the select, associated via `aria-describedby`.
   * Replaced by `errorMessage` when the select is invalid.
   */
  @Prop() hint?: string;

  /**
   * Error message rendered below the select when it is invalid.
   */
  @Prop() errorMessage?: string;

  /**
   * Whether the select is in an invalid state; toggles `aria-invalid` and error styling.
   */
  @Prop() invalid = false;

  /**
   * Emitted when the selected option changes, with the new value.
   */
  @Event() chChange: EventEmitter<string>;

  private handleChange = (ev: Event) => {
    this.value = (ev.target as HTMLSelectElement).value;
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
    internals.setFormValue(this.value ?? '');
    const flags: ValidityStateFlags = {};
    let message: string | undefined;
    if (this.required && !this.value) {
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
          <label class="label" htmlFor={this.selectId}>
            {this.label}
          </label>
        )}
        <select
          id={this.label ? this.selectId : undefined}
          class={{ 'select': true, 'select--invalid': this.invalid }}
          name={this.name}
          disabled={this.disabled || this.formDisabled}
          required={this.required}
          aria-invalid={this.invalid ? 'true' : undefined}
          aria-describedby={this.describedBy}
          onChange={this.handleChange}
        >
          {this.placeholder && (
            <option value="" disabled hidden selected={!this.value}>
              {this.placeholder}
            </option>
          )}
          {this.options.map(option => (
            <option value={option.value} disabled={option.disabled} selected={option.value === this.value}>
              {option.label}
            </option>
          ))}
        </select>
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
