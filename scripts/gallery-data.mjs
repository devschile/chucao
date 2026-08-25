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
    tag: 'ch-accordion',
    description:
      'Acordeón de apertura única; cada ítem es un botón accesible con panel <code>role="region"</code> (contenido por slot <code>panel-&lt;value&gt;</code>). Emite <code>chChange</code>.',
    demos: ['<ch-accordion id="demo-accordion"></ch-accordion>', '<div id="demo-accordion-log" class="event-log"></div>'],
    bindings: [{ id: 'demo-accordion', event: 'chChange', format: 'ev => `chChange: ${ev.detail}`' }],
    init: `const accordion = document.getElementById('demo-accordion');
  if (accordion) {
    accordion.items = [
      { title: '¿Qué es Chucao?', value: 'que-es' },
      { title: '¿Cómo instalo?', value: 'instalar' },
    ];
    const panelAccordion = document.createElement('div');
    panelAccordion.setAttribute('slot', 'panel-que-es');
    panelAccordion.innerHTML = 'Chucao es el sistema de diseño de devsChile.';
    accordion.appendChild(panelAccordion);
  }`,
  },
  {
    tag: 'ch-alert',
    description:
      'Mensaje de estado en bloque, con tres variantes. <code>warning</code> se anuncia con <code>role="alert"</code>; <code>default</code> y <code>positive</code> usan <code>role="status"</code>. Definir <code>dismiss-label</code> agrega un botón de cierre que emite <code>chDismiss</code>.',
    demos: [
      '<ch-alert>Los cambios se guardan solos mientras editas.</ch-alert>',
      '<ch-alert variant="positive">Componente publicado en el CDN.</ch-alert>',
      '<ch-alert variant="warning">No pudimos conectar con el servidor.</ch-alert>',
      '<ch-alert id="demo-alert" dismiss-label="Descartar aviso">Este aviso se puede cerrar.</ch-alert>',
      '<div id="demo-alert-log" class="event-log"></div>',
    ],
    bindings: [{ id: 'demo-alert', event: 'chDismiss', format: '() => `chDismiss`' }],
  },
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
    tag: 'ch-divider',
    description: 'Separador horizontal (por defecto) o vertical con <code>aria-orientation</code>.',
    demos: [
      '<ch-card>',
      '  <p>Bloque superior</p>',
      '  <ch-divider></ch-divider>',
      '  <p>Bloque inferior</p>',
      '  <div class="ch-flex ch-gap-sm" style="height: 3.5rem">',
      '    <span>Izquierda</span>',
      '    <ch-divider orientation="vertical"></ch-divider>',
      '    <span>Derecha</span>',
      '  </div>',
      '</ch-card>',
    ],
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
    tag: 'ch-link',
    description: 'Enlace accesible con variantes <code>default</code>/<code>muted</code> y estado <code>disabled</code>. Emite <code>chClick</code>.',
    demos: [
      '<ch-link id="demo-link" href="#componentes">Ir a componentes</ch-link>',
      '<ch-link href="https://github.com/devschile/chucao" target="_blank">GitHub ↗</ch-link>',
      '<ch-link variant="muted">Enlace atenuado</ch-link>',
      '<ch-link disabled>Deshabilitado</ch-link>',
      '<div id="demo-link-log" class="event-log"></div>',
    ],
    bindings: [{ id: 'demo-link', event: 'chClick', format: "() => 'chClick'" }],
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
    tag: 'ch-spinner',
    description:
      'Indicador de carga en tres tamaños; hereda el color del texto que lo rodea. Con <code>label</code> se anuncia como <code>role="status"</code>, sin él queda decorativo.',
    demos: [
      '<ch-spinner size="sm" label="Cargando"></ch-spinner>',
      '<ch-spinner label="Cargando"></ch-spinner>',
      '<ch-spinner size="lg" label="Cargando"></ch-spinner>',
      '<ch-spinner style="color: var(--accent)" label="Cargando"></ch-spinner>',
      '<ch-button variant="primary">Guardando <ch-spinner size="sm"></ch-spinner></ch-button>',
    ],
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
    tag: 'ch-tabs',
    description:
      'Pestañas accesibles (WAI-ARIA) con navegación por flechas; las opciones van por <code>tabs</code> y el panel activo recibe contenido por slot <code>panel-&lt;value&gt;</code>. Emite <code>chChange</code>.',
    demos: ['<ch-tabs id="demo-tabs" label="Secciones"></ch-tabs>', '<div id="demo-tabs-log" class="event-log"></div>'],
    bindings: [{ id: 'demo-tabs', event: 'chChange', format: 'ev => `chChange: ${ev.detail}`' }],
    init: `const tabsEl = document.getElementById('demo-tabs');
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
  }`,
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
