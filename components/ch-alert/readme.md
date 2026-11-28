# ch-alert



<!-- Auto Generated Below -->


## Overview

Block-level status message.

`warning` carries `role="alert"` and is announced assertively; `default` and
`positive` use `role="status"`, since a confirmation is not urgent enough to
interrupt. Both announce reliably when the alert is added to the page in
response to something — an alert already present at load may not be read out,
which is how live regions work rather than something this component controls.

Every variant also carries an icon and a thicker leading edge, so the three
states stay distinguishable without colour vision. The icon is decorative:
the text next to it already says what happened, and announcing "check
circle" before it would only add noise.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                    | Type                                   | Default     |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `dismissLabel` | `dismiss-label` | Accessible label for the dismiss button, set as `aria-label`. Setting it is what adds the button: the button's only content is a decorative glyph, so without a label it would have no accessible name at all. | `string`                               | `undefined` |
| `statusCue`    | `status-cue`    | Whether to show the variant's icon. On by default so the status is not colour-only; turn it off when the surrounding copy already carries the cue and a second marker would be redundant.                      | `boolean`                              | `true`      |
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
