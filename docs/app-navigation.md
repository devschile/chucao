# App navigation pattern

How to build the sidebar from issue #76 with the components that already ship.
There is no `ch-sidebar` on purpose: the repeated behavior across devsChile
projects is layout, not an API. A public sidebar would have to own routing,
active-state detection and breakpoint policy — all of which vary per app — and
that is the abstraction the roadmap said not to ship prematurely.

This page is the recommendation. If you need it as a component, comment on
[#76](https://github.com/devschile/chucao/issues/76) with the repeated
behavior that this pattern cannot express; that evidence is what reopens it.

## What the app owns

- **Routing**: the app decides what the current URL is. Chucao does not read
  the location and must keep working with hash, history or file-based routers.
- **Active state**: the app sets `aria-current="page"` on the current link.
  Do not style the active item by colour alone — pair it with a bar, weight
  change, or both, since `aria-current` carries the meaning for assistive tech
  while the visual cue has to survive colour-vision deficiency.
- **Authorization**: render only the items the user may reach. A hidden link is
  not a permission check; the route must still reject the request.

## Desktop: a landmark, not an aside

Use a native `<nav>` with a real list. Links stay links: they work without
JavaScript, they open in a new tab, and the browser's own affordances keep
working.

```html
<nav aria-label="Navegación principal" class="app-nav">
  <a class="app-nav__brand" href="/">Aurora</a>
  <ul role="list">
    <li><a href="/proyectos" aria-current="page">Proyectos</a></li>
    <li><a href="/facturas">Facturas</a></li>
    <li><a href="/cuenta">Cuenta</a></li>
  </ul>
</nav>
```

```css
.app-nav ul {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin: 0;
  padding: 0;
  list-style: none;
}

.app-nav a {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  text-decoration: none;
}

.app-nav a:hover {
  background: var(--surface-hover);
  color: var(--text);
}

/* Two cues, neither of them colour alone: a leading bar and weight. */
.app-nav a[aria-current='page'] {
  color: var(--text);
  font-weight: var(--typography-weight-semibold);
  background: var(--surface-hover);
  box-shadow: inset calc(-1 * var(--border-accent-bar)) 0 0 var(--accent);
}

.app-nav a:focus-visible {
  outline: var(--focus-outline-width) solid var(--accent);
  outline-offset: var(--focus-outline-offset);
}
```

Use `<ch-icon>` for the leading glyphs. Keep them decorative — the link text is
the accessible name — and give collapsed desktop items their text in an
`aria-label` instead of relying on a hover tooltip, which is unreachable by
keyboard-only and touch users.

## Mobile: compose `ch-drawer`

Below your breakpoint, the same markup goes inside `ch-drawer`. The drawer
already owns the parts that are easy to get wrong: Escape, focus return,
scroll lock shared with `ch-modal`, and a labelled close button.

```html
<ch-drawer side="start" label="Navegación" close-label="Cerrar navegación">
  <nav aria-label="Navegación principal"><!-- the same links --></nav>
</ch-drawer>
```

Have exactly one set of links in the DOM per breakpoint. Duplicating the
desktop nav and the drawer nav gives you two elements with the same `id`s and
makes "the active item" ambiguous; instead render one set and move it, or
render the drawer only when the viewport needs it.

After navigating in a single-page app, move focus to the destination's heading
(or to `<main>`), not back to the menu toggle, and close the drawer. Leaving
focus on the toggle means every navigation starts by announcing "Menú" again.

## Single-page apps

Intercepting clicks is fine, but keep the real `href` and let modified clicks
through so the link still behaves like a link:

```js
nav.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link || event.defaultPrevented) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

  event.preventDefault();
  router.push(link.href);
});
```

## Checklist

- One `<nav aria-label="…">` landmark per page; a second nav needs its own
  name, or use `aria-label` to distinguish them.
- The current item has `aria-current="page"` and a non-colour visual cue.
- Collapsed items keep their accessible names without a hover-only tooltip.
- The drawer closes on navigation and focus lands on the destination heading.
- Every link has a real `href` and works with JavaScript disabled.
- No duplicated link set per breakpoint.
