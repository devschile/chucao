# ch-alert



<!-- Auto Generated Below -->


## Overview

Block-level status message.

`warning` carries `role="alert"` and is announced assertively; `default` and
`positive` use `role="status"`, since a confirmation is not urgent enough to
interrupt. Both announce reliably when the alert is added to the page in
response to something — an alert already present at load may not be read out,
which is how live regions work rather than something this component controls.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                    | Type                                   | Default     |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `dismissLabel` | `dismiss-label` | Accessible label for the dismiss button, set as `aria-label`. Setting it is what adds the button: the button's only content is a decorative glyph, so without a label it would have no accessible name at all. | `string`                               | `undefined` |
| `variant`      | `variant`       | The kind of message. `default` is neutral, `positive` confirms, and `warning` covers both warnings and errors — the token scale has a single status colour for the two of them.                                | `"default" \| "positive" \| "warning"` | `'default'` |


## Events

| Event       | Description                                                                                                                                                                                                                              | Type                |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `chDismiss` | Emitted when the dismiss button is clicked. The alert stays in the DOM — whether to remove it is the consumer's decision. If you do remove it, move focus somewhere sensible first: removing the focused button drops focus to `<body>`. | `CustomEvent<void>` |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
