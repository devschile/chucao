# Política de seguridad

Chucao se publica en npm como [`@devschile/chucao`](https://www.npmjs.com/package/@devschile/chucao) y se sirve desde `static.devschile.cl`, así que un problema de seguridad acá puede afectar a varios proyectos de la comunidad a la vez.

## Cómo reportar

**No abras un issue público.** Escribe a **huemul@devschile.cl** con el detalle.

Ayuda mucho incluir:

- qué versión de la librería probaste;
- cómo reproducirlo, con el mínimo de pasos posible;
- qué impacto le ves;
- si ya tienes una idea de cómo arreglarlo.

Chucao lo mantiene gente de la comunidad en su tiempo libre, así que no podemos comprometer un plazo de respuesta formal. Lo que sí: hacemos lo posible por acusar recibo dentro de la primera semana y te contamos en qué quedó, se arregle o no.

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

If you'd rather write in English, that's fine — email **huemul@devschile.cl** instead of opening a public issue, and include the affected version, reproduction steps, and the impact you see.
