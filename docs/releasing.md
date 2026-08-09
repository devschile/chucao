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
bucket under two prefixes:

| Target                          | URL example                                            | Cache                                 |
| ------------------------------- | ------------------------------------------------------ | ------------------------------------- |
| `chucao/<version>/` (immutable) | `https://static.devschile.cl/chucao/1.1.0/chucao.css`  | `public, max-age=31536000, immutable` |
| `chucao/latest/` (mutable)      | `https://static.devschile.cl/chucao/latest/chucao.css` | `public, max-age=3600`                |

Notes:

- The **whole** `dist/chucao/` folder is uploaded (stylesheets, lazy-loading
  bootstrap, entry chunks, and `fonts/`), because `chucao.css` references the
  self-hosted fonts with relative `url('./fonts/...')` paths that must stay
  adjacent.
- Versioned directories are treated as **write-once**: never overwrite an
  existing `<version>/`; the immutable cache header relies on it.
- `latest/` is a convenience alias and is not reproducible.

### Manual redeploy

To deploy an existing release to the CDN without touching npm or the release
process, run the **"Deploy to CDN (manual)"** workflow
(`.github/workflows/deploy-cdn.yml`) from the GitHub UI:

1. **Actions → Deploy to CDN (manual) → Run workflow**.
2. Enter the version to deploy (e.g. `1.1.0`).

The workflow validates the semver input, fetches the exact published tarball
from npm (`npm pack @devschile/chucao@<version>`), extracts `dist/chucao/`, and
syncs it to both `chucao/<version>/` and `chucao/latest/`. This guarantees
byte-for-byte parity with what consumers install from npm.

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
curl -I https://static.devschile.cl/chucao/<version>/fonts/fira-sans-latin-400-normal.woff2
```

Check for `200`, `cache-control: public, max-age=31536000, immutable`, and
`content-type: font/woff2` on the font files.

## Known limitation

Cross-origin consumption of the fonts (`@font-face`) and of the
`<script type="module">` bootstrap requires `Access-Control-Allow-Origin` on
the bucket; this is deferred until a consumer needs it. See the CDN section of
[`using-the-library.md`](using-the-library.md).
