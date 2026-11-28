# ch-badge

<!-- Auto Generated Below -->


## Overview

Small status label.

Variants are not colour-only: each one also changes the leading dot's shape
and adds a matching border, so a badge still says which state it is in when
printed in grayscale or seen with colour-vision deficiency. `default` uses a
filled dot, `positive` a ring, and `warning` a filled square.

## Properties

| Property    | Attribute    | Description                                                                                                                                                            | Type                                   | Default     |
| ----------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `statusCue` | `status-cue` | Whether to show the variant marker. On by default so the state does not depend on colour; turn it off for a badge that only repeats text already carrying the meaning. | `boolean`                              | `true`      |
| `variant`   | `variant`    | The visual style of the badge. Either `default`, `positive`, or `warning`.                                                                                             | `"default" \| "positive" \| "warning"` | `'default'` |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
