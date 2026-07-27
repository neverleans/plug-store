<div align="center">
  <h1>🔌 PlugStore Framework</h1>
  <p><b>The Turnkey Headless Catalog & E-Commerce Framework for React & Tailwind CSS</b></p>

  <p>
    <a href="https://github.com/neverleans/plug-store/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue.svg" alt="License"></a>
    <a href="https://www.npmjs.com/package/@neverleans-labs/plug-store-core"><img src="https://img.shields.io/npm/v/@neverleans-labs/plug-store-core.svg?color=brightgreen" alt="NPM Core Version"></a>
    <a href="https://www.npmjs.com/package/@neverleans-labs/plug-store-themes"><img src="https://img.shields.io/npm/v/@neverleans-labs/plug-store-themes.svg?color=orange" alt="NPM Themes Version"></a>
    <a href="https://github.com/neverleans/plug-store/actions"><img src="https://img.shields.io/github/actions/workflow/status/neverleans/plug-store/ci.yml?branch=master" alt="CI Status"></a>
  </p>

  <p>
    Create high-converting, stunning product catalogs and e-commerce stores in seconds.<br />
    Includes 50 built-in industry themes, Headless Data Providers, Turnkey Payment Gateways, and PWA Offline support.
  </p>

  <p>
    <b><a href="https://neverleans.github.io/plug-store/">📖 Documentation</a></b>
    ·
    <b><a href="https://neverleans.github.io/plug-store/demo/">🎨 Live demo — all 50 themes</a></b>
  </p>

  <hr />
</div>

## 🚀 Quick Start

Create a brand new PlugStore application in under 10 seconds:

```bash
npx create-plug-store meu-catalogo
```

Answer a few quick prompts — store name, starting theme, currency, WhatsApp number and,
for BRL stores, a Pix key — and your application is fully initialized and ready to accept
real orders.

Then `cd`, install and run:

```bash
cd meu-catalogo && npm install && npm run dev
```

---

## 📦 Packages

All three are released together, always on the same version number.

| Package | Version | Description |
|---|---|---|
| [`@neverleans-labs/plug-store-core`](./packages/core) | [![npm](https://img.shields.io/npm/v/@neverleans-labs/plug-store-core.svg?label=%20)](https://www.npmjs.com/package/@neverleans-labs/plug-store-core) | Core UI components, turnkey `CatalogApp`, contexts, hooks, and PWA layer |
| [`@neverleans-labs/plug-store-themes`](./packages/themes) | [![npm](https://img.shields.io/npm/v/@neverleans-labs/plug-store-themes.svg?label=%20)](https://www.npmjs.com/package/@neverleans-labs/plug-store-themes) | 50 curated industry design themes & `defineTheme` customizer utility |
| [`create-plug-store`](./packages/create-plug-store) | [![npm](https://img.shields.io/npm/v/create-plug-store.svg?label=%20)](https://www.npmjs.com/package/create-plug-store) | Interactive CLI scaffolding tool |

---

## 🔥 Key Features

- 🎨 **50 Turnkey Industry Themes**: Fashion, tech, food, furniture, beauty, sports, books,
  pets, automotive, art, jewelry, coffee, bakery, gaming, pharmacy, flowers and 34 more —
  each with its own palette, typography, hero layout and copy, not a reskinned template.
  [Browse them all →](https://neverleans.github.io/plug-store/docs/themes/gallery/)
- 💅 **Custom Brand Themes (`defineTheme`)**: Your client's exact colours, typography, hero
  style and card aesthetics.
- 🔌 **Headless CMS & Data Providers**: Implement five async functions and the whole
  storefront reads from your REST API, Supabase, Firebase, Prisma or GraphQL layer.
- 💳 **Turnkey Checkout, Built In**: A payment-method picker for **WhatsApp**, **Pix** and a
  demo card flow. Pix generates a real, spec-compliant BR Code (EMV/Banco Central, with the
  mandated CRC-16 checksum) that scans in any Brazilian banking app — not a placeholder
  string. Building your own UI? The same logic is available headless via `useCheckout`,
  with adapters for **Stripe Checkout** and **Mercado Pago**.
- 📱 **PWA & Offline Catalog**: Service worker caching with network-first fallbacks and the
  native install prompt wired up.
- 🚀 **SEO & OpenGraph Built-in**: `Schema.org/Product` JSON-LD, meta tags and Twitter cards
  out of the box.
- 📊 **Zero-Config E-Commerce Analytics**: Automatic GA4 and Meta Pixel events for
  `view_item`, `add_to_cart`, `begin_checkout` and `purchase`.

---

## ⚡ Installation

```bash
npm install @neverleans-labs/plug-store-core @neverleans-labs/plug-store-themes
```

```tsx
import { CatalogApp } from '@neverleans-labs/plug-store-core';
// Vite library mode emits this as a standalone file — nothing imports it for you.
import '@neverleans-labs/plug-store-core/dist/index.css';

export default function App() {
  return (
    <CatalogApp
      defaultTheme="fashion"
      config={{
        companyName: 'My Boutique',
        currency: 'BRL',
        whatsappPhone: '5511999999999',
        pixKey: 'my-boutique@example.com',
        pixMerchantCity: 'Sao Paulo',
      }}
    />
  );
}
```

Tailwind has to be configured so the library's classes survive purging. That step, and
everything else, is in the documentation:

| | |
|---|---|
| [Getting started](https://neverleans.github.io/plug-store/docs/getting-started/cli/) | CLI, manual install, **Tailwind setup**, deploy |
| [How it works](https://neverleans.github.io/plug-store/docs/architecture/) | The provider tree and the checkout flow |
| [Configuration](https://neverleans.github.io/plug-store/docs/guides/configuration/) | Every `CatalogConfig` option |
| [Themes](https://neverleans.github.io/plug-store/docs/guides/themes/) | Colour tokens, fonts, layouts, `defineTheme` |
| [Data providers](https://neverleans.github.io/plug-store/docs/guides/data/) | REST, Supabase, or any async functions you write |
| [Checkout](https://neverleans.github.io/plug-store/docs/guides/checkout/) | WhatsApp, Pix, Stripe, Mercado Pago, custom adapters |
| [Pix](https://neverleans.github.io/plug-store/docs/guides/pix/) | The BR Code field by field, with a live generator |
| [API reference](https://neverleans.github.io/plug-store/docs/reference/exports/) | Every export, prop and type |

**React 18 and React 19 are both supported.** Every release is verified by building a real
scaffolded project against both majors, on Linux and Windows — see the `e2e-consumer` job
in [`ci.yml`](./.github/workflows/ci.yml). Neither needs `--legacy-peer-deps`.

---

## 🌟 PlugStore Open-Core & Ecosystem

PlugStore is built on an **Open-Core philosophy**:

- The core framework, CLI tool, 50 built-in themes, Headless Data Providers, checkout
  (including real Pix BR Codes), and PWA engine are and will always remain **100% Free &
  Open Source under the Apache-2.0 License**.
- We're exploring an optional **PlugStore Pro** layer for agencies and stores that outgrow
  the free tier — think maintained integrations (NFe, live shipping quotes, marketplace
  sync) and operational tooling, not paywalled components. Nothing is gated behind it
  today; everything in the documentation ships free.

---

## 🤝 Contributing

Contributions are welcome, and adding a theme is the easiest place to start — each one
is a single self-contained object.

- Read the [Contributing Guide](./CONTRIBUTING.md) for setup and conventions.
- Browse [`good first issue`](https://github.com/neverleans/plug-store/labels/good%20first%20issue) to find something to pick up.
- Be kind — we follow a [Code of Conduct](./CODE_OF_CONDUCT.md).
- Found a vulnerability? Please follow our [Security Policy](./SECURITY.md) instead of opening a public issue.
- See what changed recently in the [Changelog](./CHANGELOG.md).

---

## 💖 Support the Project

If PlugStore saved you hours of work or helped you ship client projects faster, consider supporting the project:

- ⭐ **Star the Repository**: Help us gain visibility on GitHub!
- 📢 **Share with the Community**: Tweet or blog about PlugStore.
- 🪙 **Sponsor via GitHub Sponsors**: Become a backer or sponsor via [GitHub Sponsors](https://github.com/sponsors/neverleans).

---

## 💻 Local Development

```bash
git clone https://github.com/neverleans/plug-store.git
cd plug-store

pnpm install
pnpm build       # core, themes, docs and the demo
pnpm dev         # the demo app on http://localhost:5173
```

The demo is an interactive gallery of all 50 themes — pick one and it opens as a full,
browsable storefront (cart, search, wishlist, checkout), not a static screenshot.

Other useful scripts, from the repo root:

```bash
pnpm test           # run the test suites
pnpm test:coverage  # core package, with a coverage report
pnpm lint           # lint every package
pnpm e2e            # pack tarballs, scaffold a project, install and build it
pnpm --filter plug-store-docs start   # the documentation site
```

---

## 📄 License

Licensed under the [Apache-2.0 License](./LICENSE).  
Copyright (c) 2026 @neverleans.
