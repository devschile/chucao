# ch-input



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                                                                                                          | Type      | Default     |
| ------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------- | ----------- |
| `disabled`    | `disabled`    | Whether the input is disabled.                                                                                                       | `boolean` | `false`     |
| `label`       | `label`       | Visible label rendered above the input and associated with it via `for`/`id`, so assistive technology announces the input's purpose. | `string`  | `undefined` |
| `name`        | `name`        | The name of the input, submitted with form data.                                                                                     | `string`  | `undefined` |
| `placeholder` | `placeholder` | Placeholder text shown when the input is empty.                                                                                      | `string`  | `undefined` |
| `required`    | `required`    | Whether the input is required.                                                                                                       | `boolean` | `false`     |
| `type`        | `type`        | The type of the input, mirroring the native `<input type>` attribute.                                                                | `string`  | `'text'`    |
| `value`       | `value`       | The value of the input.                                                                                                              | `string`  | `''`        |


## Events

| Event      | Description                                                     | Type                  |
| ---------- | --------------------------------------------------------------- | --------------------- |
| `chChange` | Emitted when the input value is committed (on native `change`). | `CustomEvent<string>` |
| `chInput`  | Emitted on every keystroke, with the current input value.       | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
