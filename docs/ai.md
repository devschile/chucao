# Using Chucao with AI agents

Chucao is a design system of Web Components published as
`@devschile/chucao`. This page documents how to consume it with AI agents
and code generators.

## Component allow-list

Chucao exposes exactly 17 components. Nothing else exists — do not invent
tags.

| Tag            | Purpose                                      |
| -------------- | -------------------------------------------- |
| `ch-accordion` | Collapsible content sections                 |
| `ch-alert`     | Status messages (default, positive, warning) |
| `ch-badge`     | Small status indicators                      |
| `ch-button`    | Interactive button                           |
| `ch-card`      | Content container                            |
| `ch-checkbox`  | Checkbox input                               |
| `ch-divider`   | Visual separator                             |
| `ch-input`     | Text input field                             |
| `ch-link`      | Hyperlink                                    |
| `ch-modal`     | Dialog overlay                               |
| `ch-radio`     | Radio button                                 |
| `ch-select`    | Dropdown select                              |
| `ch-spinner`   | Loading indicator                            |
| `ch-switch`    | Toggle switch                                |
| `ch-tabs`      | Tabbed interface                             |
| `ch-textarea`  | Multiline text input                         |
| `ch-tooltip`   | Contextual help text                         |

## Rules

### Tokens

Reference design tokens via CSS custom properties. Never hardcode values.

```css
/* DO */
color: var(--color-text-primary);
background: var(--color-surface-default);
padding: var(--spacing-medium);

/* DON'T */
color: #ffffff;
background: rgba(32, 30, 64, 0.6);
padding: 16px;
```

### Events

Custom events follow the pattern `ch` + camelCase, mirroring the native
event they wrap:

| Component     | Event         | Fires on              |
| ------------- | ------------- | --------------------- |
| `ch-button`   | `chClick`     | Click                 |
| `ch-input`    | `chInput`     | Input                 |
| `ch-input`    | `chChange`    | Value committed       |
| `ch-select`   | `chChange`    | Selection changed     |
| `ch-checkbox` | `chChange`    | Checked state changed |
| `ch-switch`   | `chChange`    | Toggled               |
| `ch-radio`    | `chChange`    | Selected              |
| `ch-tabs`     | `chTabChange` | Tab selected          |
| `ch-modal`    | `chClose`     | Close requested       |

### Accessibility

- `ch-modal` requires a `label` prop — a modal without one has no
  accessible name.
- `ch-button` with icon-only content requires a `label` prop.
- `ch-input` and `ch-select` require a `label` prop (renders an `id`/`for`
  pair).
- `ch-spinner` is decorative by default (`aria-hidden`). Pass `label` to
  make it announced.
- All interactive elements have a visible `:focus-visible` style.

### Shadow DOM

All components use `shadow: true`. Content is projected via `<slot>`, not
by nesting children directly.

## Installation

### CDN (recommended)

```html
<script type="module" src="https://static.devschile.cl/chucao/latest/chucao.esm.js"></script>
```

`latest/` always points to the newest release. To pin to a specific
version, use `https://static.devschile.cl/chucao/<version>/chucao.esm.js`.

### npm

```bash
npm install @devschile/chucao
```

```tsx
import '@devschile/chucao/dist/chucao/chucao.esm.js';
```

See [`using-the-library.md`](using-the-library.md) for standalone imports,
React, Vue, and Svelte integration.

## Prompt guide

### DO

- Use `ch-*` tags: `<ch-button>`, `<ch-card>`, `<ch-input>`, etc.
- Reference tokens via `var(--token-name)`.
- Pass `label` to `ch-modal`, `ch-button` (icon-only), `ch-input`,
  `ch-select`.
- Use `slot="trigger"` for `ch-tooltip` and `ch-modal` activators.
- Listen to `chClick`, `chChange`, `chInput` events.

### DON'T

- Invent tags: `<chucao-button>`, `<stencil-button>`, `<ch-icon>` do not
  exist.
- Hardcode colors or spacing values — use `var(--color-*)`,
  `var(--spacing-*)`.
- Omit `label` on interactive components — it silently creates an
  accessibility violation.
- Use `onclick` on `ch-button` — use `chClick` instead.
- Nest content directly in a component without a `<slot>`.

## AI surfaces (planned)

The following surfaces are planned but not yet available:

- **`llms.txt`** — machine-readable index of this documentation
  ([#56](https://github.com/devschile/chucao/issues/56)).
- **Agent skill** — installable via `npx skills add`
  ([#59](https://github.com/devschile/chucao/issues/59)).
- **MCP server** — read-only tool server for IDE integrations
  ([#60](https://github.com/devschile/chucao/issues/60)).
