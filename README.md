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

  <hr />
</div>

## 🚀 Quick Start (Instant CLI Scaffolding)

Create a brand new PlugStore application in under 10 seconds:

```bash
npx create-plug-store meu-catalogo
```

Answer a few quick prompts — store name, starting theme, currency, WhatsApp number and, for BRL stores, a Pix key — and your application is fully initialized and ready to accept real orders.

---

## 📦 Packages in Monorepo

All three are released together, always on the same version number.

| Package | Version | Description |
|---|---|---|
| [`@neverleans-labs/plug-store-core`](./packages/core) | [![npm](https://img.shields.io/npm/v/@neverleans-labs/plug-store-core.svg?label=%20)](https://www.npmjs.com/package/@neverleans-labs/plug-store-core) | Core UI components, turnkey `CatalogApp`, contexts, hooks, and PWA layer |
| [`@neverleans-labs/plug-store-themes`](./packages/themes) | [![npm](https://img.shields.io/npm/v/@neverleans-labs/plug-store-themes.svg?label=%20)](https://www.npmjs.com/package/@neverleans-labs/plug-store-themes) | 50 curated industry design themes & `defineTheme` customizer utility |
| [`create-plug-store`](./packages/create-plug-store) | [![npm](https://img.shields.io/npm/v/create-plug-store.svg?label=%20)](https://www.npmjs.com/package/create-plug-store) | Interactive CLI scaffolding tool |

---

## 🔥 Key Features & Superpowers

- 🎨 **50 Turnkey Industry Themes**: Ready-to-use design systems for Fashion, Tech, Food, Furniture, Beauty, Sports, Books, Pets, Automotive, Art, Jewelry, Homeware, Market, Wellness, Stationery, Winery, Brewery, Coffee, Bakery, Spices, Chocolates, Gaming, Geek, Music, Boardgames, Toys, Hardware, Lighting, Gardening, Office, Security, Cycling, Outdoors, Fishing, Fitness, Combat, Motorcycles, Optics, Dental, Medical, Pharmacy, Watchmakers, Perfume, Handcrafted, Party, Flowers, Leather, Baby, Spiritual, and Vintage — each with its own copy, colors and typography, not a reskinned template.
- 💅 **Custom Brand Themes (`defineTheme`)**: Easily configure your client's exact brand colors, typography, hero styles, and card aesthetics.
- 🔌 **Headless CMS & Data Providers**: Connect seamlessly to any backend API (REST, Supabase, Firebase, Prisma, GraphQL) via `restDataProvider` or `customDataProvider`.
- 💳 **Turnkey Checkout, Built In**: The `<CatalogApp />` checkout screen ships with a payment-method picker for **WhatsApp**, **Pix**, and a demo card flow — no extra code. Pix generates a real, spec-compliant BR Code (EMV/Banco Central, with the mandated CRC-16 checksum) that scans in any Brazilian banking app, not a placeholder string. Prefer to build your own UI? The same logic is available headless via `useCheckout`, with adapters for **Stripe Checkout** and **Mercado Pago** too.
- 📱 **PWA & Offline Catalog**: Full offline caching via Service Worker with automatic network-first fallbacks and instant native installation prompts.
- 🚀 **SEO & OpenGraph Built-in**: Full JSON-LD (`Schema.org/Product`), Meta tags, and Twitter Cards out of the box.
- 📊 **Zero-Config E-Commerce Analytics**: Automatic event tracking for Google Analytics 4 (GA4) and Meta Pixel.

---

## ⚡ Installation & Manual Usage

Install the packages in your existing React project:

```bash
npm install @neverleans-labs/plug-store-core @neverleans-labs/plug-store-themes
```

### 1. Turnkey Full Application (`<CatalogApp />`)

The fastest way to render a complete catalog with routing, header, footer, product grid, cart, wishlist, and search:

```tsx
import React from 'react';
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

> **Note — Tailwind CSS Setup required.** PlugStore ships its own compiled CSS, but you still need Tailwind configured in your project so the library's utility classes are not purged. See the **Tailwind Setup** section below.

### Tailwind Setup

After installing the package, create (or update) a `tailwind.config.js` and `postcss.config.js` in your project root:

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Required: scan the compiled library output so its classes are not purged
    './node_modules/@neverleans-labs/plug-store-core/dist/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
    },
  },
  plugins: [],
};
```

```js
// postcss.config.js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

And in your entry file (`src/main.tsx` or `src/index.tsx`), import your own CSS **before** the app:

```tsx
import './index.css'; // your file with @tailwind base/components/utilities
```

Your `src/index.css` should contain:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

> **React 18 and React 19 are both supported.** Every release is verified by
> building a real scaffolded project against both majors, on Linux and Windows
> (see the `e2e-consumer` job in [`ci.yml`](./.github/workflows/ci.yml)).

---

### 2. Custom Brand Theme (`defineTheme`)

Customizing colors and fonts to match your client's exact brand identity:

```typescript
import { defineTheme } from '@neverleans-labs/plug-store-themes';
import { CatalogApp } from '@neverleans-labs/plug-store-core';

const customClientTheme = defineTheme({
  id: 'my-brand',
  name: 'MY BRAND STORE',
  tagline: 'Premium Style',
  colors: {
    primary: '210 100% 50%',
    primaryForeground: '0 0% 100%',
    background: '210 20% 98%',
    card: '0 0% 100%',
    heroGradientFrom: '210 100% 45%',
    heroGradientTo: '230 80% 30%',
  },
  fonts: {
    heading: '"Space Grotesk", sans-serif',
    body: '"Inter", sans-serif',
  },
  heroStyle: 'split',
  cardStyle: 'bordered',
});

export default function App() {
  return <CatalogApp customTheme={customClientTheme} />;
}
```

---

### 3. Connecting to Any Backend (Headless Data Provider)

Connect PlugStore directly to your Node.js, Laravel, Django, Supabase, or REST API:

```tsx
import {
  CatalogProvider,
  restDataProvider,
  useCatalogData,
} from '@neverleans-labs/plug-store-core';

// ── Inner component that consumes the data ──────────────────────────────────
function StoreFront() {
  const { products, categories, isLoading } = useCatalogData();

  if (isLoading) return <p>Loading...</p>;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

// ── Root: wrap with CatalogProvider and point at your REST API ──────────────
export default function App() {
  return (
    <CatalogProvider
      dataProvider={restDataProvider('https://api.my-store.com/v1')}
      config={{ companyName: 'My Store' }}
    >
      <StoreFront />
    </CatalogProvider>
  );
}
```

---

### 4. Turnkey Checkout (`useCheckout`)

If you're using `<CatalogApp />`, its checkout page already renders a payment-method
picker for WhatsApp, Pix and card — you don't need any of the code below. Reach for
`useCheckout` when you're building your own checkout UI on top of `<CatalogProvider />`
and need to handle WhatsApp, Pix, Stripe, or Mercado Pago checkouts in 1 line of code:

```tsx
import { useCheckout } from '@neverleans-labs/plug-store-core';
import type { ShippingInfo } from '@neverleans-labs/plug-store-core';

function CartSummary() {
  const { processCheckout, loading } = useCheckout();

  // Example shipping info — in a real form this comes from user input
  const shippingInfo: ShippingInfo = {
    fullName: 'Maria Silva',
    email: 'maria@example.com',
    phone: '5511999999999',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
  };

  const handleWhatsAppOrder = () => processCheckout(shippingInfo, 'whatsapp');
  const handlePixPayment = () => processCheckout(shippingInfo, 'pix');

  return (
    <button onClick={handleWhatsAppOrder} disabled={loading}>
      Send Order via WhatsApp
    </button>
  );
}
```

---

## 🌟 PlugStore Open-Core & Ecosystem

PlugStore is built on an **Open-Core philosophy**:
- The core framework, CLI tool, 50 built-in themes, Headless Data Providers, checkout (including real Pix BR Codes), and PWA engine are and will always remain **100% Free & Open Source under the Apache-2.0 License**.
- We're exploring an optional **PlugStore Pro** layer for agencies and stores that outgrow the free tier — think maintained integrations (NFe, live shipping quotes, marketplace sync) and operational tooling, not paywalled components. Nothing here is gated behind it today; everything described in this README ships free.

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

Clone the repo and run locally:

```bash
git clone https://github.com/neverleans/plug-store.git
cd plug-store

# Install dependencies
pnpm install

# Build core and themes packages
pnpm build

# Run the demo app locally
pnpm dev
```

Visit `http://localhost:5173` for an interactive gallery of all 50 themes — pick one and
it opens as a full, browsable storefront (cart, search, wishlist, checkout), not a static
screenshot.

Other useful scripts, run from the repo root:

```bash
pnpm test           # run the test suites
pnpm test:coverage  # core package, with a coverage report
pnpm lint           # lint every package
```

---

## 📄 License

Licensed under the [Apache-2.0 License](./LICENSE).  
Copyright (c) 2026 @neverleans.
