import { Component, Event, type EventEmitter, Host, Prop, h } from '@stencil/core';

export interface ChAccordionItem {
  title: string;
  value: string;
  disabled?: boolean;
}

let accordionIds = 0;

@Component({
  tag: 'ch-accordion',
  styleUrl: 'ch-accordion.css',
  shadow: true,
})
export class ChAccordion {
  private readonly baseId = `ch-accordion-${++accordionIds}`;

  /**
   * The list of items, each with a `title`, a `value`, and an optional `disabled` flag.
   */
  @Prop() items: ChAccordionItem[] = [];

  /**
   * The value of the currently open item. When unset, no item is open.
   */
  @Prop({ mutable: true }) value?: string;

  /**
   * Emitted when the open item changes, with the new value (`undefined` when all items are closed).
   */
  @Event() chChange: EventEmitter<string | undefined>;

  private headerId(value: string) {
    return `${this.baseId}-${value}-header`;
  }

  private panelId(value: string) {
    return `${this.baseId}-${value}-panel`;
  }

  private toggle = (value: string) => {
    this.value = this.value === value ? undefined : value;
    this.chChange.emit(this.value);
  };

  render() {
    return (
      <Host>
        {this.items.map(item => {
          const open = this.value === item.value;
          return (
            <div key={item.value} class={{ 'item': true, 'item--open': open }}>
              <h3 class="item-head">
                <button
                  type="button"
                  class="item-toggle"
                  id={this.headerId(item.value)}
                  data-value={item.value}
                  aria-expanded={open ? 'true' : 'false'}
                  aria-controls={this.panelId(item.value)}
                  disabled={item.disabled}
                  onClick={() => this.toggle(item.value)}
                >
                  {item.title}
                </button>
              </h3>
              <div class="item-panel" id={this.panelId(item.value)} role="region" aria-labelledby={this.headerId(item.value)} hidden={!open}>
                <slot name={`panel-${item.value}`}></slot>
              </div>
            </div>
          );
        })}
      </Host>
    );
  }
}
