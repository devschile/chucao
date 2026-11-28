# ch-number-input



<!-- Auto Generated Below -->


## Overview

Numeric input that keeps what the user is typing separate from the value the
form submits.

The display is formatted (`1.234.567` for CLP) while `value` and `FormData`
carry a canonical machine-readable string: digits only for CLP, the plain
decimal for `plain`. Parsing on every keystroke cannot represent the
intermediate states people actually type — `-`, `1.`, `0,` — so those stay as
text and are validated at the end.

Empty is not zero. A cleared field submits `''` and reports `valueMissing`
when required; it never becomes `0`.

There is no separate currency component: `format="clp"` is the currency
boundary for Chilean pesos, the only case with a real consumer.

## Properties

| Property       | Attribute       | Description                                                                                                                          | Type               | Default     |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | ----------- |
| `disabled`     | `disabled`      | Whether the field is disabled.                                                                                                       | `boolean`          | `false`     |
| `errorMessage` | `error-message` | Custom error message; wins over the built-in range messages.                                                                         | `string`           | `undefined` |
| `format`       | `format`        | How the number is displayed while typing.                                                                                            | `"clp" \| "plain"` | `'plain'`   |
| `hint`         | `hint`          | Helper text, replaced by `errorMessage` when invalid.                                                                                | `string`           | `undefined` |
| `invalid`      | `invalid`       | Whether the field is marked invalid by the consumer.                                                                                 | `boolean`          | `false`     |
| `label`        | `label`         | Visible label, associated with the input via `for`/`id`.                                                                             | `string`           | `undefined` |
| `max`          | `max`           | Maximum accepted value.                                                                                                              | `number`           | `undefined` |
| `min`          | `min`           | Minimum accepted value.                                                                                                              | `number`           | `undefined` |
| `name`         | `name`          | Name submitted with the form.                                                                                                        | `string`           | `undefined` |
| `placeholder`  | `placeholder`   | Placeholder shown when the field is empty.                                                                                           | `string`           | `undefined` |
| `required`     | `required`      | Whether a value is required; an empty field is then invalid.                                                                         | `boolean`          | `false`     |
| `step`         | `step`          | Stepping increment. `'any'` disables stepping validation.                                                                            | `"any" \| number`  | `'any'`     |
| `value`        | `value`         | Canonical value: digits only for `clp`, a plain decimal string for `plain`. Never formatted — formatting lives in the rendered text. | `string`           | `''`        |


## Events

| Event      | Description                                                   | Type                  |
| ---------- | ------------------------------------------------------------- | --------------------- |
| `chChange` | Emitted on commit (native `change`) with the canonical value. | `CustomEvent<string>` |
| `chInput`  | Emitted on every keystroke with the canonical value.          | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
