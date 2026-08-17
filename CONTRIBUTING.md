# Cómo contribuir a Chucao

Chucao es el kit de marca y sistema de diseño de devsChile. Se hizo por y para
la comunidad, así que los aportes son bienvenidos: desde corregir una typo en la
documentación hasta proponer un componente nuevo.

Esta guía cubre el proceso. Las convenciones técnicas están en
[`AGENTS.md`](AGENTS.md) y en [`docs/`](docs/) — acá no se duplican, se enlazan.

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

Lecturas útiles según lo que vayas a tocar:

| Si vas a…                             | Lee                                                                         |
| ------------------------------------- | --------------------------------------------------------------------------- |
| Trabajar en un componente             | [`docs/components.md`](docs/components.md) y [`AGENTS.md`](AGENTS.md)       |
| Cambiar tokens o estilos              | [`DESIGN.md`](DESIGN.md) y la sección de tokens de [`AGENTS.md`](AGENTS.md) |
| Escribir o ajustar tests              | [`docs/testing.md`](docs/testing.md)                                        |
| Consumir la librería en otro proyecto | [`docs/using-the-library.md`](docs/using-the-library.md)                    |

## Ambiente local

El repo usa **pnpm** (está fijado en `packageManager`) y **Node 24** (ver
`.nvmrc`).

```bash
pnpm install
pnpm start
```

Los comandos completos están en [`AGENTS.md`](AGENTS.md) y en
[`docs/components.md`](docs/components.md).

## Flujo de trabajo

1. Crea una rama desde `main`. La convención es `<tipo>/<descripción-corta>`,
   usando los mismos tipos que los commits: `feat/`, `fix/`, `chore/`, `ci/`.
   Por ejemplo: `feat/ch-tooltip`, `fix/switch-thumb-position`.
2. Haz tus cambios y deja el gate local en verde (ver más abajo).
3. Abre un pull request contra `main`.
4. Espera revisión de alguno de los mantenedores.

Un par de cosas que conviene saber:

- **`main` está protegido.** No se puede pushear directo; todo entra por PR con
  el check de CI en verde.
- **El merge es siempre squash.** Es el único método habilitado en el repo, así
  que el título del PR termina siendo el mensaje del commit en `main` — escríbelo
  siguiendo la convención de commits.
- **La rama `docs` la genera CI** (`.github/workflows/docs.yml`) para publicar el
  sitio en GitHub Pages. No se edita a mano.
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

Esto no es solo estilo: `release-it` calcula la próxima versión y genera el
`CHANGELOG.md` a partir de estos mensajes. Un commit fuera de convención ensucia
el changelog y puede afectar el número de versión.

Como el merge es squash, **lo que importa es el título del PR**.

## Antes de mandar el PR

Corre el mismo gate que corre CI:

```bash
pnpm lint
pnpm run format:check
pnpm test
pnpm build
```

Si `format:check` reclama, `pnpm run format` lo arregla.

## Archivos que no se editan a mano

Varios archivos del repo son generados. Editarlos a mano se pierde en la
siguiente regeneración:

| Archivo                       | Lo genera                                 |
| ----------------------------- | ----------------------------------------- |
| `src/tokens/*`                | `toki`, a partir de `chucao-tokens.json`  |
| `src/components/**/readme.md` | el output target `docs-readme` de Stencil |
| `src/components.d.ts`         | Stencil                                   |
| `CHANGELOG.md`                | `release-it`                              |
| La galería de `docs-site/`    | `pnpm run generate:gallery`               |

Para cambiar tokens, edita [`chucao-tokens.json`](chucao-tokens.json) y corre el
pipeline de `toki` (ver [`AGENTS.md`](AGENTS.md)).

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
   - colores y medidas vía `var(--token)` — nunca valores hardcodeados;
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

Si un PR queda sin respuesta por varios días, mencionar a alguno de ellos en el
mismo PR es la forma más directa de retomarlo.
