# ch-tabs



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                                                        | Type      | Default     |
| -------- | --------- | ---------------------------------------------------------------------------------- | --------- | ----------- |
| `label`  | `label`   | Accessible label for the tablist, set as `aria-label`.                             | `string`  | `undefined` |
| `tabs`   | --        | The list of tabs, each with a `label`, a `value`, and an optional `disabled` flag. | `ChTab[]` | `[]`        |
| `value`  | `value`   | The value of the active tab. Defaults to the first enabled tab.                    | `string`  | `undefined` |


## Events

| Event      | Description                                              | Type                  |
| ---------- | -------------------------------------------------------- | --------------------- |
| `chChange` | Emitted when the active tab changes, with the new value. | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
