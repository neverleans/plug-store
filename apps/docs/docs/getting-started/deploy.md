---
id: deploy
title: Deploy
sidebar_label: Deploy
sidebar_position: 4
description: Deploying a PlugStore build to Vercel, Netlify, GitHub Pages or any static host — including the SPA rewrite and sub-directory hosting.
---

# Deploy

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

Your store live on a URL, with deep links that survive a refresh.

</div>

A PlugStore project is a static Vite build. `npm run build` produces `dist/`,
and any static host can serve it.

## The one thing every host needs

PlugStore uses client-side routing. A visitor who loads `/products/abc123`
directly asks the host for a file that does not exist. Every deployment target
needs a rewrite that serves `index.html` for unknown paths — otherwise deep
links, refreshes and shared URLs all 404.

## Vercel

Zero config for the build; add the rewrite:

```json title="vercel.json"
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Netlify

```toml title="netlify.toml"
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## GitHub Pages

Pages has no rewrite rules at all. The workaround is to serve the same shell as
`404.html`, which hands control back to the router:

```yaml title=".github/workflows/deploy.yml"
- name: Build
  run: npm run build
  env:
    VITE_BASE: /${{ github.event.repository.name }}/

- name: SPA fallback
  run: cp dist/index.html dist/404.html

- name: Disable Jekyll
  run: touch dist/.nojekyll
```

## Serving from a sub-directory

A project Pages site lives at `https://user.github.io/repo/`, not at a domain
root. Two things must agree:

**1. Vite's `base`** — so asset URLs are correct:

```ts title="vite.config.ts"
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  // …
});
```

**2. The router's `basename`** — so routes resolve:

```tsx
<CatalogApp basename="/repo" />
```

Without `basename` every route is matched against `/` and the app renders its
404 page even though the files loaded fine.

## Any static host

```bash
npm run build
# upload dist/ — plus a rewrite to index.html
```

Nginx:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Apache:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Before you go live

- Run `npm run build` locally — the production build purges CSS differently from
  dev, and a missing `content` path in Tailwind only shows up here. See
  [Tailwind setup](./tailwind.md).
- Add `<CatalogApp disableAdmin />` unless you want an unauthenticated settings
  screen on your public store. See [Admin panel](../guides/admin.md).
- Check that the Pix code scans in a real banking app if you accept Pix. See
  [Pix](../guides/pix.md).
- Add a `manifest.webmanifest` if you want the install prompt. See
  [PWA](../guides/pwa.md).

## Next

- [SEO and analytics](../guides/seo-analytics.md)
- [Connect a real backend](../guides/data.md)
