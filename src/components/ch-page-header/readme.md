# ch-page-header



<!-- Auto Generated Below -->


## Overview

The heading block at the top of a page: title, optional eyebrow and
description, and a trailing actions area.

The title is a `title` prop rather than a slot so the heading level always
matches the page. A slotted heading lets a consumer nest a second `h1`, and
"one top-level heading per page" then depends on every caller remembering it;
here the level is explicit and defaults to `h1`. The actions wrap rather than
push the page sideways at 390px, and the DOM order keeps the heading before
the actions so reading and focus order still start with the title.

## Properties

| Property             | Attribute         | Description                                                                                                                                           | Type                   | Default     |
| -------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------- |
| `actionsStacked`     | `actions-stacked` | Puts the actions below the title instead of beside it. Use it when the actions are too wide to sit on the same row even after wrapping.               | `boolean`              | `false`     |
| `description`        | `description`     | Optional supporting line under the title.                                                                                                             | `string`               | `undefined` |
| `eyebrow`            | `eyebrow`         | Optional small label above the title, as slotted content. Use it for a section or entity kind ("Proyecto", "Factura #1042"), not for the title.       | `string`               | `undefined` |
| `headingLevel`       | `heading-level`   | Heading element to render. Use `h2` (or `h3`) when the page already has a higher-level heading above this block, so the document outline stays valid. | `"h1" \| "h2" \| "h3"` | `'h1'`      |
| `title` _(required)_ | `title`           | The page title. Rendered as a real heading, so it also works as the accessible name of the page region.                                               | `string`               | `undefined` |


## Slots

| Slot        | Description |
| ----------- | ----------- |
| `"actions"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
