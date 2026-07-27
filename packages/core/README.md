# @neverleans-labs/plug-store-core

> Core engine of the [PlugStore Framework](https://neverleans.github.io/plug-store/) — a turnkey headless catalog and e-commerce framework for React and Tailwind CSS.

**[Documentation](https://neverleans.github.io/plug-store/) · [Live demo](https://neverleans.github.io/plug-store/demo/) · [Documentação em português](https://neverleans.github.io/plug-store/pt-BR/)**

[![npm](https://img.shields.io/npm/v/@neverleans-labs/plug-store-core.svg?color=brightgreen)](https://www.npmjs.com/package/@neverleans-labs/plug-store-core)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](https://github.com/neverleans/plug-store/blob/master/LICENSE)

## Installation

```bash
npm install @neverleans-labs/plug-store-core @neverleans-labs/plug-store-themes
```

## Quick start

Render a complete storefront — routing, header, footer, product grid, cart, wishlist
and search — with a single component:

```tsx
import { CatalogApp } from '@neverleans-labs/plug-store-core';
import '@neverleans-labs/plug-store-core/dist/index.css';

export default function App() {
  return (
    <CatalogApp
      defaultTheme="fashion"
      config={{
        companyName: 'My Boutique',
        currency: 'BRL',
        whatsappPhone: '5511999999999',
        pixKey: 'my-boutique@example.com', // enables a real, scannable Pix BR Code at checkout
        pixMerchantCity: 'Sao Paulo',
      }}
    />
  );
}
```

## What's inside

- **`<CatalogApp />`** — the full turnkey storefront, checkout included: a payment-method
  picker for WhatsApp, Pix and a demo card flow, no extra code.
- **`<CatalogProvider />`** — bring your own layout, keep the state engine.
- **Headless data providers** — `restDataProvider` and `customDataProvider` connect to
  any REST, Supabase, Firebase, Prisma or GraphQL backend.
- **`useCheckout`** — the same checkout logic, headless: WhatsApp pre-filled orders, real
  Pix BR Codes (copy-paste and QR, EMV/Banco Central spec), Stripe and Mercado Pago.
- **PWA and offline catalog** — service worker caching with network-first fallbacks.
- **SEO built in** — JSON-LD `Schema.org/Product`, meta tags and Twitter cards.
- **Zero-config analytics** — automatic GA4 and Meta Pixel e-commerce events.

One extra step is easy to miss: Tailwind purges every PlugStore class unless your
`tailwind.config.js` scans the compiled library.

```js
content: [
  './src/**/*.{js,ts,jsx,tsx}',
  './node_modules/@neverleans-labs/plug-store-core/dist/**/*.js',
],
```

The [Tailwind setup guide](https://neverleans.github.io/plug-store/docs/getting-started/tailwind)
explains why. `npm create plug-store` writes this for you.

## Peer dependencies

React and React DOM, `^18.0.0 || ^19.0.0`, are required and are not bundled.

## Documentation

| Topic | Page |
|---|---|
| Every export, with signatures | [API reference](https://neverleans.github.io/plug-store/docs/reference/exports) |
| `Product`, `ShippingInfo`, `ThemeConfig`, … | [Types](https://neverleans.github.io/plug-store/docs/reference/types) |
| Store settings | [Configuration](https://neverleans.github.io/plug-store/docs/guides/configuration) |
| Your own backend | [Data & providers](https://neverleans.github.io/plug-store/docs/guides/data) |
| WhatsApp, Pix, Stripe, Mercado Pago | [Checkout](https://neverleans.github.io/plug-store/docs/guides/checkout) |
| The 50 themes, live | [Theme gallery](https://neverleans.github.io/plug-store/docs/themes/gallery) |

## License

Apache-2.0 © neverleans
