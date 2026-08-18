# Política de seguridad

Chucao se publica en npm como [`@devschile/chucao`](https://www.npmjs.com/package/@devschile/chucao) y se sirve desde `static.devschile.cl`, así que un problema de seguridad acá puede afectar a varios proyectos de la comunidad a la vez.

## Cómo reportar

**No abras un issue público.** Hay dos vías privadas:

1. **[Reportar una vulnerabilidad en GitHub](https://github.com/devschile/chucao/security/advisories/new)** — la vía preferida. Abre un hilo privado con los mantenedores dentro del mismo repositorio, así que queda todo en un solo lugar.
2. **Correo a huemul@devschile.cl**, si prefieres no pasar por GitHub.

Ayuda mucho incluir:

- qué versión de la librería probaste;
- cómo reproducirlo, con el mínimo de pasos posible;
- qué impacto le ves;
- si ya tienes una idea de cómo arreglarlo.

Acusamos recibo dentro de **72 horas**, aunque sea para decirte que lo estamos viendo. Después te contamos en qué quedó, se arregle o no.

Si reportas algo válido y quieres crédito público, lo damos en las notas del release. Si prefieres quedar anónimo, también.

## Versiones soportadas

| Versión      | Soporte                     |
| ------------ | --------------------------- |
| Última `1.x` | Recibe parches de seguridad |
| Anteriores   | Sin soporte                 |

En la práctica esto significa que el arreglo sale en una versión nueva y hay que actualizar. No hacemos backports a versiones viejas.

## Alcance

Entra en alcance lo que publica este repositorio: los componentes de la librería, los tokens, y los archivos servidos desde `static.devschile.cl/chucao/`.

Los sitios de la comunidad que usan Chucao (`pegas.devschile.cl`, `semanario.devschile.cl`, entre otros) viven en sus propios repositorios; si el problema es de uno de ellos, conviene reportarlo allá.

## Reporting in English

If you'd rather write in English, that's fine. Don't open a public issue — either [report a vulnerability through GitHub](https://github.com/devschile/chucao/security/advisories/new) or email **huemul@devschile.cl**, and include the affected version, reproduction steps, and the impact you see. We acknowledge reports within 72 hours.
