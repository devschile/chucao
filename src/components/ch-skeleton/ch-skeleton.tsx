import { Component, Host, Prop, h } from '@stencil/core';

export type ChSkeletonShape = 'line' | 'circle' | 'rect';

/**
 * Decorative loading placeholder that reserves the space real content will
 * take, so the page does not jump when the data arrives.
 *
 * It stays out of the accessibility tree on purpose: a screen reader should
 * hear nothing about a placeholder. Mark the region that is actually loading
 * with `aria-busy="true"` yourself, and announce the result when it lands.
 */
@Component({
  tag: 'ch-skeleton',
  styleUrl: 'ch-skeleton.css',
  shadow: true,
})
export class ChSkeleton {
  /**
   * Width of a placeholder. For `line` and `rect` it is a CSS length or a
   * percentage; `circle` is square, so this sets its diameter too.
   */
  @Prop() width = '100%';

  /**
   * Height of a placeholder, as a CSS length. Ignored by `circle`, which is
   * square.
   */
  @Prop() height = '1rem';

  /**
   * Shape of the placeholder: `line` for text, `circle` for avatars and
   * icons, `rect` for images and cards.
   */
  @Prop() shape: ChSkeletonShape = 'line';

  /**
   * How many placeholders to render in a row, for multi-line text blocks. A
   * value below 1 renders one.
   */
  @Prop() count = 1;

  /**
   * Whether the shimmer runs. It is also disabled automatically for people who
   * asked for reduced motion.
   */
  @Prop() animated = true;

  private get items() {
    const count = Number(this.count);
    return Number.isInteger(count) && count >= 1 ? count : 1;
  }

  private get sizeStyle(): Record<string, string> {
    if (this.shape === 'circle') {
      return { width: this.width, height: this.width };
    }
    if (this.shape === 'line') {
      return { width: this.width, height: this.height };
    }
    return { width: this.width, height: this.height };
  }

  render() {
    return (
      <Host aria-hidden="true" class={{ 'skeleton': true, [`skeleton--${this.shape}`]: true, 'skeleton--animated': this.animated }}>
        {Array.from({ length: this.items }).map((value, index) => (
          <span class="skeleton__item" style={this.sizeStyle} key={index} data-index={String(value)}></span>
        ))}
      </Host>
    );
  }
}
