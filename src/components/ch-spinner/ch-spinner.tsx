import { Component, Host, Prop, h } from '@stencil/core';

export type ChSpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Loading indicator.
 *
 * The spinner is drawn in `currentColor`, so it takes the surrounding text
 * colour and stays legible on any surface — inside a primary `ch-button` it
 * picks up the button's own text colour instead of the accent, which would be
 * invisible there. Set `color` on or above the element to change it.
 */
@Component({
  tag: 'ch-spinner',
  styleUrl: 'ch-spinner.css',
  shadow: true,
})
export class ChSpinner {
  /**
   * The size of the spinner. Either `sm`, `md`, or `lg`. Each size sets a
   * font-size and the spinner is drawn in `em`, so it also scales with an
   * inherited font-size.
   */
  @Prop() size: ChSpinnerSize = 'md';

  /**
   * Accessible label announced while the spinner is visible, e.g. `Cargando
   * resultados`. When omitted the spinner is treated as decorative and hidden
   * from assistive technology — the right behaviour next to visible loading
   * text, which would otherwise be announced twice.
   */
  @Prop() label?: string;

  render() {
    const labelled = Boolean(this.label);

    return (
      <Host>
        <span
          class={{ spinner: true, [`spinner--${this.size}`]: true }}
          role={labelled ? 'status' : undefined}
          aria-label={labelled ? this.label : undefined}
          aria-hidden={labelled ? undefined : 'true'}
        ></span>
      </Host>
    );
  }
}
