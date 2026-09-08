# ch-radio



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                                                  | Type              | Default     |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------- |
| `disabled`     | `disabled`      | Whether all radios in the group are disabled.                                                                                                | `boolean`         | `false`     |
| `errorMessage` | `error-message` | Error message rendered below the radio group when it is invalid.                                                                             | `string`          | `undefined` |
| `hint`         | `hint`          | Helper text rendered below the radio group, associated via `aria-describedby`. Replaced by `errorMessage` when the group is invalid.         | `string`          | `undefined` |
| `invalid`      | `invalid`       | Whether the radio group is in an invalid state; toggles `aria-invalid` and error styling.                                                    | `boolean`         | `false`     |
| `label`        | `label`         | Visible label describing the radio group, associated with it via `aria-labelledby`.                                                          | `string`          | `undefined` |
| `name`         | `name`          | The name shared by all radio inputs in the group. Defaults to an auto-generated group name so options are mutually exclusive out of the box. | `string`          | `undefined` |
| `options`      | --              | The list of options rendered as radio inputs.                                                                                                | `ChRadioOption[]` | `[]`        |
| `required`     | `required`      | Whether a value is required.                                                                                                                 | `boolean`         | `false`     |
| `value`        | `value`         | The value of the selected option.                                                                                                            | `string`          | `undefined` |


## Events

| Event      | Description                                                     | Type                  |
| ---------- | --------------------------------------------------------------- | --------------------- |
| `chChange` | Emitted when a new option is selected, with the selected value. | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
