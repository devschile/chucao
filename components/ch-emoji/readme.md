# ch-emoji



<!-- Auto Generated Below -->


## Overview

Inline emoji from the devsChile CDN.

Given a name (or alias from the emoji map), the component resolves the
asset URL and tries each possible file extension until one loads.
Size is controlled via the `size` prop.

## Properties

| Property            | Attribute | Description                                                     | Type                           | Default     |
| ------------------- | --------- | --------------------------------------------------------------- | ------------------------------ | ----------- |
| `alt`               | `alt`     | Accessible alt text for the image. Defaults to the `name` prop. | `string`                       | `undefined` |
| `name` _(required)_ | `name`    | The emoji name or alias, e.g. `"huemul-love"` or `"heart"`.     | `string`                       | `undefined` |
| `size`              | `size`    | Size of the emoji. Either `sm`, `md`, `lg`, or `xl`.            | `"lg" \| "md" \| "sm" \| "xl"` | `'md'`      |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
