# ch-table



<!-- Auto Generated Below -->


## Overview

Presentation-only data grid over a native `<table>`.

The component renders the table skeleton and the header row; the consumer
slots the body as **native** `<tr>` elements. It does not hold the rows, sort
them, paginate them or fetch anything — it reports intent and the consumer
decides. Sorting is controlled: the table reflects the `sortKey` and
`sortDirection` it is given, so a consumer that ignores `chSort` leaves the
`aria-sort` that matches its own data.

```html
<ch-table sortable sort-key="name" sort-direction="ascending">
  <tr><td>Aurora SpA</td><td>En despacho</td></tr>
  <tr><td>Bosque Ltda</td><td>Pendiente</td></tr>
</ch-table>
```

```js
table.columns = [
  { key: 'name', label: 'Cliente' },
  { key: 'status', label: 'Estado' },
];
```

Columns come from the `columns` prop, like `ch-select`'s `options` — there is
no `ch-table-column` element, and an unknown element inside a component is
never rendered.

Rows must be real `<tr>` elements created as DOM nodes, not written as
HTML inside the tag: the parser rejects a `<tr>` outside a `<table>`, so
`<ch-table><tr>…</tr></ch-table>` in an HTML string parses to a text node
and the table correctly reports itself empty. Framework templates and
`createElement` are unaffected.

The shape is the one approved on #77: `table`/`thead`/`tbody` live in the
shadow DOM and the consumer slots native rows. Custom row and cell elements
are not possible — the HTML parser foster-parents them out of a native
table, which the spike in `tests/browser/semantic-shapes.browser.spec.ts`
measured in real Chromium.

## Properties

| Property             | Attribute        | Description                                                                                                                                                                        | Type                          | Default       |
| -------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------- |
| `columns`            | --               | Columns, in display order. Rendered as the header row.                                                                                                                             | `ChTableSortColumn[]`         | `[]`          |
| `filtered`           | `filtered`       | Marks the body as empty *because of filtering* rather than because there is no data at all. Both look like zero rows, and they need different messages and different next actions. | `boolean`                     | `false`       |
| `label` _(required)_ | `label`          | Accessible name for the table. Always rendered as a caption, visually hidden, because a data table without a name is announced as a bare grid.                                     | `string`                      | `undefined`   |
| `sortDirection`      | `sort-direction` | Direction of the current sort. Defaults to `ascending`.                                                                                                                            | `"ascending" \| "descending"` | `'ascending'` |
| `sortKey`            | `sort-key`       | Key of the column currently used for sorting. Controlled by the consumer.                                                                                                          | `string`                      | `undefined`   |
| `sortable`           | `sortable`       | Whether the header offers sorting. Individual columns can opt out.                                                                                                                 | `boolean`                     | `false`       |


## Events

| Event    | Description                                                                 | Type                                                             |
| -------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `chSort` | Emitted when a sortable header is activated. The consumer applies the sort. | `CustomEvent<{ key: string; direction: ChTableSortDirection; }>` |


## Slots

| Slot      | Description      |
| --------- | ---------------- |
|           | The default slot |
| `"empty"` |                  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
