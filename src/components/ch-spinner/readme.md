# ch-spinner



<!-- Auto Generated Below -->


## Overview

Loading indicator.

The spinner is drawn in `currentColor`, so it takes the surrounding text
colour and stays legible on any surface — inside a primary `ch-button` it
picks up the button's own text colour instead of the accent, which would be
invisible there. Set `color` on or above the element to change it.

## Properties

| Property | Attribute | Description                                                                                                                                                                                                                                                               | Type                   | Default     |
| -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------- |
| `label`  | `label`   | Accessible label announced while the spinner is visible, e.g. `Cargando resultados`. When omitted the spinner is treated as decorative and hidden from assistive technology — the right behaviour next to visible loading text, which would otherwise be announced twice. | `string`               | `undefined` |
| `size`   | `size`    | The size of the spinner. Either `sm`, `md`, or `lg`. Each size sets a font-size and the spinner is drawn in `em`, so it also scales with an inherited font-size.                                                                                                          | `"lg" \| "md" \| "sm"` | `'md'`      |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
