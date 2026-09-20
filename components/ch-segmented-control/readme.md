# ch-segmented-control



<!-- Auto Generated Below -->


## Overview

Compact control for switching between a few mutually exclusive options
(all/in/out, movement type, and similar filters).

Built on native radio inputs sharing a name inside a `role="radiogroup"`,
so arrow-key navigation, a single tab stop, `:focus-visible` and native form
participation come from the platform instead of hand-rolled key handling.
It is form-associated like the other controls: inside a `<form>` the selected
value is submitted under `name`, and `required` with an empty value is
invalid.

It differs from `ch-radio` in presentation only — segments in a joined track
instead of a vertical list of radio marks — so it is meant for compact
filters, not for long option lists.

## Properties

| Property   | Attribute  | Description                                                                                                                                                                 | Type                         | Default     |
| ---------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------- |
| `disabled` | `disabled` | Whether all segments are disabled.                                                                                                                                          | `boolean`                    | `false`     |
| `label`    | `label`    | Visible label describing the group, associated with it via `aria-labelledby`.                                                                                               | `string`                     | `undefined` |
| `name`     | `name`     | The name shared by all radio inputs in the group, also used to submit the value. Defaults to an auto-generated group name so options are mutually exclusive out of the box. | `string`                     | `undefined` |
| `options`  | --         | The list of options rendered as segments.                                                                                                                                   | `ChSegmentedControlOption[]` | `[]`        |
| `required` | `required` | Whether a value is required.                                                                                                                                                | `boolean`                    | `false`     |
| `size`     | `size`     | The size of the segments. Either `sm` or `md`.                                                                                                                              | `"md" \| "sm"`               | `'md'`      |
| `value`    | `value`    | The value of the selected option.                                                                                                                                           | `string`                     | `undefined` |


## Events

| Event      | Description                                                     | Type                  |
| ---------- | --------------------------------------------------------------- | --------------------- |
| `chChange` | Emitted when a new option is selected, with the selected value. | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
