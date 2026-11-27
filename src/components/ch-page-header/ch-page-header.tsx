import { Component, Host, Prop, h } from '@stencil/core';

export type ChPageHeaderHeadingLevel = 'h1' | 'h2' | 'h3';

/**
 * The heading block at the top of a page: title, optional eyebrow and
 * description, and a trailing actions area.
 *
 * The title is a `title` prop rather than a slot so the heading level always
 * matches the page. A slotted heading lets a consumer nest a second `h1`, and
 * "one top-level heading per page" then depends on every caller remembering it;
 * here the level is explicit and defaults to `h1`. The actions wrap rather than
 * push the page sideways at 390px, and the DOM order keeps the heading before
 * the actions so reading and focus order still start with the title.
 */
@Component({
  tag: 'ch-page-header',
  styleUrl: 'ch-page-header.css',
  shadow: true,
})
export class ChPageHeader {
  /**
   * The page title. Rendered as a real heading, so it also works as the
   * accessible name of the page region.
   */
  @Prop() title!: string;

  /**
   * Heading element to render. Use `h2` (or `h3`) when the page already has a
   * higher-level heading above this block, so the document outline stays valid.
   */
  @Prop() headingLevel: ChPageHeaderHeadingLevel = 'h1';

  /**
   * Optional small label above the title, as slotted content. Use it for a
   * section or entity kind ("Proyecto", "Factura #1042"), not for the title.
   */
  @Prop() eyebrow?: string;

  /**
   * Optional supporting line under the title.
   */
  @Prop() description?: string;

  /**
   * Puts the actions below the title instead of beside it. Use it when the
   * actions are too wide to sit on the same row even after wrapping.
   */
  @Prop() actionsStacked = false;

  render() {
    const Heading = this.headingLevel;

    return (
      <Host>
        <div class={{ 'header': true, 'header--stacked': this.actionsStacked }}>
          <div class="header-text">
            {this.eyebrow && <p class="header-eyebrow">{this.eyebrow}</p>}
            <Heading class="header-title">{this.title}</Heading>
            {this.description && <p class="header-description">{this.description}</p>}
          </div>
          <div class="header-actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </Host>
    );
  }
}
