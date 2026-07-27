---
id: rest-api
title: Connect a REST API
sidebar_label: REST API
sidebar_position: 1
description: A complete walkthrough of pointing PlugStore at your own REST backend, including the response shapes and how to adapt a schema that does not match.
---

# Connect a REST API

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

Your own products, categories and reviews rendering in the storefront, served by
your API.

</div>

## If your API already matches

```tsx
import { CatalogApp, restDataProvider } from '@neverleans-labs/plug-store-core';

export default function App() {
  return (
    <CatalogApp
      dataProvider={restDataProvider('https://api.my-store.com/v1')}
      config={{ companyName: 'My Store', currency: 'BRL' }}
    />
  );
}
```

The routes it will call:

```
GET  /products?category=&search=&featured=true&limit=
GET  /products/:id
GET  /categories
GET  /products/:id/reviews
POST /orders
```

With authentication:

```tsx
restDataProvider('https://api.my-store.com/v1', {
  headers: { Authorization: `Bearer ${token}` },
});
```

## If your API does not match

Almost none do. Write the mapping explicitly — it is usually twenty lines.

```ts title="src/catalogProvider.ts"
import { customDataProvider } from '@neverleans-labs/plug-store-core';
import type { Product, Category } from '@neverleans-labs/plug-store-core';

const API = 'https://api.my-store.com';

// Your API's shape, whatever it happens to be.
interface ApiProduct {
  sku: string;
  title: string;
  body_html: string;
  price_cents: number;
  compare_at_cents?: number;
  photos: { url: string }[];
  collection: string;
  labels: string[];
  available: boolean;
  is_highlight: boolean;
  reviews_avg: number;
  reviews_total: number;
}

const toProduct = (p: ApiProduct): Product => ({
  id: p.sku,
  name: p.title,
  description: p.body_html.replace(/<[^>]+>/g, ''),
  // PlugStore expects a decimal amount in the store currency, not cents.
  price: p.price_cents / 100,
  originalPrice: p.compare_at_cents ? p.compare_at_cents / 100 : undefined,
  images: p.photos.map((photo) => photo.url),
  // Must match Category.name, not its slug.
  category: p.collection,
  rating: p.reviews_avg,
  reviewCount: p.reviews_total,
  tags: p.labels,
  inStock: p.available,
  industry: 'fashion',
  featured: p.is_highlight,
});

const json = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} on ${path}`);
  return res.json();
};

export const catalogProvider = customDataProvider({
  async getProducts(params) {
    const query = new URLSearchParams();
    if (params?.category) query.set('collection', params.category);
    if (params?.search) query.set('q', params.search);
    if (params?.featured) query.set('highlight', '1');
    if (params?.limit) query.set('per_page', String(params.limit));

    const data = await json<ApiProduct[]>(`/catalog?${query}`);
    return data.map(toProduct);
  },

  async getProductById(id) {
    try {
      return toProduct(await json<ApiProduct>(`/catalog/${id}`));
    } catch {
      // A missing product is a null, not an exception — the page renders its
      // own "not found" state.
      return null;
    }
  },

  async getCategories(): Promise<Category[]> {
    const data = await json<{ id: string; title: string; handle: string; image: string }[]>(
      '/collections',
    );
    return data.map((c) => ({
      id: c.id,
      name: c.title,
      slug: c.handle,
      image: c.image,
      industry: 'fashion',
    }));
  },

  async createOrder(order) {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: order.shipping,
        line_items: order.items.map((item) => ({
          sku: item.product.id,
          quantity: item.quantity,
          variants: item.selectedVariants,
        })),
        total_cents: Math.round(order.total * 100),
      }),
    });

    const created = await res.json();
    return {
      id: created.number,
      date: created.created_at,
      status: 'confirmed',
      items: order.items,
      shipping: order.shipping,
      total: order.total,
    };
  },
});
```

Then:

```tsx
import { catalogProvider } from './catalogProvider';

<CatalogApp dataProvider={catalogProvider} />
```

## Checking it worked

Open the network tab and load the home page. You should see a request for
featured products. If you only see it after navigating to a product page, the
provider is not mounted — confirm it is passed to the outermost
`CatalogApp`/`CatalogProvider`.

Common mistakes:

- **The category filter shows nothing.** `Product.category` must equal
  `Category.name`, not the slug.
- **Prices are 100× too large.** Your API returns cents; divide.
- **Images do not load.** `images` must be absolute URLs; relative paths resolve
  against the store's origin.
- **Everything is stale.** Results are cached for five minutes per parameter
  set. Pass your own `queryClient` if you need different behaviour.

## Next

- [Data provider reference](../guides/data.md)
- [Supabase](./supabase.md)
