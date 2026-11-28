# ch-timeline



<!-- Auto Generated Below -->


## Overview

Chronological history: a native ordered list with a marker dot per item
and a connector line between items — the last item never gets a trailing
connector.

The component renders the `<ol>` and owns the rail; the consumer writes
plain `<li>` items with whatever content each entry needs — a preformatted
date, a title, a description, and a non-colour state cue from `ch-icon`:

```html
<ch-timeline>
  <li>
    <ch-icon name="check"></ch-icon>
    <time datetime="2026-11-02">2 nov 2026</time> — Creado el pedido
  </li>
  <li><ch-icon name="spinner"></ch-icon> Esperando despacho</li>
</ch-timeline>
```

The list semantics survive untouched because the `li` elements stay native
in the light DOM — measured on #83: a wrapped item still counts as a
`listitem`, so nothing is gained by a `ch-timeline-item` element, and
native markup is the safe bet across browsers.

## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
