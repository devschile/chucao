# ch-stat



<!-- Auto Generated Below -->


## Overview

One dashboard metric: a label, a value and an optional hint.

The value is a string the consumer has already formatted — the component
never parses numbers, so locale, currency and precision stay where the
data comes from. On a fetch error, pass the em dash and the unavailable
tone rather than a zero that would read as a real measurement:

```html
<ch-stat label="Ventas del mes" value="$1.250.000" tone="positive"></ch-stat>
<ch-stat label="Ticket promedio" value="—" tone="unavailable"></ch-stat>
```

A tone is never carried by colour alone: positive and negative values get
a visible sign cue, so the three states stay distinguishable in greyscale
and for colour-blind users. The `value` slot replaces the rendered value
for composed content (a link, a spinner), and the `footer` slot sits under
the hint for a comparison line or a sparkline.

## Properties

| Property             | Attribute | Description                                                                                                                                                                                                     | Type                                                     | Default     |
| -------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------- |
| `hint`               | `hint`    | Secondary line under the value — a comparison or a unit note.                                                                                                                                                   | `string`                                                 | `undefined` |
| `label` _(required)_ | `label`   | Short label naming the metric, rendered in small caps above the value.                                                                                                                                          | `string`                                                 | `undefined` |
| `tone`               | `tone`    | Visual tone of the value. `positive` and `negative` add a sign cue so the tone survives greyscale; `unavailable` dims the value for the "could not be measured" case. An unknown value falls back to `default`. | `"default" \| "negative" \| "positive" \| "unavailable"` | `'default'` |
| `value` _(required)_ | `value`   | The metric value, already formatted by the consumer. Shown verbatim.                                                                                                                                            | `string`                                                 | `undefined` |


## Slots

| Slot       | Description |
| ---------- | ----------- |
| `"footer"` |             |
| `"value"`  |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
