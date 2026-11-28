# ch-cluster

Horizontal flow that wraps when it runs out of room, with a token-driven gap in both axes — the layout a toolbar, a tag list or a row of buttons needs.

```html
<ch-cluster gap="sm" justify="between">
  <ch-button size="sm">Guardar</ch-button>
  <ch-button size="sm" variant="ghost">Cancelar</ch-button>
</ch-cluster>
```

`gap` takes a step of the spacing scale (`none`, `2xs` … `6xl`); an unknown value falls back to `md`. `wrap` defaults to `true`; `align` accepts `start`, `center`, `end`, `baseline` and `stretch`.

<!-- Auto Generated Below -->


## Overview

Horizontal flow that wraps when it runs out of room, with a token-driven
gap in both axes — the layout a toolbar, a tag list or a button row needs.

## Properties

| Property  | Attribute | Description                                                                                                                          | Type                                                                                                   | Default    |
| --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ---------- |
| `align`   | `align`   | Cross-axis alignment of the children.                                                                                                | `"baseline" \| "center" \| "end" \| "start" \| "stretch"`                                              | `'center'` |
| `gap`     | `gap`     | Space between children in both axes, as a step of the spacing scale (`2xs` … `6xl`), or `none`. An unknown value falls back to `md`. | `"2xl" \| "2xs" \| "3xl" \| "4xl" \| "5xl" \| "6xl" \| "lg" \| "md" \| "none" \| "sm" \| "xl" \| "xs"` | `'md'`     |
| `justify` | `justify` | Main-axis distribution of the children.                                                                                              | `"around" \| "between" \| "center" \| "end" \| "start"`                                                | `'start'`  |
| `wrap`    | `wrap`    | Whether the children wrap onto a new line when they run out of room.                                                                 | `boolean`                                                                                              | `true`     |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
