# ch-button

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                                                       | Type                       | Default     |
| ---------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------- |
| `disabled` | `disabled` | Whether the button is disabled.                                                                                                                                   | `boolean`                  | `false`     |
| `label`    | `label`    | Accessible label set as `aria-label` on the native `<button>`. Use it when the button's content doesn't convey its purpose on its own (e.g. an icon-only button). | `string`                   | `undefined` |
| `variant`  | `variant`  | The visual style of the button. Either `primary` or `secondary`.                                                                                                  | `"primary" \| "secondary"` | `'primary'` |


## Events

| Event     | Description                         | Type                      |
| --------- | ----------------------------------- | ------------------------- |
| `chClick` | Emitted when the button is clicked. | `CustomEvent<MouseEvent>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
