# ch-empty-state

The standard "there is nothing here" block: an optional icon, a title, a description and an action, laid out the same way everywhere.

```html
<ch-empty-state title="Sin resultados" description="Prueba con otra búsqueda">
  <span slot="icon">🐾</span>
  <ch-button size="sm">Limpiar filtros</ch-button>
</ch-empty-state>
```

`title` is required and renders as the block's heading. `size` is `md` (whole view) or `sm` (a region inside a page, such as a table cell). The icon is `aria-hidden`; the component never claims a fixed height, so it works inside a `<td colspan>` as well as as a full-page view.

<!-- Auto Generated Below -->


## Overview

The standard "there is nothing here" block: an optional visual, a title, a
description and an action, laid out the same way everywhere.

It works both inside a table cell and as a whole-page view: it fills its
container but never claims a fixed height.

## Properties

| Property             | Attribute     | Description                                                                                       | Type           | Default     |
| -------------------- | ------------- | ------------------------------------------------------------------------------------------------- | -------------- | ----------- |
| `description`        | `description` | One or two sentences explaining what the user can do about it.                                    | `string`       | `undefined` |
| `size`               | `size`        | Visual density. `sm` is for a region inside a page (a card, a table cell), `md` for a whole view. | `"md" \| "sm"` | `'md'`      |
| `title` _(required)_ | `title`       | Short heading stating what is missing, used as the accessible name of the block.                  | `string`       | `undefined` |


## Slots

| Slot     | Description      |
| -------- | ---------------- |
|          | The default slot |
| `"icon"` |                  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
