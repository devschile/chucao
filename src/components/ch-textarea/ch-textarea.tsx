import { AttachInternals, Component, Event, type EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';

let textareaIds = 0;

const DEFAULT_ROWS = 4;

@Component({
  tag: 'ch-textarea',
  styleUrl: 'ch-textarea.css',
  shadow: true,
  formAssociated: true,
})
export class ChTextarea {
  private readonly textareaId = `ch-textarea-${++textareaIds}`;
  private readonly hintId = `${this.textareaId}-hint`;
  private readonly errorId = `${this.textareaId}-error`;
  private initialValue = '';

  @AttachInternals() internals!: ElementInternals;
  @State() formDisabled = false;

  /**
   * Visible label rendered above the textarea and associated with it via
   * `for`/`id`, so assistive technology announces the textarea's purpose.
   */
  @Prop() label?: string;

  /**
   * The value of the textarea.
   */
  @Prop({ mutable: true }) value = '';

  /**
   * Placeholder text shown when the textarea is empty.
   */
  @Prop() placeholder?: string;

  /**
   * The number of visible rows of the textarea.
   */
  @Prop() rows = DEFAULT_ROWS;

  /**
   * The name of the textarea, submitted with form data.
   */
  @Prop({ reflect: true }) name?: string;

  /**
   * Whether the textarea is disabled.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * Whether the textarea is required.
   */
  @Prop({ reflect: true }) required = false;

  /**
   * Helper text rendered below the textarea, associated via `aria-describedby`.
   * Replaced by `errorMessage` when the textarea is invalid.
   */
  @Prop() hint?: string;

  /**
   * Error message rendered below the textarea when it is invalid.
   */
  @Prop() errorMessage?: string;

  /**
   * Whether the textarea is in an invalid state; toggles `aria-invalid` and error styling.
   */
  @Prop() invalid = false;

  /**
   * Emitted on every keystroke, with the current textarea value.
   */
  @Event() chInput: EventEmitter<string>;

  /**
   * Emitted when the textarea value is committed (on native `change`).
   */
  @Event() chChange: EventEmitter<string>;

  private handleInput = (ev: InputEvent) => {
    this.value = (ev.target as HTMLTextAreaElement).value;
    this.chInput.emit(this.value);
  };

  private handleChange = (ev: Event) => {
    this.value = (ev.target as HTMLTextAreaElement).value;
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
  }

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
          <label class="label" htmlFor={this.textareaId}>
            {this.label}
          </label>
        )}
        <textarea
          id={this.label ? this.textareaId : undefined}
          class={{ 'textarea': true, 'textarea--invalid': this.invalid }}
          rows={this.rows}
          name={this.name}
          placeholder={this.placeholder}
          disabled={this.disabled || this.formDisabled}
          required={this.required}
          value={this.value}
          aria-invalid={this.invalid ? 'true' : undefined}
          aria-describedby={this.describedBy}
          onInput={this.handleInput}
          onChange={this.handleChange}
        ></textarea>
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
