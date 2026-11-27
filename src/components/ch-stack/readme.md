# ch-stack

Vertical flow: children stack top to bottom with a token-driven gap. A real host with `display: flex` (never `display: contents`), so classes and attributes on `<ch-stack>` keep working.

```html
<ch-stack gap="lg">
  <ch-badge>Primero</ch-badge>
  <ch-badge variant="positive">Segundo</ch-badge>
</ch-stack>
```

`gap` takes a step of the spacing scale (`none`, `2xs` … `6xl`); an unknown value falls back to `md`. `align` handles the cross axis and `justify` the main axis.

<!-- Auto Generated Below -->


## Overview

Vertical flow: children stack top to bottom with a token-driven gap.

It is a real host with `display: flex`, not `display: contents`, so a
consumer's own classes and attributes on `<ch-stack>` keep working.

## Properties

| Property  | Attribute | Description                                                                                                                        | Type                                                                                                   | Default     |
| --------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------- |
| `align`   | `align`   | Cross-axis alignment of the children.                                                                                              | `"center" \| "end" \| "start" \| "stretch"`                                                            | `'stretch'` |
| `gap`     | `gap`     | Space between children, as a step of the spacing scale (`2xs` … `6xl`), or `none` for no gap. An unknown value falls back to `md`. | `"2xl" \| "2xs" \| "3xl" \| "4xl" \| "5xl" \| "6xl" \| "lg" \| "md" \| "none" \| "sm" \| "xl" \| "xs"` | `'md'`      |
| `justify` | `justify` | Main-axis distribution of the children.                                                                                            | `"around" \| "between" \| "center" \| "end" \| "start"`                                                | `'start'`   |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
