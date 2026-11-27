import { Component, Host, Prop, h } from '@stencil/core';

import { chIcons, type ChIconName } from '../../utils/icons';

export type ChIconSize = 'sm' | 'md' | 'lg';

/**
 * A single Lucide glyph.
 *
 * Decorative by default: the icon is hidden from assistive technology unless
 * you give it a `label`, because most icons sit next to text that already says
 * what they mean and a second announcement is noise. Set `label` only when the
 * icon carries meaning on its own; a control whose only content is an icon
 * should use `ch-icon-button`, which requires the name.
 */
@Component({
  tag: 'ch-icon',
  styleUrl: 'ch-icon.css',
  shadow: true,
})
export class ChIcon {
  /**
   * Which glyph to draw. Unknown values render nothing rather than throwing,
   * so a stale name in a data payload cannot break the page.
   */
  @Prop() name!: ChIconName;

  /**
   * `sm` is 16px, `md` is 20px and `lg` is 24px — the sizes the scale's line
   * heights were built around.
   */
  @Prop() size: ChIconSize = 'md';

  /**
   * Accessible name. When set, the icon becomes `role="img"` and is announced;
   * when omitted it is `aria-hidden`.
   */
  @Prop() label?: string;

  render() {
    const shapes = this.name ? chIcons[this.name] : undefined;
    const decorative = !this.label;

    return (
      <Host>
        <svg
          class={`icon icon--${this.size}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          role={decorative ? undefined : 'img'}
          aria-label={this.label}
          aria-hidden={decorative ? 'true' : undefined}
          focusable="false"
        >
          {(shapes ?? []).map(shape => h(shape.tag, shape.attrs))}
        </svg>
      </Host>
    );
  }
}
