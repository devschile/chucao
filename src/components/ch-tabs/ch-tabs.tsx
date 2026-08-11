import { Component, Event, type EventEmitter, Host, Prop, h } from '@stencil/core';

export interface ChTab {
  label: string;
  value: string;
  disabled?: boolean;
}

const FIRST_TAB_INDEX = 0;
const LAST_TAB_INDEX = -1;
const NEXT_TAB_OFFSET = 1;
const PREVIOUS_TAB_OFFSET = -1;

let tabsIds = 0;

@Component({
  tag: 'ch-tabs',
  styleUrl: 'ch-tabs.css',
  shadow: true,
})
export class ChTabs {
  private readonly baseId = `ch-tabs-${++tabsIds}`;
  private tablistEl?: HTMLDivElement;

  /**
   * The list of tabs, each with a `label`, a `value`, and an optional `disabled` flag.
   */
  @Prop() tabs: ChTab[] = [];

  /**
   * The value of the active tab. Defaults to the first enabled tab.
   */
  @Prop({ mutable: true }) value?: string;

  /**
   * Accessible label for the tablist, set as `aria-label`.
   */
  @Prop() label?: string;

  /**
   * Emitted when the active tab changes, with the new value.
   */
  @Event() chChange: EventEmitter<string>;

  private tabId(value: string) {
    return `${this.baseId}-${value}`;
  }

  private panelId(value: string) {
    return `${this.baseId}-${value}-panel`;
  }

  private get activeValue(): string | undefined {
    if (this.value && this.tabs.some(tab => !tab.disabled && tab.value === this.value)) {
      return this.value;
    }
    return this.tabs.find(tab => !tab.disabled)?.value;
  }

  private select = (value: string) => {
    this.value = value;
    this.chChange.emit(this.value);
  };

  private focusTab(value: string) {
    this.tablistEl?.querySelectorAll<HTMLButtonElement>('[role="tab"]').forEach(button => {
      if (button.dataset.value === value) {
        button.focus();
      }
    });
  }

  private handleKeyDown = (ev: KeyboardEvent) => {
    const enabled = this.tabs.filter(tab => !tab.disabled);
    if (!enabled.length) {
      return;
    }
    const target = this.targetFor(ev.key, enabled);
    if (!target) {
      return;
    }
    ev.preventDefault();
    this.select(target);
    this.focusTab(target);
  };

  private targetFor(key: string, enabled: ChTab[]): string | undefined {
    const current = enabled.findIndex(tab => tab.value === this.activeValue);
    if (key === 'ArrowRight') {
      return enabled[(current + NEXT_TAB_OFFSET) % enabled.length]?.value;
    }
    if (key === 'ArrowLeft') {
      return enabled[(current + PREVIOUS_TAB_OFFSET + enabled.length) % enabled.length]?.value;
    }
    if (key === 'Home') {
      return enabled[FIRST_TAB_INDEX]?.value;
    }
    if (key === 'End') {
      return enabled[enabled.length + LAST_TAB_INDEX]?.value;
    }
    return undefined;
  }

  render() {
    const active = this.activeValue;
    return (
      <Host>
        <div class="tablist" role="tablist" aria-label={this.label} onKeyDown={this.handleKeyDown} ref={el => (this.tablistEl = el)}>
          {this.tabs.map(tab => {
            const selected = tab.value === active;
            return (
              <button
                key={tab.value}
                type="button"
                class={{ 'tab': true, 'tab--active': selected, 'tab--disabled': Boolean(tab.disabled) }}
                role="tab"
                id={this.tabId(tab.value)}
                data-value={tab.value}
                aria-selected={selected ? 'true' : 'false'}
                aria-controls={this.panelId(tab.value)}
                tabIndex={selected ? FIRST_TAB_INDEX : LAST_TAB_INDEX}
                disabled={tab.disabled}
                onClick={() => this.select(tab.value)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        {this.tabs.map(tab => (
          <div
            key={`${tab.value}-panel`}
            class="tabpanel"
            id={this.panelId(tab.value)}
            role="tabpanel"
            aria-labelledby={this.tabId(tab.value)}
            tabIndex={FIRST_TAB_INDEX}
            hidden={tab.value !== active}
          >
            <slot name={`panel-${tab.value}`}></slot>
          </div>
        ))}
      </Host>
    );
  }
}
