# ch-tooltip



<!-- Auto Generated Below -->


## Overview

Short help text shown on hover and on focus.

Both the trigger and the text come from the consumer's light DOM through
named slots. That is what makes the accessible association work: an
`aria-describedby` IDREF only resolves within a single tree, and slotted
nodes stay in the document tree even though they render inside the shadow
root. Keeping the text in the shadow root instead would need a reference
pointing into a shadow tree, which the platform does not allow — element
reflection only points outwards, and `referenceTarget` is not available yet.

The trigger has to be a natively focusable element (`<button>`, `<a>`,
`<input>`). A chucao component such as `ch-button` will not be described,
because `aria-*` set on a custom element host does not reach the native
element inside it — see the discussion in issue #47.

Positioning is measured, not purely CSS: `placement` is the preferred side,
and the bubble flips to the opposite side when the preferred one does not
fit, then shifts along the other axis to stay inside the viewport. It
re-measures on scroll, resize and visual-viewport changes, which is what
keeps it correct inside a scrolling modal or drawer and when a mobile
keyboard shrinks the visible area.

## Properties

| Property    | Attribute   | Description                                                                                                            | Type                                     | Default |
| ----------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------- |
| `placement` | `placement` | The side the bubble is placed on. It is a preference: when that side has no room the bubble flips to the opposite one. | `"bottom" \| "left" \| "right" \| "top"` | `'top'` |


## Slots

| Slot        | Description |
| ----------- | ----------- |
| `"content"` |             |
| `"trigger"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
