# ch-textarea



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                                                | Type      | Default     |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ----------- |
| `disabled`     | `disabled`      | Whether the textarea is disabled.                                                                                                          | `boolean` | `false`     |
| `errorMessage` | `error-message` | Error message rendered below the textarea when it is invalid.                                                                              | `string`  | `undefined` |
| `hint`         | `hint`          | Helper text rendered below the textarea, associated via `aria-describedby`. Replaced by `errorMessage` when the textarea is invalid.       | `string`  | `undefined` |
| `invalid`      | `invalid`       | Whether the textarea is in an invalid state; toggles `aria-invalid` and error styling.                                                     | `boolean` | `false`     |
| `label`        | `label`         | Visible label rendered above the textarea and associated with it via `for`/`id`, so assistive technology announces the textarea's purpose. | `string`  | `undefined` |
| `name`         | `name`          | The name of the textarea, submitted with form data.                                                                                        | `string`  | `undefined` |
| `placeholder`  | `placeholder`   | Placeholder text shown when the textarea is empty.                                                                                         | `string`  | `undefined` |
| `required`     | `required`      | Whether the textarea is required.                                                                                                          | `boolean` | `false`     |
| `rows`         | `rows`          | The number of visible rows of the textarea.                                                                                                | `number`  | `4`         |
| `value`        | `value`         | The value of the textarea.                                                                                                                 | `string`  | `''`        |


## Events

| Event      | Description                                                        | Type                  |
| ---------- | ------------------------------------------------------------------ | --------------------- |
| `chChange` | Emitted when the textarea value is committed (on native `change`). | `CustomEvent<string>` |
| `chInput`  | Emitted on every keystroke, with the current textarea value.       | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
