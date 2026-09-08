# ch-modal



<!-- Auto Generated Below -->


## Overview

Modal dialog, built on the native `<dialog>` element and opened with
`showModal()`.

The browser therefore supplies the parts that are easy to get wrong: moving
focus into the dialog and returning it afterwards, marking the rest of the
document inert, `Escape` to close, the top layer, `::backdrop`, and the
implicit `dialog` role with `aria-modal="true"`. Notably it does not trap
focus, which is deliberate — the W3C APA group concluded a modal should let
keyboard users reach browser UI, so a hand-rolled trap would be less
correct, not more.

What the platform does not cover, and this component adds: locking the page
behind the dialog so it cannot scroll, and closing when the backdrop is
clicked. The latter is `closedby="any"` in the platform, which Safari does
not support yet, so it is implemented here for every browser alike rather
than only for some.

## Properties

| Property     | Attribute     | Description                                                                                                                                                                                                                                              | Type      | Default     |
| ------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `closeLabel` | `close-label` | Accessible label for the close button, set as `aria-label`. Setting it is what adds the button: its only content is a decorative glyph, so without a label it would have no accessible name.                                                             | `string`  | `undefined` |
| `label`      | `label`       | Accessible name for the dialog, set as `aria-label`. A slotted heading cannot be referenced with `aria-labelledby` across the shadow boundary, so the name comes through this prop — and a modal dialog needs one, so pass the same text as the heading. | `string`  | `undefined` |
| `open`       | `open`        | Whether the dialog is open. Kept in sync when the user closes it with `Escape`, the close button or a click outside.                                                                                                                                     | `boolean` | `false`     |


## Events

| Event     | Description                                             | Type                |
| --------- | ------------------------------------------------------- | ------------------- |
| `chClose` | Emitted after the dialog closes, however it was closed. | `CustomEvent<void>` |
| `chOpen`  | Emitted after the dialog opens.                         | `CustomEvent<void>` |


## Slots

| Slot        | Description      |
| ----------- | ---------------- |
|             | The default slot |
| `"heading"` |                  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
