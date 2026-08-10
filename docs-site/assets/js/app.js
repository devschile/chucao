const TAG = ['ch-badge', 'ch-button', 'ch-card', 'ch-checkbox', 'ch-input', 'ch-radio', 'ch-select', 'ch-switch', 'ch-textarea'];

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
  bind('demo-button', [{ name: 'chClick', format: () => 'chClick' }]);
  bind('demo-checkbox', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
  bind('demo-input', [{ name: 'chInput', format: ev => `chInput: ${ev.detail}` }]);
  bind('demo-input', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
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
  bind('demo-textarea', [{ name: 'chInput', format: ev => `chInput: ${ev.detail}` }]);
  bind('demo-textarea', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
});
