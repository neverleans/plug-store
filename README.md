# @neverleans Catalog Monorepo

> A high-performance, modular catalog and e-commerce framework for React & TypeScript.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://img.shields.io/npm/v/@neverleans/catalog-core.svg)](https://www.npmjs.com/package/@neverleans/catalog-core)

---

## 📦 Packages

| Package | Version | Description |
|---|---|---|
| [`@neverleans/catalog-core`](./packages/core) | `0.1.0` | Core catalog engine, UI components, cart/wishlist state providers & hooks |
| [`@neverleans/catalog-themes`](./packages/themes) | `0.1.0` | 15 built-in industry themes and `defineTheme` customization helper |

---

## 🚀 Quick Start

### 1. Installation

```bash
npm install @neverleans/catalog-core @neverleans/catalog-themes
# or with pnpm
pnpm add @neverleans/catalog-core @neverleans/catalog-themes
```

### 2. Usage — Complete App in 5 Lines

```tsx
import { CatalogApp } from '@neverleans/catalog-core';
import '@neverleans/catalog-core/dist/index.css';

export default function App() {
  return (
    <CatalogApp
      defaultTheme="fashion"
      config={{
        companyName: "My Store",
        currency: "USD",
        whatsappPhone: "5511998887777",
      }}
    />
  );
}
```

### 3. Usage — Custom Components & Layouts

```tsx
import { CatalogProvider, ProductCard, useCart } from '@neverleans/catalog-core';

function CustomStorefront({ products }) {
  const { addItem } = useCart();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => addItem(product)}
        />
      ))}
    </div>
  );
}

export default function App() {
  return (
    <CatalogProvider config={{ companyName: "Boutique" }}>
      <CustomStorefront products={myProducts} />
    </CatalogProvider>
  );
}
```

---

## 🎨 Themes & Customization

Use `defineTheme` from `@neverleans/catalog-themes` to create custom theme definitions:

```typescript
import { defineTheme } from '@neverleans/catalog-themes';

export const customTheme = defineTheme({
  id: 'neon-cyber',
  name: 'CYBER STORE',
  tagline: 'Future Shopping',
  colors: {
    primary: '280 100% 60%',
    background: '260 20% 8%',
    foreground: '0 0% 98%',
  },
  fonts: {
    heading: '"Orbitron", sans-serif',
    body: '"Inter", sans-serif',
  },
  heroStyle: 'energetic',
  cardStyle: 'elevated',
  navStyle: 'bold',
});
```

---

## 📄 License

Distributed under the **Apache-2.0 License**. See [`LICENSE`](./LICENSE) for details.
