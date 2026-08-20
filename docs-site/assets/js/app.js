const TAG = [
  'ch-accordion',
  'ch-badge',
  'ch-button',
  'ch-card',
  'ch-checkbox',
  'ch-divider',
  'ch-input',
  'ch-link',
  'ch-radio',
  'ch-select',
  'ch-spinner',
  'ch-switch',
  'ch-tabs',
  'ch-textarea',
];

function bind(id, events) {
  const el = document.getElementById(id);
  const out = document.getElementById(`${id}-log`);
  if (!el || !out) {
    return;
  }
  events.forEach(({ name, format }) => {
    el.addEventListener(name, ev => {
      out.textContent = format(ev);
    });
  });
}

Promise.all(TAG.map(tag => customElements.whenDefined(tag))).then(() => {
  const accordion = document.getElementById('demo-accordion');
  if (accordion) {
    accordion.items = [
      { title: '¿Qué es Chucao?', value: 'que-es' },
      { title: '¿Cómo instalo?', value: 'instalar' },
    ];
    const panelAccordion = document.createElement('div');
    panelAccordion.setAttribute('slot', 'panel-que-es');
    panelAccordion.innerHTML = 'Chucao es el sistema de diseño de devsChile.';
    accordion.appendChild(panelAccordion);
  }
  bind('demo-accordion', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
  bind('demo-button', [{ name: 'chClick', format: () => 'chClick' }]);
  bind('demo-checkbox', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
  bind('demo-input', [{ name: 'chInput', format: ev => `chInput: ${ev.detail}` }]);
  bind('demo-input', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
  bind('demo-link', [{ name: 'chClick', format: () => 'chClick' }]);
  const radio = document.getElementById('demo-radio');
  if (radio) {
    radio.options = [
      { label: 'Comunidad', value: 'community' },
      { label: 'Links', value: 'links' },
      { label: 'Eventos', value: 'events' },
    ];
  }
  bind('demo-radio', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
  const select = document.getElementById('demo-select');
  if (select) {
    select.options = [
      { label: 'Chile', value: 'cl' },
      { label: 'Argentina', value: 'ar' },
      { label: 'Perú', value: 'pe' },
    ];
  }
  bind('demo-select', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
  bind('demo-switch', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
  const tabsEl = document.getElementById('demo-tabs');
  if (tabsEl) {
    tabsEl.tabs = [
      { label: 'Comunidad', value: 'comunidad' },
      { label: 'Links', value: 'links' },
      { label: 'Eventos', value: 'eventos' },
    ];
    const panelTabs = document.createElement('div');
    panelTabs.setAttribute('slot', 'panel-comunidad');
    panelTabs.innerHTML = 'Contenido de la pestaña Comunidad.';
    tabsEl.appendChild(panelTabs);
  }
  bind('demo-tabs', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
  bind('demo-textarea', [{ name: 'chInput', format: ev => `chInput: ${ev.detail}` }]);
  bind('demo-textarea', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
});
