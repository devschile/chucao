# Cómo contribuir a Chucao

Chucao es el kit de marca y sistema de diseño de devsChile. Se hizo por y para
la comunidad, así que los aportes son bienvenidos: desde corregir un typo en la
documentación hasta proponer un componente nuevo.

Esta guía cubre el proceso. Las convenciones técnicas están en
[`AGENTS.md`](AGENTS.md) y en [`docs/`](docs/) — acá no se duplican, se enlazan.

## Código de conducta

Participar en Chucao implica respetar el [Código de Conducta de
devsChile](https://github.com/devschile/.github/blob/main/CODE_OF_CONDUCT.md), que
es el [Contributor Covenant](https://www.contributor-covenant.org/es/version/2/1/code_of_conduct/)
2.1 y aplica a todos los repositorios de la organización, no solo a este.

Si algo se sale de esos límites, se reporta a **huemul@devschile.cl**. Los
reportes los ven los administradores de la organización, que están obligados a
respetar la privacidad de quien reporta.

## Dónde se conversa

- **Issues de GitHub** para todo lo que sea trabajo: propuestas, bugs, dudas
  concretas sobre el código. Los que llevan label `discussion` son ideas
  abiertas, todavía sin decisión.
- **Slack `#comunidad`** para lo informal, o cuando no sabes si algo amerita un
  issue.

GitHub Discussions no está habilitado en el repo, así que no hay que buscar ahí:
para una idea temprana, abre un issue y márcalo como `discussion`.

## Idioma

- **Issues, pull requests y discusiones: español.** Es una comunidad chilena, no
  hay necesidad de escribir en inglés.
- **Código, comentarios y mensajes de commit: inglés**, que es lo que el repo ya
  usa de forma consistente.
- La documentación sigue la regla de [`AGENTS.md`](AGENTS.md): español para
  contenido de marca y comunidad, inglés para contenido técnico.

## Antes de empezar

Si el cambio es más que una corrección menor, **abre un issue primero**. Sirve
para acordar el enfoque antes de que alguien invierta tiempo escribiendo código,
y para que quede registro de por qué se hizo.

**Los issues de GitHub son la única fuente de verdad del trabajo pendiente.** No
hay archivo de backlog ni lista de tareas paralela en el repo: si algo no tiene
issue, no está planificado todavía.

Los issues con label `discussion` son ideas que todavía necesitan una decisión.
No empieces a escribir código para esos — comenta en el issue.

Lecturas útiles según lo que vayas a tocar:

| Si vas a…                             | Lee                                                                         |
| ------------------------------------- | --------------------------------------------------------------------------- |
| Trabajar en un componente             | [`docs/components.md`](docs/components.md) y [`AGENTS.md`](AGENTS.md)       |
| Cambiar tokens o estilos              | [`DESIGN.md`](DESIGN.md) y la sección de tokens de [`AGENTS.md`](AGENTS.md) |
| Escribir o ajustar tests              | [`docs/testing.md`](docs/testing.md)                                        |
| Consumir la librería en otro proyecto | [`docs/using-the-library.md`](docs/using-the-library.md)                    |
| Buscar en qué ayudar                  | Los issues con `good first issue` o `help wanted`                           |

## Ambiente local

El repo usa **pnpm** (está fijado en `packageManager`) y **Node 24** (ver
`.nvmrc`).

```bash
pnpm install
pnpm start
```

Para ver la galería del sitio de documentación con **tu** build local, en vez de
la última versión publicada:

```bash
pnpm run docs:serve
```

Los comandos completos están en [`AGENTS.md`](AGENTS.md) y en
[`docs/components.md`](docs/components.md).

## Flujo de trabajo

1. Crea una rama desde `main`. La convención es `<tipo>/<descripción-corta>`,
   usando los mismos tipos que los commits: `feat/`, `fix/`, `chore/`, `ci/`.
   Por ejemplo: `feat/ch-tooltip`, `fix/switch-thumb-position`.
2. Haz tus cambios y deja el _gate_ en verde (ver más abajo).
3. Abre un pull request hacia `main`.
4. Espera la revisión de alguno de los mantenedores.

Un par de cosas que conviene saber:

- **`main` está protegido.** No se puede _pushear_ directo. Todo cambio entra por un
  PR con el check de CI en verde.
- **El merge es siempre squash.** Es el único método habilitado en el repo, así
  que el título del PR termina siendo el mensaje del commit en `main` — escríbelo
  siguiendo la convención de commits.
- **La rama `docs` se genera con el CI** (`.github/workflows/docs.yml`) para publicar el
  sitio en GitHub Pages. Nunca se edita a mano.
- **`docs/` no sirve como prefijo de rama.** Justamente porque ya existe una rama
  llamada `docs`, Git no deja crear otra que empiece con `docs/` — el push se
  rechaza con `directory file conflict`. Para cambios de documentación usa
  `chore/`.

## Mensajes de commit

El repo usa [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(button): add ghost variant
fix(switch): keep thumb inside the track when checked
docs(readme): link the contributing guide
chore(release): 1.6.0
```

Este formato es obligatorio ya que `release-it` calcula la próxima versión y genera el
`CHANGELOG.md` a partir de estos mensajes. Un commit fuera de convención ensucia
el changelog y podría afectar el número de versión.

Como el merge es squash, **lo que importa es el título del PR**.

### Cerrar issues desde el PR

Para que GitHub cierre el issue al mergear, la referencia va **en inglés**:

```
Closes #123
```

Aunque el resto del PR esté en español. GitHub solo reconoce `closes`, `fixes` y
`resolves`; «Cierra #123» no hace nada y el issue queda abierto aunque el
trabajo esté hecho. Si el PR avanza un issue sin terminarlo, `Refs #123`.

## Antes de crear el PR

Ejecuta estas tareas en tu local:

```bash
pnpm lint
pnpm run format:check
pnpm test
pnpm build
```

Si `format:check` encuentra algo raro, `pnpm run format` lo corrige.

## Archivos que no se editan a mano

Varios archivos del repo son generados. Editarlos a mano hará que el cambio
se pierda en la regeneración siguiente:

| Archivo                       | Lo genera                                 |
| ----------------------------- | ----------------------------------------- |
| `src/tokens/*`                | `toki`, a partir de `chucao-tokens.json`  |
| `src/components/**/readme.md` | el output target `docs-readme` de Stencil |
| `src/components.d.ts`         | Stencil                                   |
| `CHANGELOG.md`                | `release-it`                              |
| La galería de `docs-site/`    | `pnpm run generate:gallery`               |

Para cambiar tokens, edita [`chucao-tokens.json`](chucao-tokens.json) y corre
`pnpm run tokens`, que regenera, copia y formatea `src/tokens/` automáticamente
(ver [`AGENTS.md`](AGENTS.md)).

## Proponer un componente nuevo

Es el aporte más común en un sistema de diseño, así que vale la pena hacerlo en
orden:

1. **Abre un issue antes de escribir código.** Cuenta el caso de uso, en qué
   proyecto de la comunidad se necesita, y una API tentativa (props, eventos,
   variantes).
2. Una vez acordado el enfoque, el componente tiene que cumplir las convenciones
   que ya están documentadas en [`AGENTS.md`](AGENTS.md) y
   [`docs/components.md`](docs/components.md):
   - carpeta propia en `src/components/<nombre>/` con `<nombre>.tsx`,
     `<nombre>.css` y `<nombre>.plugin.spec.tsx`;
   - tag con prefijo `ch-` (por ejemplo `ch-tooltip`);
   - eventos con prefijo `ch` en camelCase (`chClick`, `chChange`);
   - `shadow: true`;
   - colores y medidas usando `var(--token)`, nunca valores _hardcodeados_;
   - accesibilidad: elementos nativos, `label` expuesto, `:focus-visible`
     visible;
   - entrada correspondiente en `scripts/gallery-data.mjs` (el generador de la
     galería falla si falta).

La forma más rápida de partir es copiar la estructura de un componente que ya
exista.

## Mantenedores

Mantienen el proyecto [@hectorpalmatellez](https://github.com/hectorpalmatellez)
y [@juanbrujo](https://github.com/juanbrujo). Ellos revisan y mergean los PRs, y
el proyecto está abierto a que se sume quien contribuya de forma sostenida.

Si un PR queda sin respuesta por muchas horas o días, mencionar a alguno de ellos en el
mismo PR es la forma más directa de retomarlo. O puedes dejar un mensaje en Slack en #comunidad
