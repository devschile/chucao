# ch-skeleton

Decorative loading placeholder that reserves the space real content will take, so the page does not jump when the data arrives.

```html
<ch-skeleton count="3" height="0.9rem"></ch-skeleton>
<ch-skeleton shape="circle" width="2.5rem"></ch-skeleton>
```

`shape` is `line`, `circle` or `rect`; `count` repeats the placeholder for multi-line text; `animated` turns the shimmer off and it is disabled automatically under `prefers-reduced-motion`. The placeholders are `aria-hidden="true"`: mark the region that is loading with `aria-busy="true"` yourself.

Use a skeleton when you know the shape of the content that is coming (lists, cards, tables). Use `ch-spinner` for a short action whose result does not have a known layout.

<!-- Auto Generated Below -->


## Overview

Decorative loading placeholder that reserves the space real content will
take, so the page does not jump when the data arrives.

It stays out of the accessibility tree on purpose: a screen reader should
hear nothing about a placeholder. Mark the region that is actually loading
with `aria-busy="true"` yourself, and announce the result when it lands.

## Properties

| Property   | Attribute  | Description                                                                                                                          | Type                           | Default  |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ | -------- |
| `animated` | `animated` | Whether the shimmer runs. It is also disabled automatically for people who asked for reduced motion.                                 | `boolean`                      | `true`   |
| `count`    | `count`    | How many placeholders to render in a row, for multi-line text blocks. A value below 1 renders one.                                   | `number`                       | `1`      |
| `height`   | `height`   | Height of a placeholder, as a CSS length. Ignored by `circle`, which is square.                                                      | `string`                       | `'1rem'` |
| `shape`    | `shape`    | Shape of the placeholder: `line` for text, `circle` for avatars and icons, `rect` for images and cards.                              | `"circle" \| "line" \| "rect"` | `'line'` |
| `width`    | `width`    | Width of a placeholder. For `line` and `rect` it is a CSS length or a percentage; `circle` is square, so this sets its diameter too. | `string`                       | `'100%'` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
