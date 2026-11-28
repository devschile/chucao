import { AttachInternals, Component, Element, Event, type EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';

import { resolveValidity } from '../../utils/validation-message';

export type ChNumberInputFormat = 'plain' | 'clp';

export type ChNumberInputStep = number | 'any';

let numberInputIds = 0;

/**
 * Numeric input that keeps what the user is typing separate from the value the
 * form submits.
 *
 * The display is formatted (`1.234.567` for CLP) while `value` and `FormData`
 * carry a canonical machine-readable string: digits only for CLP, the plain
 * decimal for `plain`. Parsing on every keystroke cannot represent the
 * intermediate states people actually type — `-`, `1.`, `0,` — so those stay as
 * text and are validated at the end.
 *
 * Empty is not zero. A cleared field submits `''` and reports `valueMissing`
 * when required; it never becomes `0`.
 *
 * There is no separate currency component: `format="clp"` is the currency
 * boundary for Chilean pesos, the only case with a real consumer.
 */
@Component({
  tag: 'ch-number-input',
  styleUrl: 'ch-number-input.css',
  shadow: true,
  formAssociated: true,
})
export class ChNumberInput {
  private readonly inputId = `ch-number-input-${++numberInputIds}`;
  private readonly hintId = `${this.inputId}-hint`;
  private readonly errorId = `${this.inputId}-error`;
  private initialValue = '';

  @AttachInternals() internals!: ElementInternals;
  @State() formDisabled = false;
  @Element() private host!: HTMLElement;

  /** Visible label, associated with the input via `for`/`id`. */
  @Prop() label?: string;

  /**
   * Canonical value: digits only for `clp`, a plain decimal string for `plain`.
   * Never formatted — formatting lives in the rendered text.
   */
  @Prop({ mutable: true }) value = '';

  /** How the number is displayed while typing. */
  @Prop() format: ChNumberInputFormat = 'plain';

  /** Placeholder shown when the field is empty. */
  @Prop() placeholder?: string;

  /** Name submitted with the form. */
  @Prop({ reflect: true }) name?: string;

  /** Whether the field is disabled. */
  @Prop({ reflect: true }) disabled = false;

  /** Whether a value is required; an empty field is then invalid. */
  @Prop({ reflect: true }) required = false;

  /** Minimum accepted value. */
  @Prop() min?: number;

  /** Maximum accepted value. */
  @Prop() max?: number;

  /** Stepping increment. `'any'` disables stepping validation. */
  @Prop() step: ChNumberInputStep = 'any';

  /** Helper text, replaced by `errorMessage` when invalid. */
  @Prop() hint?: string;

  /** Custom error message; wins over the built-in range messages. */
  @Prop() errorMessage?: string;

  /** Whether the field is marked invalid by the consumer. */
  @Prop() invalid = false;

  /** Emitted on every keystroke with the canonical value. */
  @Event() chInput: EventEmitter<string>;

  /** Emitted on commit (native `change`) with the canonical value. */
  @Event() chChange: EventEmitter<string>;

  /**
   * The text in the input, which may be a partial number like `-` or `1.`.
   * This is the only thing rendered, so it is also what a reset must restore.
   */
  @State() private draft = '';

  /**
   * Whether the user has typed since the last commit. While false the input
   * renders `value` directly, which is what makes `formResetCallback` and a
   * consumer assigning `.value` repaint without extra bookkeeping.
   */
  @State() private typing = false;

  componentWillLoad() {
    this.draft = this.formatDisplay(this.value);
  }

  private get decimals(): boolean {
    return this.format !== 'clp';
  }

  /** Formats a canonical value for display. */
  private formatDisplay(value: string): string {
    if (value === '') {
      return '';
    }
    if (this.format === 'clp') {
      const digits = value.replace(/\D/gu, '');
      return digits === '' ? '' : Number(digits).toLocaleString('es-CL');
    }
    return value;
  }

  /**
   * Strips display formatting back to the canonical string: digits only for
   * CLP; a leading sign, digits and one decimal separator for `plain`.
   */
  private toCanonical(text: string): string {
    if (this.format === 'clp') {
      return text.replace(/\D/gu, '');
    }
    const normalised = text.replace(/\s/gu, '').replace(',', '.');
    const match = /^-?\d*(?:\.\d*)?/u.exec(normalised);
    return match ? match[0] : '';
  }

  /**
   * Whether the field holds a real number. A draft that is only a sign or a
   * separator (`-`, `.`) is still being typed and submits as empty.
   */
  private get isEmpty(): boolean {
    return !/^-?\d/u.test(this.toCanonical(this.draft));
  }

  /** What the form receives and `value` exposes. */
  private get canonical(): string {
    return this.isEmpty ? '' : this.toCanonical(this.draft);
  }

  private get numericValue(): number {
    return Number(this.canonical);
  }

  /** The message for a value outside `min`/`max`, if there is one. */
  private outOfRange(parsed: number): string | undefined {
    const { min, max } = this;
    if (min !== undefined && parsed < min) {
      return `Enter a value of at least ${min}.`;
    }
    if (max !== undefined && parsed > max) {
      return `Enter a value of at most ${max}.`;
    }
    return undefined;
  }

  private rangeError(): string | undefined {
    if (this.errorMessage || this.isEmpty || this.invalid) {
      return undefined;
    }
    const parsed = this.numericValue;
    return Number.isNaN(parsed) ? 'Enter a valid number.' : this.outOfRange(parsed);
  }

  @Watch('required')
  @Watch('invalid')
  @Watch('errorMessage')
  @Watch('min')
  @Watch('max')
  protected syncForm(): void {
    const { internals, required, invalid, errorMessage, canonical } = this;
    if (typeof internals?.setFormValue !== 'function') {
      return;
    }
    internals.setFormValue(canonical);

    const base = resolveValidity({ required, empty: canonical === '', invalid, errorMessage });
    const rangeMessage = this.rangeError();
    if (rangeMessage) {
      internals.setValidity({ ...base.flags, badInput: true }, rangeMessage);
      return;
    }
    internals.setValidity(base.flags, base.message);
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
    this.draft = this.formatDisplay(this.initialValue);
    this.typing = false;
    this.syncForm();
    // The vdom does not push a re-rendered `value` onto a live `<input>`: the
    // property is set by the browser's own typing and the diff sees no change.
    // A reset restores the text directly.
    const input = this.host.shadowRoot?.querySelector('input');
    if (input) {
      input.value = this.formatDisplay(this.initialValue);
    }
  }

  formDisabledCallback(isDisabled: boolean): void {
    this.formDisabled = isDisabled;
  }

  private commit(text: string): void {
    this.typing = true;
    this.draft = text;
    this.value = this.canonical;
    this.chInput.emit(this.value);
    this.syncForm();
  }

  private handleInput = (ev: InputEvent) => {
    this.commit((ev.target as HTMLInputElement).value);
  };

  private handleChange = (ev: Event) => {
    this.commit((ev.target as HTMLInputElement).value);
    this.chChange.emit(this.value);
  };

  /** Reformats grouped CLP digits once the field loses focus. */
  private handleBlur = () => {
    if (this.format === 'clp') {
      this.draft = this.formatDisplay(this.canonical);
    }
  };

  private get isInvalid(): boolean {
    return this.invalid || this.rangeError() !== undefined;
  }

  private get describedBy(): string | undefined {
    if (this.isInvalid && this.errorMessage) {
      return this.errorId;
    }
    if (this.hint) {
      return this.hintId;
    }
    return undefined;
  }

  render() {
    const showError = this.isInvalid && this.errorMessage;
    return (
      <Host>
        {this.label && (
          <label class="label" htmlFor={this.inputId}>
            {this.label}
          </label>
        )}
        <input
          id={this.label ? this.inputId : undefined}
          class={{ 'input': true, 'input--invalid': this.isInvalid }}
          // `text` with `inputmode`, not `type="number"`: a number input drops
          // partial values and cannot show grouped digits.
          type="text"
          inputMode={this.decimals ? 'decimal' : 'numeric'}
          name={this.name}
          placeholder={this.placeholder}
          disabled={this.disabled || this.formDisabled}
          required={this.required}
          value={this.typing ? this.draft : this.formatDisplay(this.value)}
          aria-invalid={this.isInvalid ? 'true' : undefined}
          aria-describedby={this.describedBy}
          onInput={this.handleInput}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
        {this.hint && !showError && (
          <p class="hint" id={this.hintId}>
            {this.hint}
          </p>
        )}
        {showError && (
          <p class="error" id={this.errorId} role="alert">
            {this.errorMessage}
          </p>
        )}
      </Host>
    );
  }
}
