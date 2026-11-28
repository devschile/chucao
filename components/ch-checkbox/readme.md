# ch-checkbox



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                                               | Type      | Default     |
| -------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `checked`      | `checked`       | Whether the checkbox is checked.                                                                                                          | `boolean` | `false`     |
| `disabled`     | `disabled`      | Whether the checkbox is disabled.                                                                                                         | `boolean` | `false`     |
| `errorMessage` | `error-message` | Error message rendered below the checkbox when it is invalid.                                                                             | `string`  | `undefined` |
| `hint`         | `hint`          | Helper text rendered below the checkbox, associated via `aria-describedby`. Replaced by `errorMessage` when the checkbox is invalid.      | `string`  | `undefined` |
| `invalid`      | `invalid`       | Whether the checkbox is in an invalid state; toggles `aria-invalid` and error styling.                                                    | `boolean` | `false`     |
| `label`        | `label`         | Visible label rendered next to the checkbox, associated with it via `for`/`id`, so assistive technology announces the checkbox's purpose. | `string`  | `undefined` |
| `name`         | `name`          | The name of the checkbox, submitted with form data.                                                                                       | `string`  | `undefined` |
| `required`     | `required`      | Whether the checkbox is required.                                                                                                         | `boolean` | `false`     |
| `value`        | `value`         | The value of the checkbox, submitted with form data.                                                                                      | `string`  | `'on'`      |


## Events

| Event      | Description                                                         | Type                   |
| ---------- | ------------------------------------------------------------------- | ---------------------- |
| `chChange` | Emitted when the checked state changes, with the new checked value. | `CustomEvent<boolean>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
