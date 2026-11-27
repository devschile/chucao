# ch-grid

Responsive grid of equal cells, with no breakpoints of its own.

```html
<ch-grid columns="auto-fit" min-item-width="16rem" gap="md">
  <ch-card>Uno</ch-card>
  <ch-card>Dos</ch-card>
</ch-grid>
```

`columns` takes a fixed count (`1` … `12`) or `auto-fit`, which fits as many columns as `min-item-width` allows. The template carries a `min(<min-item-width>, 100%)` guard, so a cell never overflows the viewport when the minimum no longer fits. Any unknown `columns` value falls back to `auto-fit`, and any unknown `gap` to `md`.

<!-- Auto Generated Below -->


## Overview

Responsive grid of equal cells.

`columns` takes a fixed count (`1`…`12`) or `auto-fit`, which fits as many
columns as `min-item-width` allows into the available width. That second mode
is the one a card list almost always wants: it needs no breakpoints and no
media queries of its own.

## Properties

| Property       | Attribute        | Description                                                                                                                                             | Type                                                                                                   | Default      |
| -------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------ |
| `columns`      | `columns`        | Number of equal columns (`1`…`12`), or `auto-fit` to fit as many as `min-item-width` allows. An unknown value falls back to `auto-fit`.                 | `string`                                                                                               | `'auto-fit'` |
| `gap`          | `gap`            | Space between cells in both axes, as a step of the spacing scale (`2xs` … `6xl`), or `none`. An unknown value falls back to `md`.                       | `"2xl" \| "2xs" \| "3xl" \| "4xl" \| "5xl" \| "6xl" \| "lg" \| "md" \| "none" \| "sm" \| "xl" \| "xs"` | `'md'`       |
| `minItemWidth` | `min-item-width` | Smallest width a cell may take in `auto-fit` mode, as a CSS length. It also caps the column count in fixed mode, so a cell never gets narrower than it. | `string`                                                                                               | `'16rem'`    |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
