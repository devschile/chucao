const TAG = ['ch-badge', 'ch-button', 'ch-card', 'ch-input', 'ch-select'];

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
  const select = document.getElementById('demo-select');
  if (select) {
    select.options = [
      { label: 'Chile', value: 'cl' },
      { label: 'Argentina', value: 'ar' },
      { label: 'Perú', value: 'pe' },
    ];
  }

  bind('demo-button', [{ name: 'chClick', format: () => 'chClick' }]);
  bind('demo-input', [
    { name: 'chInput', format: ev => `chInput: ${ev.detail}` },
    { name: 'chChange', format: ev => `chChange: ${ev.detail}` },
  ]);
  bind('demo-select', [{ name: 'chChange', format: ev => `chChange: ${ev.detail}` }]);
});
