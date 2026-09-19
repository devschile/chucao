# ch-drawer



<!-- Auto Generated Below -->


## Overview

Sliding side panel for navigation, editing forms and quick detail views.

Built on the native `<dialog>` element and opened with `showModal()`, exactly
like `ch-modal`, so the browser owns focus management, the inert background,
`Escape`, the top layer, `::backdrop`, and the implicit `dialog` role with
`aria-modal="true"`. The only differences are placement — anchored to one
edge instead of centred — and the longer content it is meant for, which is
why it exposes `header` and `footer` slots around a scrollable body.

Scroll locking is shared with `ch-modal` through `utils/scroll-lock`, so a
drawer and a modal opened together cannot unlock the page early.

## Properties

| Property     | Attribute     | Description                                                                                                                                                                                                                                              | Type                                    | Default     |
| ------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------- |
| `closeLabel` | `close-label` | Accessible label for the close button, set as `aria-label`. Setting it is what adds the button: its only content is a decorative glyph, so without a label it would have no accessible name.                                                             | `string`                                | `undefined` |
| `label`      | `label`       | Accessible name for the drawer, set as `aria-label`. A slotted heading cannot be referenced with `aria-labelledby` across the shadow boundary, so the name comes through this prop — and a modal dialog needs one, so pass the same text as the heading. | `string`                                | `undefined` |
| `open`       | `open`        | Whether the drawer is open. Kept in sync when the user closes it with `Escape`, the close button or a click outside.                                                                                                                                     | `boolean`                               | `false`     |
| `side`       | `side`        | The edge the panel slides in from. `start`/`end` follow the writing direction, so `start` is the left edge in LTR and the right edge in RTL.                                                                                                             | `"bottom" \| "end" \| "start" \| "top"` | `'end'`     |


## Events

| Event     | Description                                             | Type                |
| --------- | ------------------------------------------------------- | ------------------- |
| `chClose` | Emitted after the drawer closes, however it was closed. | `CustomEvent<void>` |
| `chOpen`  | Emitted after the drawer opens.                         | `CustomEvent<void>` |


## Slots

| Slot       | Description      |
| ---------- | ---------------- |
|            | The default slot |
| `"footer"` |                  |
| `"header"` |                  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
