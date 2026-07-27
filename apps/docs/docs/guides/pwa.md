---
id: pwa
title: PWA and offline
sidebar_label: PWA & offline
sidebar_position: 8
description: Service worker registration, the offline banner, and how to trigger the native install prompt from your own UI.
---

# PWA and offline

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

An installable store that keeps working when the connection drops.

</div>

## `usePWA`

```tsx
import { usePWA } from '@neverleans-labs/plug-store-core';

function InstallButton() {
  const { isOffline, isInstalled, installPrompt, promptInstall } = usePWA();

  if (isOffline) return <span>You are offline — browsing the cached catalog.</span>;
  if (isInstalled || !installPrompt) return null;

  return <button onClick={promptInstall}>Install this store</button>;
}
```

| Member | Type | Notes |
|---|---|---|
| `isOffline` | `boolean` | Tracks `online`/`offline` events |
| `isInstalled` | `boolean` | Set when the `appinstalled` event fires |
| `installPrompt` | `PWAInstallPromptEvent \| null` | `null` until the browser offers it |
| `promptInstall` | `() => Promise<boolean>` | Resolves `true` if the visitor accepted |

`installPrompt` is `null` on iOS Safari and until Chrome's install heuristics
are satisfied. Render the button conditionally, as above, rather than showing a
control that does nothing.

## Service worker

By default the hook registers `/sw.js` on mount. Opt out when your app manages
its own:

```tsx
usePWA({ autoRegisterSW: false });
```

Registration failures are swallowed on purpose — a store served from a
directory without `sw.js` should not throw in the console on every load.

### Getting `sw.js` into your build

The service worker source lives in the core package but it must be served from
your static root, because a worker's scope is limited to its own directory.
Copy it into `public/` as part of your build, or write your own using
`workbox`/`vite-plugin-pwa` if you want precaching of your own assets.

Caching is network-first: fresh content when the network is there, the last
cached response when it is not.

## The offline banner

`PWAOfflineBanner` is already rendered inside `Header`, so a `<CatalogApp />`
store shows the notice automatically. Render it yourself if you built your own
header:

```tsx
import { PWAOfflineBanner } from '@neverleans-labs/plug-store-core';
```

## Manifest

PlugStore does not generate `manifest.webmanifest`. Add one to your `public/`
folder and link it from `index.html` — the install prompt does not appear
without it.

```json title="public/manifest.webmanifest"
{
  "name": "Bloom Cosmetics",
  "short_name": "Bloom",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#d92f6a",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

```html title="index.html"
<link rel="manifest" href="/manifest.webmanifest" />
```

## Next

- [Deploy the store](../getting-started/deploy.md)
- [SEO and analytics](./seo-analytics.md)
