# ch-icon



<!-- Auto Generated Below -->


## Overview

A single Lucide glyph.

Decorative by default: the icon is hidden from assistive technology unless
you give it a `label`, because most icons sit next to text that already says
what they mean and a second announcement is noise. Set `label` only when the
icon carries meaning on its own; a control whose only content is an icon
should use `ch-icon-button`, which requires the name.

## Properties

| Property            | Attribute | Description                                                                                                                       | Type                                                                                                                                                                                                                                | Default     |
| ------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `label`             | `label`   | Accessible name. When set, the icon becomes `role="img"` and is announced; when omitted it is `aria-hidden`.                      | `string`                                                                                                                                                                                                                            | `undefined` |
| `name` _(required)_ | `name`    | Which glyph to draw. Unknown values render nothing rather than throwing, so a stale name in a data payload cannot break the page. | `"alert" \| "arrowRight" \| "check" \| "chevronDown" \| "chevronRight" \| "close" \| "copy" \| "delete" \| "download" \| "error" \| "externalLink" \| "info" \| "menu" \| "plus" \| "search" \| "spinner" \| "success" \| "upload"` | `undefined` |
| `size`              | `size`    | `sm` is 16px, `md` is 20px and `lg` is 24px — the sizes the scale's line heights were built around.                               | `"lg" \| "md" \| "sm"`                                                                                                                                                                                                              | `'md'`      |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
