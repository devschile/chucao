# Releasing and CDN deployment

How `@devschile/chucao` is released to npm and deployed to the versioned CDN.
Consumer-side usage of the CDN URLs is documented in
[`using-the-library.md`](using-the-library.md).

## Release flow

Releases are driven by `release-it` and a tag-triggered CI workflow:

```bash
pnpm run release
```

`release-it` (`.release-it.json`):

- bumps the version in `package.json` using the conventional-commits changelog
  plugin,
- commits `chore(release): <version>` and updates `CHANGELOG.md`,
- creates and pushes a **signed** tag named after the version (no `v` prefix,
  e.g. `1.1.0`).

Pushing that tag triggers `.github/workflows/release.yml`
(`on: push: tags: '[0-9]*.[0-9]*.[0-9]*'`), which:

1. installs dependencies (`pnpm install --frozen-lockfile`),
2. builds (`pnpm build`), lints (`pnpm lint`), and tests (`pnpm test`),
3. creates the GitHub Release with auto-generated notes,
4. publishes the package to npm (`pnpm publish`),
5. deploys `dist/chucao/` to the CDN (see below).

## CDN deployment

On every release the built `dist/chucao/` folder is synced to the Garage S3
bucket under these prefixes:

| Target                          | URL example                                                                 | Cache                                 |
| ------------------------------- | --------------------------------------------------------------------------- | ------------------------------------- |
| `chucao/<version>/` (immutable) | `https://static.devschile.cl/chucao/1.1.0/chucao.css`                       | `public, max-age=31536000, immutable` |
| `chucao/latest/` (mutable)      | `https://static.devschile.cl/chucao/latest/chucao.css`                      | `public, max-age=3600`                |
| `chucao/fonts/` (immutable)     | `https://static.devschile.cl/chucao/fonts/fira-sans-latin-400-normal.woff2` | `public, max-age=31536000, immutable` |

Notes:

- The versioned (`chucao/<version>/`) and `latest/` prefixes carry the
  stylesheets, lazy-loading bootstrap, and entry chunks — but **not** `fonts/`:
  the syncs exclude them (`--exclude "fonts/*"`). Since v1.2.0 the `@font-face`
  rules in `chucao.css` reference the fonts by **absolute URL**
  (`chucao/fonts/…`), so the bundled `fonts/` are never served from those
  prefixes. The npm package still ships them as a self-host fallback.
- The `fonts/` files themselves live **only** at the static `chucao/fonts/`
  prefix: synced once per release with an immutable cache, so browsers and CDN
  edges reuse the same cached copy across versions. Existing `latest/fonts/`
  leftovers are cleaned up on each deploy with an explicit `s3 rm`.
- Versioned directories are treated as **write-once**: never overwrite an
  existing `<version>/`; the immutable cache header relies on it.
- `latest/` is a convenience alias and is not reproducible.
- `chucao/fonts/` is write-once too: if a font file ever changed, its URL would
  keep serving the old copy for a year. Font files are considered frozen by
  design.

### Manual redeploy

To deploy an existing release to the CDN without touching npm or the release
process, run the **"Deploy to CDN (manual)"** workflow
(`.github/workflows/deploy-cdn.yml`) from the GitHub UI:

1. **Actions → Deploy to CDN (manual) → Run workflow**.
2. Enter the version to deploy (e.g. `1.1.0`).

The workflow validates the semver input, fetches the exact published tarball
from npm (`npm pack @devschile/chucao@<version>`), extracts `dist/chucao/`, and
syncs it to `chucao/<version>/`, `chucao/latest/`, and the static
`chucao/fonts/`. This guarantees byte-for-byte parity with what consumers
install from npm.

## Required secrets

The workflows use the following repository secrets
(Settings → Secrets and variables → Actions):

| Secret                  | Purpose                                                       |
| ----------------------- | ------------------------------------------------------------- |
| `NPM_TOKEN`             | npm publish (release workflow only)                           |
| `S3_ENDPOINT_URL`       | Garage S3 API endpoint, e.g. `https://s3-static.devschile.cl` |
| `S3_BUCKET`             | Bucket containing the `chucao/` prefix                        |
| `AWS_ACCESS_KEY_ID`     | Garage access key                                             |
| `AWS_SECRET_ACCESS_KEY` | Garage secret key                                             |

## Garage specifics

- The **S3 API endpoint** (`s3-static.devschile.cl`) is a different host from
  the public CDN domain (`static.devschile.cl`).
- The signing region is `garage` (not an AWS region); both workflows set
  `--region garage`.
- Requests use **path-style** addressing (`AWS_S3_ADDRESSING_STYLE: path`).

## Verification

After a deploy, confirm the URL serves with the expected headers:

```bash
curl -I https://static.devschile.cl/chucao/<version>/chucao.css
curl -I https://static.devschile.cl/chucao/fonts/fira-sans-latin-400-normal.woff2
```

Check for `200`, `cache-control: public, max-age=31536000, immutable`, and
`content-type: font/woff2` on the font files.

The versioned and `latest/` prefixes must **not** carry fonts (they are served
exclusively from `chucao/fonts/`), so these should return `404`:

```bash
curl -sI https://static.devschile.cl/chucao/<version>/fonts/fira-sans-latin-400-normal.woff2 | head -1
curl -sI https://static.devschile.cl/chucao/latest/fonts/fira-sans-latin-400-normal.woff2 | head -1
```

## Cross-origin consumption (CORS)

The GitHub Pages showcase (`devschile.github.io/chucao`) loads the library from
`static.devschile.cl`, so the bucket must allow cross-origin reads. The CORS
rules live in [`.github/cors-bucket.json`](../.github/cors-bucket.json)
(`Access-Control-Allow-Origin: *` for `GET`/`HEAD`). Apply them to the bucket
with:

```bash
aws --endpoint-url "$S3_ENDPOINT_URL" --region garage s3api put-bucket-cors \
  --bucket "$S3_BUCKET" --cors-configuration file://.github/cors-bucket.json
```

Verify the header is served:

```bash
curl -sI -H "Origin: https://devschile.github.io" \
  https://static.devschile.cl/chucao/latest/chucao.esm.js | grep -i access-control
```

This also covers the static font URLs: since v1.2.0 `chucao.css` loads
`chucao/fonts/…` cross-origin via `@font-face`, and browsers enforce CORS on
cross-origin fonts — without the header the fonts silently fail to load.

See the CDN section of [`using-the-library.md`](using-the-library.md) for
consumer-side usage of the CDN URLs.

## Gallery deployment

The static showcase that powers the GitHub Pages site (built from
[`docs-site/`](../docs-site/) by `.github/workflows/docs.yml`) is also synced to
`gallery/latest/` on the same bucket:

| Target                      | URL example                                   | Cache                  |
| --------------------------- | --------------------------------------------- | ---------------------- |
| `gallery/latest/` (mutable) | `https://static.devschile.cl/gallery/latest/` | `public, max-age=3600` |

Because `gallery/` and `chucao/` live on the same host, the gallery is served
**same-origin** with the library it loads — no CORS involved there. The gallery
deploy runs from the same workflow and reuses the same `S3_*` secrets listed
above.
