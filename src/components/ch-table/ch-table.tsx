import { Component, Element, Event, type EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';

export type ChTableSortDirection = 'ascending' | 'descending';

/** A column the table can sort by, in display order. */
export interface ChTableSortColumn {
  /** Identifies the column in `chSort` events. */
  key: string;
  /** Visible header text. */
  label: string;
  /** Whether the header offers sorting. Defaults to `true` when the table is sortable. */
  sortable?: boolean;
}

let tableIds = 0;

/**
 * Presentation-only data grid over a native `<table>`.
 *
 * The component renders the table skeleton and the header row; the consumer
 * slots the body as **native** `<tr>` elements. It does not hold the rows, sort
 * them, paginate them or fetch anything — it reports intent and the consumer
 * decides. Sorting is controlled: the table reflects the `sortKey` and
 * `sortDirection` it is given, so a consumer that ignores `chSort` leaves the
 * `aria-sort` that matches its own data.
 *
 * ```html
 * <ch-table sortable sort-key="name" sort-direction="ascending">
 *   <tr><td>Aurora SpA</td><td>En despacho</td></tr>
 *   <tr><td>Bosque Ltda</td><td>Pendiente</td></tr>
 * </ch-table>
 * ```
 *
 * ```js
 * table.columns = [
 *   { key: 'name', label: 'Cliente' },
 *   { key: 'status', label: 'Estado' },
 * ];
 * ```
 *
 * Columns come from the `columns` prop, like `ch-select`'s `options` — there is
 * no `ch-table-column` element, and an unknown element inside a component is
 * never rendered.
 *
 * Rows must be real `<tr>` elements created as DOM nodes, not written as
 * HTML inside the tag: the parser rejects a `<tr>` outside a `<table>`, so
 * `<ch-table><tr>…</tr></ch-table>` in an HTML string parses to a text node
 * and the table correctly reports itself empty. Framework templates and
 * `createElement` are unaffected.
 *
 * The shape is the one approved on #77: `table`/`thead`/`tbody` live in the
 * shadow DOM and the consumer slots native rows. Custom row and cell elements
 * are not possible — the HTML parser foster-parents them out of a native
 * table, which the spike in `tests/browser/semantic-shapes.browser.spec.ts`
 * measured in real Chromium.
 */
@Component({
  tag: 'ch-table',
  styleUrl: 'ch-table.css',
  shadow: true,
})
export class ChTable {
  private readonly captionId = `ch-table-${++tableIds}-caption`;
  private readonly emptyId = `${this.captionId}-empty`;

  @Element() private host!: HTMLElement;

  /** Columns, in display order. Rendered as the header row. */
  @Prop() columns: ChTableSortColumn[] = [];

  /** Whether the header offers sorting. Individual columns can opt out. */
  @Prop({ reflect: true }) sortable = false;

  /** Key of the column currently used for sorting. Controlled by the consumer. */
  @Prop() sortKey?: string;

  /** Direction of the current sort. Defaults to `ascending`. */
  @Prop() sortDirection: ChTableSortDirection = 'ascending';

  /**
   * Accessible name for the table. Always rendered as a caption, visually
   * hidden, because a data table without a name is announced as a bare grid.
   */
  @Prop() label!: string;

  /**
   * Shown in place of the rows when the body is empty. `filtered` distinguishes
   * "nothing matched your filters" from "there is nothing yet", which are
   * different messages and different next actions.
   */
  @State() empty: 'unmeasured' | 'none' | 'true' = 'unmeasured';

  /**
   * Marks the body as empty *because of filtering* rather than because there is
   * no data at all. Both look like zero rows, and they need different messages
   * and different next actions.
   */
  @Prop({ reflect: true }) filtered = false;

  /** Emitted when a sortable header is activated. The consumer applies the sort. */
  @Event() chSort: EventEmitter<{ key: string; direction: ChTableSortDirection }>;

  @Watch('filtered')
  protected onFiltered(): void {
    this.measure();
  }

  @Watch('sortKey')
  @Watch('sortDirection')
  @Watch('sortable')
  protected rerenderHeaders(): void {
    // Header attributes are derived from controlled props, so a prop change
    // has to repaint them; `columns` and the slot repaint on their own.
    this.rerender = !this.rerender;
  }

  @State() private rerender = false;

  private observer?: MutationObserver;

  componentDidLoad() {
    this.measure();
    // `slotchange` does not fire for native `<tr>` children, and it only fires
    // at all once the element is upgraded, so a row added later would leave the
    // table stuck on its first measurement. Observing the host covers both
    // orders plus a consumer that swaps rows on refresh. `MutationObserver` is
    // absent in the mock-doc test environment, where the slot behaviour is
    // exercised through an explicit `slotchange` instead.
    if (typeof MutationObserver === 'function') {
      this.observer = new MutationObserver(this.measure);
      this.observer.observe(this.host, { childList: true });
    }
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    this.observer = undefined;
  }

  private measure = (): void => {
    const rows = Array.from(this.host.children).filter(child => child.tagName === 'TR');
    this.empty = rows.length === 0 ? 'true' : 'none';
  };

  /**
   * A filtered-empty body and a truly empty one both have zero rows; only the
   * consumer knows which, since `filtered` is a prop it controls.
   */
  private get emptyState(): 'none' | 'true' | 'filtered' | 'unmeasured' {
    if (this.filtered) {
      return 'filtered';
    }
    return this.empty;
  }

  /** Direction glyph. Not colour: the arrow is the cue in greyscale. */
  private sortCue(active: boolean): string {
    if (!active) {
      return '⇅';
    }
    return this.sortDirection === 'ascending' ? '▲' : '▼';
  }

  private emptyMessage(state: 'none' | 'true' | 'filtered' | 'unmeasured'): string {
    return state === 'filtered' ? 'No results for these filters.' : 'Nothing here yet.';
  }

  private nextDirection(key: string): ChTableSortDirection {
    if (this.sortKey !== key) {
      return 'ascending';
    }
    return this.sortDirection === 'ascending' ? 'descending' : 'ascending';
  }

  private handleSort = (key: string) => {
    this.chSort.emit({ key, direction: this.nextDirection(key) });
  };

  private handleHeaderKeydown = (ev: KeyboardEvent, key: string) => {
    if (ev.key !== 'Enter' && ev.key !== ' ') {
      return;
    }
    ev.preventDefault();
    this.handleSort(key);
  };

  private renderHeaderCell(column: ChTableSortColumn) {
    const sortable = this.sortable && column.sortable !== false;
    if (!sortable) {
      return (
        <th scope="col" class="cell cell--header">
          {column.label}
        </th>
      );
    }

    const active = this.sortKey === column.key;
    const direction = active ? this.sortDirection : 'none';
    return (
      <th scope="col" class="cell cell--header" aria-sort={direction}>
        <button type="button" class="sort" onClick={() => this.handleSort(column.key)} onKeyDown={ev => this.handleHeaderKeydown(ev, column.key)}>
          <span>{column.label}</span>
          <span class="sort__cue" aria-hidden="true">
            {this.sortCue(active)}
          </span>
        </button>
      </th>
    );
  }

  render() {
    const empty = this.emptyState;
    // Before the first measurement the table is rendered as non-empty, so a
    // consumer never sees the empty message flash over real rows.
    return (
      <Host class={{ 'table': true, 'table--empty': empty === 'true' || empty === 'filtered' }}>
        <div class="table__scroll" tabIndex={0} role="group" aria-labelledby={this.captionId}>
          <table>
            <caption id={this.captionId} class="caption">
              {this.label}
            </caption>
            <thead>
              <tr>{this.columns.map(column => this.renderHeaderCell(column))}</tr>
            </thead>
            <tbody>
              <slot></slot>
            </tbody>
          </table>
        </div>
        {(empty === 'true' || empty === 'filtered') && (
          <div class="table__empty" id={this.emptyId}>
            <slot name="empty">
              <p class="table__empty-message">{this.emptyMessage(empty)}</p>
            </slot>
          </div>
        )}
      </Host>
    );
  }
}
