## Qué hace

<!-- Qué cambia y por qué. Si cierra un issue, agrega "Closes #123". -->

## Checklist

- [ ] El título del PR sigue [Conventional Commits](https://www.conventionalcommits.org/) — el merge es squash, así que este título queda en el historial y alimenta el `CHANGELOG.md`.
- [ ] `pnpm lint`, `pnpm run format:check`, `pnpm test` y `pnpm build` pasan en local.
- [ ] No edité a mano archivos generados (`src/tokens/*`, los `readme.md` de componentes, `src/components.d.ts`, `CHANGELOG.md`, la galería del docs-site).
- [ ] Si agregué o cambié un componente: tokens vía `var(--token)`, entrada en `scripts/gallery-data.mjs`, y tests actualizados.

## Capturas

<!-- Si el cambio es visual, agrega antes/después. Ojo con el viewport chico. -->
