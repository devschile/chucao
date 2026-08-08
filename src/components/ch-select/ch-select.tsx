import { Component, Event, type EventEmitter, Host, Prop, h } from '@stencil/core';

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
})
export class ChSelect {
  private readonly selectId = `ch-select-${++selectIds}`;

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
  @Prop() name?: string;

  /**
   * Whether the select is disabled.
   */
  @Prop() disabled = false;

  /**
   * Whether a value is required.
   */
  @Prop() required = false;

  /**
   * Emitted when the selected option changes, with the new value.
   */
  @Event() chChange: EventEmitter<string>;

  private handleChange = (ev: Event) => {
    this.value = (ev.target as HTMLSelectElement).value;
    this.chChange.emit(this.value);
  };

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
          class="select"
          name={this.name}
          disabled={this.disabled}
          required={this.required}
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
      </Host>
    );
  }
}
