---
id: data
title: Data providers
sidebar_label: Data & your backend
sidebar_position: 3
description: Connect PlugStore to your own REST API, Supabase, Firebase, Prisma or GraphQL backend by implementing five async functions.
---

# Data providers

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

Your own products rendering in the storefront, coming from your backend instead
of the bundled demo catalog.

</div>

## The contract

A data provider is a plain object with five functions. Two are required.

```ts
interface CatalogDataProvider {
  getProducts:     (params?: DataProviderQueryParams) => Promise<Product[]>;
  getProductById:  (id: string) => Promise<Product | null>;
  getCategories:   () => Promise<Category[]>;
  getReviews?:     (productId: string) => Promise<Review[]>;
  createOrder?:    (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<Order>;
}
```

```ts
interface DataProviderQueryParams {
  category?: string;   // matches Product.category by name
  search?:   string;
  limit?:    number;
  featured?: boolean;
}
```

`getReviews` and `createOrder` are optional. Omit `getReviews` and the product
page simply shows no reviews — it does not throw. Omit `createOrder` and orders
are not persisted anywhere; checkout still produces its payment artifact.

## Mount it

Pass the provider to `CatalogApp` or `CatalogProvider`. Everything the
storefront renders then comes from it: the home page's featured row, the
products grid, the product page, related products, the header search
suggestions and the footer categories.

```tsx
import { CatalogApp, restDataProvider } from '@neverleans-labs/plug-store-core';

export default function App() {
  return (
    <CatalogApp
      dataProvider={restDataProvider('https://api.my-store.com/v1')}
      config={{ companyName: 'My Store' }}
    />
  );
}
```

Pass nothing and you get `dummyDataProvider`, which serves the bundled demo
catalog matching the active theme. That is what makes a fresh install look like
a real store immediately.

## The bundled REST provider

`restDataProvider(baseUrl, options?)` expects these routes:

| Provider call | Request |
|---|---|
| `getProducts({ category, search, featured, limit })` | `GET {baseUrl}/products?category=…&search=…&featured=true&limit=…` |
| `getProductById(id)` | `GET {baseUrl}/products/{id}` |
| `getCategories()` | `GET {baseUrl}/categories` |
| `getReviews(productId)` | `GET {baseUrl}/products/{productId}/reviews` |
| `createOrder(order)` | `POST {baseUrl}/orders` |

Add headers when your API needs them:

```ts
restDataProvider('https://api.my-store.com/v1', {
  headers: { Authorization: `Bearer ${token}` },
});
```

A non-2xx response throws, which surfaces as the error state on the hooks below.

## Anything else

`customDataProvider` is an identity helper that gives you the type checking
without prescribing a transport. Use it for Supabase, Firebase, Prisma, GraphQL
or a hand-rolled `fetch`.

```ts
import { customDataProvider } from '@neverleans-labs/plug-store-core';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, anonKey);

export const provider = customDataProvider({
  async getProducts(params) {
    let query = supabase.from('products').select('*');
    if (params?.category) query = query.eq('category', params.category);
    if (params?.featured) query = query.eq('featured', true);
    if (params?.search) query = query.ilike('name', `%${params.search}%`);
    if (params?.limit) query = query.limit(params.limit);

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async getProductById(id) {
    const { data } = await supabase.from('products').select('*').eq('id', id).single();
    return data ?? null;
  },

  async getCategories() {
    const { data } = await supabase.from('categories').select('*');
    return data ?? [];
  },
});
```

See the [Supabase recipe](../recipes/supabase.md) for the table schema.

## The shape your backend must return

`getProducts` and `getProductById` must return objects matching `Product`:

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` | ✅ | Used in URLs — keep it slug-safe |
| `name` | `string` | ✅ | |
| `description` | `string` | ✅ | |
| `price` | `number` | ✅ | In the store's currency, not cents |
| `originalPrice` | `number` | | When higher than `price`, a discount badge appears |
| `images` | `string[]` | ✅ | Absolute URLs. First one is the card image |
| `category` | `string` | ✅ | Must match a `Category.name`, not its slug |
| `subcategory` | `string` | | |
| `rating` | `number` | ✅ | 0–5 |
| `reviewCount` | `number` | ✅ | |
| `variants` | `ProductVariant[]` | | `{ id, name, type, options }` |
| `tags` | `string[]` | ✅ | Drive the tag filter on the products page |
| `inStock` | `boolean` | ✅ | |
| `industry` | `string` | ✅ | The theme id this product belongs to |
| `featured` | `boolean` | | Featured row on the home page |

`getCategories` returns `Category`: `{ id, name, slug, image, industry }`. The
`slug` is what appears in `/products?category=…`; the `name` is what products
reference.

:::warning `category` matches by name
`Product.category` is compared against `Category.name`, not `Category.slug`.
If your backend stores slugs, map them before returning.
:::

## Reading data in your own components

Six exported hooks wrap the active provider with caching, deduplication and
loading state. These are exactly what the built-in pages use.

```tsx
import { useProducts, useCategories, useProduct } from '@neverleans-labs/plug-store-core';

function FeaturedRow() {
  const { products, isLoading, isError } = useProducts({ featured: true, limit: 8 });

  if (isLoading) return <GridSkeleton />;
  if (isError) return <p>Could not load products.</p>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

| Hook | Returns |
|---|---|
| `useProducts(params?, options?)` | `{ products, isLoading, isError, error }` |
| `useCategories()` | `{ categories, isLoading, isError, error }` |
| `useProduct(id)` | `{ product, isLoading, isError, error }` |
| `useProductReviews(productId)` | `{ reviews, isLoading, isError, error }` |

`products`, `categories` and `reviews` are never `undefined` — they default to
an empty array, so you can map over them on the first render.

Pass `{ enabled: false }` as the second argument to `useProducts` to hold a
request back until its parameters are ready:

```tsx
const { product } = useProduct(id);
const { products: related } = useProducts(
  product ? { category: product.category } : undefined,
  { enabled: Boolean(product) },
);
```

### Reaching the provider directly

`useCatalogData()` returns the provider object itself, for imperative calls
outside of rendering:

```tsx
const provider = useCatalogData();
const results = await provider.getProducts({ search: term });
```

Prefer the hooks for anything you render — they cache, and they give you the
loading and error states for free.

## Caching

Results are cached per provider and per parameter set, and considered fresh for
five minutes. Switching themes invalidates the demo provider's cache, because
its data is theme-specific; a custom provider keeps its cache when the visitor
changes the look of the store.

To share one cache with a host app that already uses react-query, pass your
client in:

```tsx
<CatalogProvider queryClient={myQueryClient} dataProvider={provider}>
```

## Next

- [Connect a REST API step by step](../recipes/rest-api.md)
- [Connect Supabase](../recipes/supabase.md)
- [Checkout and orders](./checkout.md)
