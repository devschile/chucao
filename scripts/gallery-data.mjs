/**
 * Per-component demo definitions for the docs-site gallery.
 *
 * The gallery is generated from this file plus the auto-discovered component
 * tags under `src/components/*` (see `generate-gallery.mjs`). Add one entry per
 * component:
 *
 *   - `description`: short blurb shown under the component title.
 *   - `demos`: array of HTML strings rendered live in the `.comp-demo` block.
 *     Entries that are `.event-log` divs are rendered but excluded from the
 *     usage snippet.
 *   - `bindings`: optional event-log wiring, each `{ id, event, format }` where
 *     `format` is the arrow-function body applied to the event.
 *   - `init`: optional JS snippet run inside the `whenDefined` callback (e.g.
 *     to seed a `ch-select` `options` prop).
 */

export const gallery = [
  {
    tag: 'ch-badge',
    description: 'Etiqueta de estado compacta con tres variantes.',
    demos: ['<ch-badge>comunidad</ch-badge>', '<ch-badge variant="positive">Disponible</ch-badge>', '<ch-badge variant="warning">placeholder</ch-badge>'],
  },
  {
    tag: 'ch-button',
    description: 'Botón accesible, con variantes <code>primary</code>/<code>secondary</code> y estado <code>disabled</code>. Emite <code>chClick</code>.',
    demos: [
      '<ch-button id="demo-button">Primario</ch-button>',
      '<ch-button variant="secondary">Secundario</ch-button>',
      '<ch-button disabled>Deshabilitado</ch-button>',
      '<div id="demo-button-log" class="event-log"></div>',
    ],
    bindings: [{ id: 'demo-button', event: 'chClick', format: "() => 'chClick'" }],
  },
  {
    tag: 'ch-card',
    description: 'Contenedor de superficie con blur, borde y una línea de acento en hover.',
    demos: [
      '<ch-card>',
      '  <h4>🔗 Links de la semana</h4>',
      '  <p>Pasa el mouse — el borde y una línea de acento aparecen en hover.</p>',
      '  <ch-button variant="secondary">Ver más</ch-button>',
      '</ch-card>',
    ],
  },
  {
    tag: 'ch-input',
    description:
      'Campo de texto con <code>label</code> asociado vía <code>id</code>/<code>for</code>. Emite <code>chInput</code> (cada tecla) y <code>chChange</code> (al confirmar).',
    demos: ['<ch-input id="demo-input" label="Correo" type="email" placeholder="tu@email.com"></ch-input>', '<div id="demo-input-log" class="event-log"></div>'],
    bindings: [
      { id: 'demo-input', event: 'chInput', format: 'ev => `chInput: ${ev.detail}`' },
      { id: 'demo-input', event: 'chChange', format: 'ev => `chChange: ${ev.detail}`' },
    ],
  },
  {
    tag: 'ch-select',
    description: 'Select estilizado; las opciones se pasan por la prop <code>options</code>. Emite <code>chChange</code>.',
    demos: ['<ch-select id="demo-select" label="País" placeholder="Elige un país"></ch-select>', '<div id="demo-select-log" class="event-log"></div>'],
    bindings: [{ id: 'demo-select', event: 'chChange', format: 'ev => `chChange: ${ev.detail}`' }],
    init: `const select = document.getElementById('demo-select');
  if (select) {
    select.options = [
      { label: 'Chile', value: 'cl' },
      { label: 'Argentina', value: 'ar' },
      { label: 'Perú', value: 'pe' },
    ];
  }`,
  },
];
