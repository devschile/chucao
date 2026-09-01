# ch-select



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                                            | Type               | Default     |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------- |
| `disabled`     | `disabled`      | Whether the select is disabled.                                                                                                        | `boolean`          | `false`     |
| `errorMessage` | `error-message` | Error message rendered below the select when it is invalid.                                                                            | `string`           | `undefined` |
| `hint`         | `hint`          | Helper text rendered below the select, associated via `aria-describedby`. Replaced by `errorMessage` when the select is invalid.       | `string`           | `undefined` |
| `invalid`      | `invalid`       | Whether the select is in an invalid state; toggles `aria-invalid` and error styling.                                                   | `boolean`          | `false`     |
| `label`        | `label`         | Visible label rendered above the select and associated with it via `for`/`id`, so assistive technology announces the select's purpose. | `string`           | `undefined` |
| `name`         | `name`          | The name of the select, submitted with form data.                                                                                      | `string`           | `undefined` |
| `options`      | --              | The list of options rendered inside the select.                                                                                        | `ChSelectOption[]` | `[]`        |
| `placeholder`  | `placeholder`   | Placeholder shown as a disabled, hidden first option when no value is selected.                                                        | `string`           | `undefined` |
| `required`     | `required`      | Whether a value is required.                                                                                                           | `boolean`          | `false`     |
| `value`        | `value`         | The value of the selected option.                                                                                                      | `string`           | `undefined` |


## Events

| Event      | Description                                                   | Type                  |
| ---------- | ------------------------------------------------------------- | --------------------- |
| `chChange` | Emitted when the selected option changes, with the new value. | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
