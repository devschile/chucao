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
    tag: 'ch-checkbox',
    description:
      'Casilla de verificación con <code>label</code> asociada, estado <code>checked</code>, estados <code>hint</code>/<code>errorMessage</code> y evento <code>chChange</code>.',
    demos: [
      '<ch-checkbox label="Acepto los términos"></ch-checkbox>',
      '<ch-checkbox id="demo-checkbox" label="Recibir novedades" checked></ch-checkbox>',
      '<ch-checkbox label="Deshabilitado" disabled></ch-checkbox>',
      '<div id="demo-checkbox-log" class="event-log"></div>',
    ],
    bindings: [{ id: 'demo-checkbox', event: 'chChange', format: 'ev => `chChange: ${ev.detail}`' }],
  },
  {
    tag: 'ch-input',
    description:
      'Campo de texto con <code>label</code> asociado vía <code>id</code>/<code>for</code>. Emite <code>chInput</code> (cada tecla) y <code>chChange</code> (al confirmar).',
    demos: [
      '<ch-input id="demo-input" label="Correo" type="email" placeholder="tu@email.com"></ch-input>',
      '<ch-input label="Contraseña" type="password" placeholder="••••••••" hint="Mínimo 8 caracteres"></ch-input>',
      '<ch-input label="Usuario" invalid errorMessage="Este campo es obligatorio"></ch-input>',
      '<div id="demo-input-log" class="event-log"></div>',
    ],
    bindings: [
      { id: 'demo-input', event: 'chInput', format: 'ev => `chInput: ${ev.detail}`' },
      { id: 'demo-input', event: 'chChange', format: 'ev => `chChange: ${ev.detail}`' },
    ],
  },
  {
    tag: 'ch-radio',
    description: 'Grupo de selección única; las opciones se pasan por <code>options</code>. Emite <code>chChange</code> con el valor elegido.',
    demos: ['<ch-radio id="demo-radio" label="Elige un tema"></ch-radio>', '<div id="demo-radio-log" class="event-log"></div>'],
    bindings: [{ id: 'demo-radio', event: 'chChange', format: 'ev => `chChange: ${ev.detail}`' }],
    init: `const radio = document.getElementById('demo-radio');
  if (radio) {
    radio.options = [
      { label: 'Comunidad', value: 'community' },
      { label: 'Links', value: 'links' },
      { label: 'Eventos', value: 'events' },
    ];
  }`,
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
  {
    tag: 'ch-switch',
    description: 'Interruptor on/off accesible (<code>role="switch"</code>) con <code>label</code> asociada. Emite <code>chChange</code>.',
    demos: [
      '<ch-switch label="Modo oscuro" checked></ch-switch>',
      '<ch-switch id="demo-switch" label="Notificaciones"></ch-switch>',
      '<ch-switch label="Deshabilitado" disabled></ch-switch>',
      '<div id="demo-switch-log" class="event-log"></div>',
    ],
    bindings: [{ id: 'demo-switch', event: 'chChange', format: 'ev => `chChange: ${ev.detail}`' }],
  },
  {
    tag: 'ch-textarea',
    description: 'Área de texto con <code>label</code> asociada. Emite <code>chInput</code> (cada tecla) y <code>chChange</code> (al confirmar).',
    demos: ['<ch-textarea id="demo-textarea" label="Mensaje" placeholder="Escribe aquí..." rows="4"></ch-textarea>', '<div id="demo-textarea-log" class="event-log"></div>'],
    bindings: [
      { id: 'demo-textarea', event: 'chInput', format: 'ev => `chInput: ${ev.detail}`' },
      { id: 'demo-textarea', event: 'chChange', format: 'ev => `chChange: ${ev.detail}`' },
    ],
  },
];
