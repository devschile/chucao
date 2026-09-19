import { AttachInternals, Component, Element, Event, type EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';

export interface ChSegmentedControlOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export type ChSegmentedControlSize = 'sm' | 'md';

let segmentedIds = 0;

/**
 * Compact control for switching between a few mutually exclusive options
 * (all/in/out, movement type, and similar filters).
 *
 * Built on native radio inputs sharing a name inside a `role="radiogroup"`,
 * so arrow-key navigation, a single tab stop, `:focus-visible` and native form
 * participation come from the platform instead of hand-rolled key handling.
 * It is form-associated like the other controls: inside a `<form>` the selected
 * value is submitted under `name`, and `required` with an empty value is
 * invalid.
 *
 * It differs from `ch-radio` in presentation only — segments in a joined track
 * instead of a vertical list of radio marks — so it is meant for compact
 * filters, not for long option lists.
 */
@Component({
  tag: 'ch-segmented-control',
  styleUrl: 'ch-segmented-control.css',
  shadow: true,
  formAssociated: true,
})
export class ChSegmentedControl {
  private readonly groupId = `ch-segmented-${++segmentedIds}`;
  private readonly labelId = `${this.groupId}-label`;
  private initialValue: string | undefined;

  @AttachInternals() internals!: ElementInternals;
  @State() formDisabled = false;
  @Element() private host!: HTMLElement;

  /**
   * Visible label describing the group, associated with it via
   * `aria-labelledby`.
   */
  @Prop() label?: string;

  /**
   * The list of options rendered as segments.
   */
  @Prop() options: ChSegmentedControlOption[] = [];

  /**
   * The value of the selected option.
   */
  @Prop({ mutable: true }) value?: string;

  /**
   * The size of the segments. Either `sm` or `md`.
   */
  @Prop() size: ChSegmentedControlSize = 'md';

  /**
   * The name shared by all radio inputs in the group, also used to submit the
   * value. Defaults to an auto-generated group name so options are mutually
   * exclusive out of the box.
   */
  @Prop({ reflect: true }) name?: string;

  /**
   * Whether all segments are disabled.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * Whether a value is required.
   */
  @Prop({ reflect: true }) required = false;

  /**
   * Emitted when a new option is selected, with the selected value.
   */
  @Event() chChange: EventEmitter<string>;

  private handleChange = (ev: Event) => {
    this.value = (ev.target as HTMLInputElement).value;
    this.chChange.emit(this.value);
  };

  @Watch('value')
  @Watch('required')
  protected syncForm(): void {
    const internals = this.internals;
    if (typeof internals?.setFormValue !== 'function') {
      return;
    }
    internals.setFormValue(this.value ?? null);
    const flags: ValidityStateFlags = {};
    if (this.required && !this.value) {
      flags.valueMissing = true;
    }
    internals.setValidity(flags, flags.valueMissing ? 'Please fill out this field.' : undefined);
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

  render() {
    const groupName = this.name || `${this.groupId}-group`;
    return (
      <Host>
        {this.label && (
          <span class="group-label" id={this.labelId}>
            {this.label}
          </span>
        )}
        <div class={{ segmented: true, [`segmented--${this.size}`]: true }} role="radiogroup" aria-labelledby={this.label ? this.labelId : undefined}>
          {this.options.map(option => (
            <label class={{ 'control': true, 'control--disabled': this.disabled || this.formDisabled || option.disabled }}>
              <input
                class="input"
                type="radio"
                name={groupName}
                value={option.value}
                checked={option.value === this.value}
                disabled={this.disabled || this.formDisabled || option.disabled}
                onChange={this.handleChange}
              />
              <span class="label-text">{option.label}</span>
            </label>
          ))}
        </div>
      </Host>
    );
  }
}
