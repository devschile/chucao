import { Component, Event, type EventEmitter, Host, Prop, h } from '@stencil/core';

let inputIds = 0;

@Component({
  tag: 'ch-input',
  styleUrl: 'ch-input.css',
  shadow: true,
})
export class ChInput {
  private readonly inputId = `ch-input-${++inputIds}`;

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
  @Prop() name?: string;

  /**
   * Whether the input is disabled.
   */
  @Prop() disabled = false;

  /**
   * Whether the input is required.
   */
  @Prop() required = false;

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
          class="input"
          type={this.type}
          name={this.name}
          placeholder={this.placeholder}
          disabled={this.disabled}
          required={this.required}
          value={this.value}
          onInput={this.handleInput}
          onChange={this.handleChange}
        />
      </Host>
    );
  }
}
