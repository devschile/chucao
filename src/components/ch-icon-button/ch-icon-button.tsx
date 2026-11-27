import { Component, Event, type EventEmitter, Host, Prop, h } from '@stencil/core';

import { chIcons, type ChIconName } from '../../utils/icons';

export type ChIconButtonSize = 'sm' | 'md' | 'lg';

/**
 * A button whose only content is an icon.
 *
 * The label is required rather than optional. An icon-only button without an
 * accessible name is unusable by voice, screen reader or automation, and there
 * is no adjacent text to fall back on — the same reasoning as `ch-modal`, and
 * the reason this component exists instead of letting consumers bolt an icon
 * slot onto `ch-button` and forget the name.
 */
@Component({
  tag: 'ch-icon-button',
  styleUrl: 'ch-icon-button.css',
  shadow: true,
})
export class ChIconButton {
  /** The glyph to draw. */
  @Prop() name!: ChIconName;

  /**
   * Accessible name, set as `aria-label`. Required: say what the button does
   * ("Eliminar producto"), not what the glyph is ("papelera").
   */
  @Prop() label!: string;

  /** Visual size. `md` matches the height of a default `ch-button`. */
  @Prop() size: ChIconButtonSize = 'md';

  /** Native button type, defaulting to `button` so it never submits a form by accident. */
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';

  @Prop() disabled = false;

  /**
   * Blocks pointer and keyboard activation and marks the button `aria-busy`
   * while keeping it focusable, so focus does not fall to `<body>` when an
   * action completes.
   */
  @Prop() loading = false;

  /** Emitted on click. A click while disabled or loading emits nothing. */
  @Event() chClick: EventEmitter<MouseEvent>;

  private handleClick = (event: MouseEvent) => {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.chClick.emit(event);
  };

  render() {
    const shapes = this.name ? chIcons[this.name] : undefined;

    return (
      <Host>
        <button
          class={`button button--${this.size}`}
          type={this.type}
          aria-label={this.label}
          aria-busy={this.loading ? 'true' : undefined}
          aria-disabled={this.disabled ? 'true' : undefined}
          onClick={this.handleClick}
        >
          <svg
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            {(shapes ?? []).map(shape => h(shape.tag, shape.attrs))}
          </svg>
        </button>
      </Host>
    );
  }
}
