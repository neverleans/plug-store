---
id: intro
title: What is PlugStore?
sidebar_label: What is PlugStore?
sidebar_position: 1
description: An open-source React and Tailwind framework for product catalogs and online stores, with 50 industry themes, headless data providers, WhatsApp and Pix checkout, PWA and SEO built in.
---

# What is PlugStore?

PlugStore is a **turnkey catalog and e-commerce framework for React**. One command
gives you a complete storefront — routing, product grid, filters, search, cart,
wishlist, comparison, checkout, account pages, PWA and SEO — that you then shape
into the brand you need.

It is not a component library you assemble a store from. It is the store, with
every part exposed so you can replace any of it.

```bash
npm create plug-store my-store
```

## The three packages

Everything is published under the Apache-2.0 license. All three release together
on the same version number.

| Package | What it is |
|---|---|
| [`@neverleans-labs/plug-store-core`](https://www.npmjs.com/package/@neverleans-labs/plug-store-core) | The framework: `CatalogApp`, providers, contexts, hooks, pages, components, checkout and PWA. |
| [`@neverleans-labs/plug-store-themes`](https://www.npmjs.com/package/@neverleans-labs/plug-store-themes) | The 50 industry themes and the `defineTheme` helper for custom brands. |
| [`create-plug-store`](https://www.npmjs.com/package/create-plug-store) | The CLI that scaffolds a configured project. |

## Two ways to use it

**Turnkey.** Render `<CatalogApp />`, pass a config object, and you have a
working store. This is what the CLI generates.

```tsx
import { CatalogApp } from '@neverleans-labs/plug-store-core';
import '@neverleans-labs/plug-store-core/dist/index.css';

export default function App() {
  return (
    <CatalogApp
      defaultTheme="beauty"
      config={{ companyName: 'Bloom Cosmetics', currency: 'BRL' }}
    />
  );
}
```

**Headless.** Wrap your own UI in `<CatalogProvider />` and consume the contexts
and hooks directly — `useCart`, `useCheckout`, `useCatalogData`, `useTheme`. You
get the state machine and the payment adapters without any of the layout.

See [Architecture](./architecture.md) for how the two relate.

## What makes it different

- **50 themes that are actually different.** Each one carries its own palette,
  typography, hero layout, card style and copy. The coffee store does not read
  like the electronics store.
- **Pix that scans.** The checkout emits a real EMV/BCB BR Code with the
  mandated CRC-16 checksum, so a Brazilian banking app resolves it to your key.
  See [Pix payments](./guides/pix.md).
- **WhatsApp checkout.** For the very large number of small Brazilian stores
  that close orders in chat, an order becomes a pre-filled WhatsApp message.
- **Your backend, not ours.** A data provider is five async functions. Point the
  storefront at REST, Supabase, Firebase, Prisma or GraphQL.

## When *not* to use PlugStore

Being honest about this saves you a week:

- **You need a full ERP or marketplace.** PlugStore is a storefront. It has no
  inventory reconciliation, no multi-vendor payouts, no fiscal document
  generation.
- **You need server-side rendering for SEO at scale.** PlugStore is a client-side
  React SPA. It emits correct JSON-LD and meta tags, and that is enough for most
  catalogs, but if organic search is your primary acquisition channel at
  thousands of SKUs, reach for a Next.js commerce starter instead.
- **You need automatic payment confirmation.** The bundled Pix flow is *static*:
  it creates a valid payment request but nothing tells your app that the money
  arrived. Reconciliation needs a PSP integration, which you supply through the
  [adapter interface](./guides/checkout.md#custom-adapters).
- **You want a headless UI kit.** If you only want unstyled primitives, use
  Radix or shadcn/ui directly — PlugStore is opinionated about the storefront.

## License and the paid layer

The core framework, the CLI, all 50 themes, the data providers, the checkout
(Pix included) and the PWA engine are **Apache-2.0, permanently**. Everything
documented on this site ships free.

A separate commercial layer for agencies is being explored — maintained
integrations and operational tooling, not paywalled components. Nothing
described in these docs depends on it.

If one of the walls above is what stands between you and a live store,
[say which one](https://github.com/neverleans/plug-store/issues/new?template=production_need.yml).
We are mapping which ones people actually hit before building anything.

## Next

- [Create your first store](./getting-started/cli.md) with the CLI.
- [Understand the architecture](./architecture.md) before you commit to it.
- [Browse the 50 themes](./themes/gallery.mdx) to see what you are starting from.
