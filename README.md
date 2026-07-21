# @neverleans PlugStore Monorepo

> A high-performance, modular catalog and e-commerce framework for React & TypeScript.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://img.shields.io/npm/v/@neverleans/plug-store-core.svg)](https://www.npmjs.com/package/@neverleans/plug-store-core)

---

## 📦 Packages

| Package | Version | Description |
|---|---|---|
| [`@neverleans/plug-store-core`](./packages/core) | `0.1.0` | Core catalog engine, UI components, deep-linking, SEO & analytics |
| [`@neverleans/plug-store-themes`](./packages/themes) | `0.1.0` | 15 built-in industry themes and `defineTheme` customization helper |

---

## 🚀 Quick Start

### 1. Installation

```bash
npm install @neverleans/plug-store-core @neverleans/plug-store-themes
# or with pnpm
pnpm add @neverleans/plug-store-core @neverleans/plug-store-themes
```

### 2. Usage — Turnkey Catalog App in 5 Lines

```tsx
import { CatalogApp } from '@neverleans/plug-store-core';

export default function App() {
  return (
    <CatalogApp
      defaultTheme="fashion"
      config={{
        companyName: "Minha Loja",
        currency: "BRL",
        whatsappPhone: "5511999999999",
      }}
    />
  );
}
```

### 3. Usage — Custom Components, Deep-Linking & Analytics

```tsx
import { CatalogProvider, ProductCard, useCart, useCatalogLink, trackEvent } from '@neverleans/plug-store-core';

function CustomStorefront({ products }) {
  const { addItem } = useCart();
  const { getWhatsAppCheckoutUrl } = useCatalogLink();

  const handleAddToCart = (product) => {
    addItem(product);
    trackEvent('add_to_cart', { content_ids: [product.id], value: product.price });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
      <a href={getWhatsAppCheckoutUrl()} target="_blank" className="btn btn-primary">
        Enviar Pedido via WhatsApp
      </a>
    </div>
  );
}

export default function App() {
  return (
    <CatalogProvider config={{ companyName: "Boutique", gaId: "G-XXXXXXXX" }}>
      <CustomStorefront products={myProducts} />
    </CatalogProvider>
  );
}
```

---

## 📄 License

Distributed under the **Apache-2.0 License**. See [`LICENSE`](./LICENSE) for details.
