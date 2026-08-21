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

customElements.whenDefined('ch-accordion').then(() => {
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
});

customElements.whenDefined('ch-button').then(() => {
  bind('demo-button', [{ name: 'chClick', format: () => 'chClick' }]);
});

customElements.whenDefined('ch-checkbox').then(() => {
  bind('demo-checkbox', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
});

customElements.whenDefined('ch-input').then(() => {
  bind('demo-input', [{ name: 'chInput', format: ev => `chInput: ${ev.detail}` }]);
  bind('demo-input', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
});

customElements.whenDefined('ch-link').then(() => {
  bind('demo-link', [{ name: 'chClick', format: () => 'chClick' }]);
});

customElements.whenDefined('ch-radio').then(() => {
  const radio = document.getElementById('demo-radio');
  if (radio) {
    radio.options = [
      { label: 'Comunidad', value: 'community' },
      { label: 'Links', value: 'links' },
      { label: 'Eventos', value: 'events' },
    ];
  }
  bind('demo-radio', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
});

customElements.whenDefined('ch-select').then(() => {
  const select = document.getElementById('demo-select');
  if (select) {
    select.options = [
      { label: 'Chile', value: 'cl' },
      { label: 'Argentina', value: 'ar' },
      { label: 'Perú', value: 'pe' },
    ];
  }
  bind('demo-select', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
});

customElements.whenDefined('ch-switch').then(() => {
  bind('demo-switch', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
});

customElements.whenDefined('ch-tabs').then(() => {
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
});

customElements.whenDefined('ch-textarea').then(() => {
  bind('demo-textarea', [{ name: 'chInput', format: ev => `chInput: ${ev.detail}` }]);
  bind('demo-textarea', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
});
