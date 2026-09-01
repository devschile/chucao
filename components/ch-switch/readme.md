# ch-switch



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                                           | Type      | Default     |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `checked`      | `checked`       | Whether the switch is on.                                                                                                             | `boolean` | `false`     |
| `disabled`     | `disabled`      | Whether the switch is disabled.                                                                                                       | `boolean` | `false`     |
| `errorMessage` | `error-message` | Error message rendered below the switch when it is invalid.                                                                           | `string`  | `undefined` |
| `hint`         | `hint`          | Helper text rendered below the switch, associated via `aria-describedby`. Replaced by `errorMessage` when the switch is invalid.      | `string`  | `undefined` |
| `invalid`      | `invalid`       | Whether the switch is in an invalid state; toggles `aria-invalid` and error styling.                                                  | `boolean` | `false`     |
| `label`        | `label`         | Visible label rendered next to the switch, associated with it via `for`/`id`, so assistive technology announces the switch's purpose. | `string`  | `undefined` |
| `name`         | `name`          | The name of the switch, submitted with form data.                                                                                     | `string`  | `undefined` |
| `required`     | `required`      | Whether the switch is required.                                                                                                       | `boolean` | `false`     |
| `value`        | `value`         | The value of the switch, submitted with form data.                                                                                    | `string`  | `'on'`      |


## Events

| Event      | Description                                                    | Type                   |
| ---------- | -------------------------------------------------------------- | ---------------------- |
| `chChange` | Emitted when the switch is toggled, with the new on/off state. | `CustomEvent<boolean>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
