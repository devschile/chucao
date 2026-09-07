import { Component, Host, Prop, State, Watch, h } from '@stencil/core';

import emojiMap from './emoji-map.json';

export type ChEmojiSize = 'sm' | 'md' | 'lg' | 'xl';

const CDN_BASE = 'https://static.devschile.cl/emoji';
const EXTENSIONS = ['png', 'gif', 'jpg', 'svg'];

/**
 * Inline emoji from the devsChile CDN.
 *
 * Given a name (or alias from the emoji map), the component resolves the
 * asset URL and tries each possible file extension until one loads.
 * Size is controlled via the `size` prop.
 */
@Component({
  tag: 'ch-emoji',
  styleUrl: 'ch-emoji.css',
  shadow: true,
})
export class ChEmoji {
  @State() private extIndex = 0;
  @State() private loaded = false;

  /**
   * The emoji name or alias, e.g. `"huemul-love"` or `"heart"`.
   */
  @Prop() name!: string;

  /**
   * Accessible alt text for the image. Defaults to the `name` prop.
   */
  @Prop() alt?: string;

  /**
   * Size of the emoji. Either `sm`, `md`, `lg`, or `xl`.
   */
  @Prop() size: ChEmojiSize = 'md';

  componentWillLoad(): void {
    this.resolveAsset();
  }

  @Watch('name')
  handleNameChange(): void {
    this.resolveAsset();
  }

  private resolveAsset(): void {
    this.extIndex = 0;
    this.loaded = false;
  }

  private get assetName(): string {
    return (emojiMap as Record<string, string>)[this.name] ?? this.name;
  }

  private get currentSrc(): string {
    return `${CDN_BASE}/${this.assetName}.${EXTENSIONS[this.extIndex]}`;
  }

  private handleError = (): void => {
    if (this.extIndex < EXTENSIONS.length - 1) {
      this.extIndex++;
    }
  };

  private handleLoad = (): void => {
    this.loaded = true;
  };

  render() {
    return (
      <Host>
        <img
          class={{
            'emoji': true,
            [`emoji--${this.size}`]: true,
            'emoji--hidden': !this.loaded,
          }}
          src={this.currentSrc}
          alt={this.alt ?? this.name}
          onError={this.handleError}
          onLoad={this.handleLoad}
        />
      </Host>
    );
  }
}
