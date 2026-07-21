<div align="center">
  <h1>🔌 PlugStore Framework</h1>
  <p><b>The Turnkey Headless Catalog & E-Commerce Framework for React & Tailwind CSS</b></p>
  
  <p>
    <a href="https://github.com/neverleans/plug-store/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue.svg" alt="License"></a>
    <a href="https://www.npmjs.com/package/@neverleans/plug-store-core"><img src="https://img.shields.io/npm/v/@neverleans/plug-store-core.svg?color=brightgreen" alt="NPM Core Version"></a>
    <a href="https://www.npmjs.com/package/@neverleans/plug-store-themes"><img src="https://img.shields.io/npm/v/@neverleans/plug-store-themes.svg?color=orange" alt="NPM Themes Version"></a>
    <a href="https://github.com/neverleans/plug-store/actions"><img src="https://img.shields.io/github/actions/workflow/status/neverleans/plug-store/ci.yml?branch=master" alt="CI Status"></a>
  </p>

  <p>
    Create high-converting, stunning product catalogs and e-commerce stores in seconds.<br />
    Includes 15+ built-in industry themes, Headless Data Providers, Turnkey Payment Gateways, and PWA Offline support.
  </p>

  <hr />
</div>

## 🚀 Quick Start (Instant CLI Scaffolding)

Create a brand new PlugStore application in under 10 seconds:

```bash
npx create-plug-store meu-catalogo
```

Answer 3 quick prompts (Store Name, Initial Theme, Currency) and your application is fully initialized and ready to run!

---

## 📦 Packages in Monorepo

| Package | Version | Description |
|---|---|---|
| [`@neverleans/plug-store-core`](./packages/core) | `0.1.0` | Core UI components, turnkey `CatalogApp`, contexts, hooks, and PWA layer |
| [`@neverleans/plug-store-themes`](./packages/themes) | `0.1.0` | 15+ curated industry design themes & `defineTheme` customizer utility |
| [`create-plug-store`](./packages/create-plug-store) | `0.1.0` | Interactive CLI scaffolding tool |

---

## 🔥 Key Features & Superpowers

- 🎨 **50+ Turnkey Industry Themes**: Ready-to-use design systems for Fashion, Tech, Food, Furniture, Beauty, Sports, Books, Pets, Automotive, Art, Jewelry, Homeware, Market, Wellness, Stationery, Winery, Brewery, Coffee, Bakery, Spices, Chocolates, Gaming, Geek, Music, Boardgames, Toys, Hardware, Lighting, Gardening, Office, Security, Cycling, Outdoors, Fishing, Fitness, Combat, Motorcycles, Optics, Dental, Medical, Pharmacy, Watchmakers, Perfume, Handcrafted, Party, Flowers, Leather, Baby, Spiritual, and Vintage.
- 💅 **Custom Brand Themes (`defineTheme`)**: Easily configure your client's exact brand colors, typography, hero styles, and card aesthetics.
- 🔌 **Headless CMS & Data Providers**: Connect seamlessly to any backend API (REST, Supabase, Firebase, Prisma, GraphQL) via `restDataProvider` or `customDataProvider`.
- 💳 **Turnkey Payment Gateways (`useCheckout`)**: Native support for **WhatsApp pre-filled orders**, **Pix Copia e Cola & QR Code**, **Stripe Checkout**, and **Mercado Pago**.
- 📱 **PWA & Offline Catalog**: Full offline caching via Service Worker with automatic network-first fallbacks and instant native installation prompts.
- 🚀 **SEO & OpenGraph Built-in**: Full JSON-LD (`Schema.org/Product`), Meta tags, and Twitter Cards out of the box.
- 📊 **Zero-Config E-Commerce Analytics**: Automatic event tracking for Google Analytics 4 (GA4) and Meta Pixel.

---

## ⚡ Installation & Manual Usage

Install the packages in your existing React project:

```bash
npm install @neverleans/plug-store-core @neverleans/plug-store-themes
```

### 1. Turnkey Full Application (`<CatalogApp />`)

The fastest way to render a complete catalog with routing, header, footer, product grid, cart, wishlist, and search:

```tsx
import React from 'react';
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

---

### 2. Custom Brand Theme (`defineTheme`)

Customizing colors and fonts to match your client's exact brand identity:

```typescript
import { defineTheme } from '@neverleans/plug-store-themes';
import { CatalogApp } from '@neverleans/plug-store-core';

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
import { CatalogProvider, restDataProvider } from '@neverleans/plug-store-core';

export default function App() {
  return (
    <CatalogProvider
      dataProvider={restDataProvider('https://api.my-store.com/v1')}
      config={{ companyName: 'My Store' }}
    >
      <YourAppContent />
    </CatalogProvider>
  );
}
```

---

### 4. Turnkey Checkout (`useCheckout`)

Handle WhatsApp, Pix, Stripe, or Mercado Pago checkouts in 1 line of code:

```tsx
import { useCheckout } from '@neverleans/plug-store-core';

function CartSummary() {
  const { processCheckout, loading } = useCheckout();

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
- The core framework, CLI tool, 50 built-in themes, Headless Data Providers, and PWA engine are and will always remain **100% Free & Open Source under the Apache-2.0 License**.
- To support ongoing development, we are building **PlugStore Pro** — an optional marketplace offering lifetime access to premium animated UI blocks, 3D interactive product showcases, and luxury admin dashboard templates for agencies and high-growth stores.

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

# Run demo application locally
pnpm --filter=plug-store-demo-app dev
```

Visit `http://localhost:5173` to explore the live interactive demo app.

---

## 📄 License

Licensed under the [Apache-2.0 License](./LICENSE).  
Copyright (c) 2026 @neverleans.
