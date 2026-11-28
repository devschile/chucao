# ch-icon-button



<!-- Auto Generated Below -->


## Overview

A button whose only content is an icon.

The label is required rather than optional. An icon-only button without an
accessible name is unusable by voice, screen reader or automation, and there
is no adjacent text to fall back on — the same reasoning as `ch-modal`, and
the reason this component exists instead of letting consumers bolt an icon
slot onto `ch-button` and forget the name.

## Properties

| Property             | Attribute  | Description                                                                                                                                                      | Type                                                                                                                                                                                                                                | Default     |
| -------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `disabled`           | `disabled` |                                                                                                                                                                  | `boolean`                                                                                                                                                                                                                           | `false`     |
| `label` _(required)_ | `label`    | Accessible name, set as `aria-label`. Required: say what the button does ("Eliminar producto"), not what the glyph is ("papelera").                              | `string`                                                                                                                                                                                                                            | `undefined` |
| `loading`            | `loading`  | Blocks pointer and keyboard activation and marks the button `aria-busy` while keeping it focusable, so focus does not fall to `<body>` when an action completes. | `boolean`                                                                                                                                                                                                                           | `false`     |
| `name` _(required)_  | `name`     | The glyph to draw.                                                                                                                                               | `"alert" \| "arrowRight" \| "check" \| "chevronDown" \| "chevronRight" \| "close" \| "copy" \| "delete" \| "download" \| "error" \| "externalLink" \| "info" \| "menu" \| "plus" \| "search" \| "spinner" \| "success" \| "upload"` | `undefined` |
| `size`               | `size`     | Visual size. `md` matches the height of a default `ch-button`.                                                                                                   | `"lg" \| "md" \| "sm"`                                                                                                                                                                                                              | `'md'`      |
| `type`               | `type`     | Native button type, defaulting to `button` so it never submits a form by accident.                                                                               | `"button" \| "reset" \| "submit"`                                                                                                                                                                                                   | `'button'`  |


## Events

| Event     | Description                                                        | Type                      |
| --------- | ------------------------------------------------------------------ | ------------------------- |
| `chClick` | Emitted on click. A click while disabled or loading emits nothing. | `CustomEvent<MouseEvent>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
