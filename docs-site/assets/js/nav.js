/**
 * Sidebar behaviour for the docs-site: search, active-item tracking and the
 * mobile drawer.
 *
 * Hand-written — `scripts/generate-gallery.mjs` owns `app.js` and rewrites it
 * wholesale, so interaction code cannot live there without being deleted by the
 * next generator run.
 *
 * The sidebar list itself is server-rendered markup, so navigation works
 * without this file. Everything here is an enhancement: the search field and
 * the drawer toggle are created by this script rather than sitting dead in the
 * HTML, so a page without JavaScript never shows a control that does nothing.
 */

(() => {
  const sidebar = document.getElementById('side-nav');
  const list = document.getElementById('comp-index-list');
  const empty = document.getElementById('comp-index-empty');
  const nav = list && list.closest('nav');
  if (!sidebar || !list || !empty || !nav) {
    return;
  }

  const normalise = value =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const items = [...list.querySelectorAll('.side-item')].map(li => ({
    li,
    haystack: normalise(`${li.dataset.name ?? ''} ${li.dataset.desc ?? ''}`),
  }));

  /* ── Búsqueda ─────────────────────────────────────────────── */

  const label = document.createElement('label');
  label.className = 'side-search-label';
  label.htmlFor = 'comp-search';
  label.textContent = 'Buscar';

  const input = document.createElement('input');
  input.type = 'search';
  input.id = 'comp-search';
  input.className = 'side-search';
  input.placeholder = 'Nombre o descripción…';
  input.setAttribute('aria-controls', 'comp-index-list');
  input.setAttribute('aria-describedby', 'comp-search-status');

  const status = document.createElement('p');
  status.id = 'comp-search-status';
  status.className = 'ch-visually-hidden';
  status.setAttribute('aria-live', 'polite');

  nav.insertBefore(label, list);
  nav.insertBefore(input, list);
  nav.insertBefore(status, list);

  const emptyText = document.createElement('span');
  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'side-empty-reset';
  reset.textContent = 'Limpiar búsqueda';
  empty.append(emptyText, ' ', reset);

  function applyFilter(rawQuery) {
    const query = rawQuery.trim();
    const needle = normalise(query);
    let visible = 0;

    for (const item of items) {
      const match = needle === '' || item.haystack.includes(needle);
      // `hidden` removes the item from rendering, the accessibility tree and
      // the tab order in one step.
      item.li.hidden = !match;
      if (match) {
        visible += 1;
      }
    }

    if (needle === '') {
      empty.hidden = true;
      status.textContent = '';
      return;
    }

    status.textContent = `${visible} ${visible === 1 ? 'componente' : 'componentes'}`;
    emptyText.textContent = `Ningún componente coincide con «${query}».`;
    empty.hidden = visible !== 0;
  }

  // The URL is only written on commit, never while typing. Mixing the two
  // corrupts history: a `replaceState` for the current keystrokes overwrites the
  // entry `pushState` created for the previous query, so Back appears to do
  // nothing. Committing only means Back steps through the queries actually
  // searched for. `location.replace()` is never used — it is a real navigation
  // and would make Back skip the page entirely.
  function commitUrl(query) {
    const url = new URL(window.location.href);
    const currentQuery = url.searchParams.get('q') ?? '';
    if (currentQuery === query) {
      return;
    }
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.pushState({}, '', url);
  }

  const debounceMs = 180;
  const commitMs = 800;
  let filterTimer;
  let commitTimer;

  input.addEventListener('input', () => {
    window.clearTimeout(filterTimer);
    window.clearTimeout(commitTimer);
    filterTimer = window.setTimeout(() => applyFilter(input.value), debounceMs);
    commitTimer = window.setTimeout(() => commitUrl(input.value.trim()), commitMs);
  });

  input.addEventListener('blur', () => {
    window.clearTimeout(commitTimer);
    commitUrl(input.value.trim());
  });

  reset.addEventListener('click', () => {
    input.value = '';
    applyFilter('');
    commitUrl('');
    input.focus();
  });

  window.addEventListener('popstate', () => {
    const query = new URL(window.location.href).searchParams.get('q') ?? '';
    input.value = query;
    applyFilter(query);
  });

  const initialQuery = new URL(window.location.href).searchParams.get('q') ?? '';
  if (initialQuery) {
    input.value = initialQuery;
    applyFilter(initialQuery);
  }

  /* ── Ítem activo ──────────────────────────────────────────── */

  if ('IntersectionObserver' in window) {
    const targets = new Map();
    for (const link of document.querySelectorAll('.side-link[href^="#"]')) {
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (target) {
        targets.set(target, link);
      }
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          const link = targets.get(entry.target);
          if (!link) {
            continue;
          }
          for (const current of document.querySelectorAll('.side-link[aria-current]')) {
            current.removeAttribute('aria-current');
          }
          // `aria-current` is discoverable when a screen-reader user reaches
          // the sidebar. Announcing it on every scroll tick via a live region
          // would be noise.
          link.setAttribute('aria-current', 'location');
        }
      },
      { rootMargin: '-25% 0px -70% 0px' },
    );

    for (const target of targets.keys()) {
      observer.observe(target);
    }
  }

  /* ── Cajón en móvil ───────────────────────────────────────── */

  const narrow = window.matchMedia('(max-width: 59.99rem)');
  const inertTargets = [document.querySelector('header.hero'), document.getElementById('main-content'), document.querySelector('footer')];

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-toggle';
  toggle.textContent = 'Índice';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'side-nav');

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'nav-close';
  close.textContent = 'Cerrar';

  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  backdrop.hidden = true;

  sidebar.parentElement.insertBefore(toggle, sidebar);
  sidebar.insertBefore(close, sidebar.firstChild);
  document.body.append(backdrop);

  function setDrawer(open) {
    sidebar.classList.toggle('side-nav--open', open);
    toggle.setAttribute('aria-expanded', String(open));
    backdrop.hidden = !open;
    for (const element of inertTargets) {
      if (element) {
        // `inert` hides the background from assistive technology and removes
        // it from the tab order, so no hand-rolled focus trap is needed.
        element.inert = open;
      }
    }
    if (open) {
      close.focus();
    } else {
      toggle.focus();
    }
  }

  toggle.addEventListener('click', () => setDrawer(!sidebar.classList.contains('side-nav--open')));
  close.addEventListener('click', () => setDrawer(false));
  backdrop.addEventListener('click', () => setDrawer(false));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && sidebar.classList.contains('side-nav--open')) {
      setDrawer(false);
    }
  });

  for (const link of sidebar.querySelectorAll('.side-link')) {
    link.addEventListener('click', () => {
      if (narrow.matches && sidebar.classList.contains('side-nav--open')) {
        setDrawer(false);
      }
    });
  }

  /* ── Foco al seguir un ancla ──────────────────────────────── */

  window.addEventListener('hashchange', () => {
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (target) {
      // Native fragment focusing of a `tabindex="-1"` target is spec'd but
      // inconsistent across browsers; doing it explicitly makes it reliable.
      target.focus({ preventScroll: true });
    }
  });
})();
