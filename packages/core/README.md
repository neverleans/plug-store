# @neverleans/plug-store-core

> Core engine of the [PlugStore Framework](https://github.com/neverleans/plug-store) — a turnkey headless catalog and e-commerce framework for React and Tailwind CSS.

[![npm](https://img.shields.io/npm/v/@neverleans/plug-store-core.svg?color=brightgreen)](https://www.npmjs.com/package/@neverleans/plug-store-core)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](https://github.com/neverleans/plug-store/blob/master/LICENSE)

## Installation

```bash
npm install @neverleans/plug-store-core @neverleans/plug-store-themes
```

## Quick start

Render a complete storefront — routing, header, footer, product grid, cart, wishlist
and search — with a single component:

```tsx
import { CatalogApp } from '@neverleans/plug-store-core';
import '@neverleans/plug-store-core/dist/index.css';

export default function App() {
  return (
    <CatalogApp
      defaultTheme="fashion"
      config={{
        companyName: 'My Boutique',
        currency: 'BRL',
        whatsappPhone: '5511999999999',
      }}
    />
  );
}
```

## What's inside

- **`<CatalogApp />`** — the full turnkey storefront.
- **`<CatalogProvider />`** — bring your own layout, keep the state engine.
- **Headless data providers** — `restDataProvider` and `customDataProvider` connect to
  any REST, Supabase, Firebase, Prisma or GraphQL backend.
- **`useCheckout`** — WhatsApp pre-filled orders, Pix (copy-paste and QR), Stripe and
  Mercado Pago.
- **PWA and offline catalog** — service worker caching with network-first fallbacks.
- **SEO built in** — JSON-LD `Schema.org/Product`, meta tags and Twitter cards.
- **Zero-config analytics** — automatic GA4 and Meta Pixel e-commerce events.

## Peer dependencies

React 18 and React DOM 18 are required and are not bundled.

## Documentation

Full guides and the theme gallery live in the
[main repository](https://github.com/neverleans/plug-store).

## License

Apache-2.0 © neverleans
