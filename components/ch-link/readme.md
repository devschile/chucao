# ch-link



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                 | Type                   | Default     |
| ---------- | ---------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------- |
| `disabled` | `disabled` | Whether the link is disabled. Renders a non-interactive element with `aria-disabled="true"` instead of an anchor.           | `boolean`              | `false`     |
| `href`     | `href`     | The URL the link points to.                                                                                                 | `string`               | `undefined` |
| `target`   | `target`   | The browsing context the link opens in (e.g. `_blank`). For `_blank`, a `noopener noreferrer` `rel` is added automatically. | `string`               | `undefined` |
| `variant`  | `variant`  | The visual style of the link. Either `default` or `muted`.                                                                  | `"default" \| "muted"` | `'default'` |


## Events

| Event     | Description                       | Type                      |
| --------- | --------------------------------- | ------------------------- |
| `chClick` | Emitted when the link is clicked. | `CustomEvent<MouseEvent>` |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"link"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
