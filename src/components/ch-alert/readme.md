# ch-alert



<!-- Auto Generated Below -->


## Overview

Block-level status message.

`warning` is announced assertively via `role="alert"`; `info` and `positive`
use `role="status"`, since a confirmation is not urgent enough to interrupt.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                  | Type                                | Default     |
| -------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------- |
| `dismissLabel` | `dismiss-label` | Accessible label for the dismiss button, set as `aria-label`. Set it whenever `dismissible` is used: the button carries no text of its own.                                  | `string`                            | `undefined` |
| `dismissible`  | `dismissible`   | Whether to render a dismiss button that emits `chDismiss`.                                                                                                                   | `boolean`                           | `false`     |
| `variant`      | `variant`       | The kind of message. `info` is neutral, `positive` confirms, and `warning` covers both warnings and errors — the token scale has a single status colour for the two of them. | `"info" \| "positive" \| "warning"` | `'info'`    |


## Events

| Event       | Description                                                                                                               | Type                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `chDismiss` | Emitted when the dismiss button is clicked. The alert stays in the DOM — whether to remove it is the consumer's decision. | `CustomEvent<void>` |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
