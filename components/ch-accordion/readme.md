# ch-accordion



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                                                         | Type                | Default     |
| -------- | --------- | ----------------------------------------------------------------------------------- | ------------------- | ----------- |
| `items`  | --        | The list of items, each with a `title`, a `value`, and an optional `disabled` flag. | `ChAccordionItem[]` | `[]`        |
| `value`  | `value`   | The value of the currently open item. When unset, no item is open.                  | `string`            | `undefined` |


## Events

| Event      | Description                                                                                     | Type                  |
| ---------- | ----------------------------------------------------------------------------------------------- | --------------------- |
| `chChange` | Emitted when the open item changes, with the new value (`undefined` when all items are closed). | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
