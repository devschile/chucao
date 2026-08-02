# devsChile — Design System

Kit de marca + sistema de diseño web de devsChile, listo para reusar en
proyectos nuevos. Pensado para que un modelo (o una persona) lo tome y aplique
sin tener que ir a buscar cada pieza por separado.

**Empieza por [`DESIGN.md`](DESIGN.md)** — es la referencia completa: identidad
de marca (el mark, paleta oficial, reglas de uso) y el sistema de diseño web
(colores, tipografía, componentes CSS de referencia) que se usó construyendo
[pegas.devschile.cl](https://pegas.devschile.cl) y
[semanario.devschile.cl](https://semanario.devschile.cl).

Este repo le agrega lo que `DESIGN.md` describe pero no traía consigo: los
archivos de imagen reales.

## Qué hay en `assets/`

```
assets/
├── brand/
│   ├── huemul-icono.png            El huemul solo, full color (600×663)
│   ├── huemul-icono.svg            Igual, vector real ✓
│   ├── huemul-icono-contorno.svg   El huemul + contorno blanco, para fondo oscuro — vector real ✓
│   ├── huemul-icono-trazo.svg      Solo el trazo, sin relleno — vector real ✓ (extra, no es
│   │                                 una de las 3 variantes oficiales de DESIGN.md)
│   ├── huemul-icono-blanco.png     El huemul solo, monocromo blanco (593×665)
│   ├── huemul-icono-blanco.svg     Igual ⚠️ todavía placeholder, ver nota
│   ├── devschile-wordmark.png      "<devschile/>", solo texto (639×153)
│   └── devschile-wordmark.svg      Igual, vector real ✓
│
└── favicon/
    ├── favicon.ico                 Multi-resolución (16/32/48), navegadores viejos
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── favicon-48x48.png
    ├── apple-touch-icon.png        180×180
    ├── android-chrome-192x192.png
    ├── android-chrome-512x512.png
    ├── favicon.svg
    ├── site.webmanifest
    └── huemul-icono-cuadrado.png   Base cuadrada (663×663, con relleno
                                     transparente) sin comprimir — fuente
                                     limpia para generar otros tamaños
```

Los nombres en `assets/brand/` coinciden a propósito con las rutas que ya usa
la tabla de `DESIGN.md` (`assets/brand/huemul-icono.png`, etc.) — el markdown
no necesita ningún ajuste, las imágenes simplemente renderizan.

### ⚠️ Sobre `huemul-icono-blanco.svg`

Es el único `.svg` que sigue siendo placeholder: el PNG original embebido tal
cual dentro de un contenedor `<svg><image href="data:image/png;base64,...">`.
Sirve para cualquier lugar que pida la extensión `.svg`, pero no es un path
editable ni escala con nitidez real — por dentro sigue siendo raster.

El resto de los `.svg` de `assets/brand/` (`huemul-icono`,
`huemul-icono-contorno`, `huemul-icono-trazo`, `devschile-wordmark`) **son
vector real**, con paths editables. Si consigues la variante monocroma blanca
en vector, reemplaza `huemul-icono-blanco.svg` con eso y esta nota deja de
aplicar.

### Uso rápido del favicon

```html
<link rel="icon" href="/favicon/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg">
<link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png">
<link rel="manifest" href="/favicon/site.webmanifest">
```

## Licencia de los assets de marca

Los archivos de `assets/brand/` reproducen el mismo mark oficial del banco
[devschile/media-press](https://github.com/devschile/media-press), bajo
[CC BY-NC-ND 4.0](http://creativecommons.org/licenses/by-nc-nd/4.0/):
**atribución, no comercial, sin derivados**. Los PNG son copias directas sin
modificar. Los `.svg` vectoriales (todos salvo `huemul-icono-blanco.svg`) son
el mismo diseño exportado con paths reales, no una reinterpretación. El set
de favicon es un reencuadre mecánico (redimensión) del icono. Nada de esto
cambia el color, la forma ni el trazo del mark — caen todos bajo la misma
licencia.

Para proyectos de la propia comunidad devsChile esto ya está cubierto (ver
"Reglas de uso" en `DESIGN.md`). Para cualquier uso comercial, o para
modificar el mark más allá de lo que hay acá, se necesita permiso explícito de
los administradores de devsChile. El imagotipo combinado, la versión
vectorial (`.ai`) y la documentación oficial (guía de estilo, guía de uso,
troquel de stickers) no se incluyen acá — están en
[devschile/media-press](https://github.com/devschile/media-press).

## Cómo reusar esto en un proyecto nuevo

1. Copia `DESIGN.md` al proyecto (o solo referéncialo desde acá) para tener a
   mano la paleta, tipografía y componentes CSS de referencia — sección
   "2. Sistema de diseño web".
2. Copia de `assets/` lo que el proyecto necesite: como mínimo el favicon y el
   `huemul-icono.png` (o `.svg`) para el header.
3. El acento teal (`#2dd4bf`) es intercambiable por proyecto — no es parte de
   la identidad oficial, es una decisión de diseño de pegas.devschile.cl que
   se puede mantener o cambiar según el proyecto. El huemul y el wordmark, en
   cambio, van tal cual — no se deforman ni se les cambia el color base fuera
   de las variantes ya documentadas (color / contorno blanco / monocromo).

*Generado por la comunidad, para la comunidad. 🦌*
