---
id: types
title: Types
sidebar_label: Types
sidebar_position: 2
description: Every exported TypeScript type in PlugStore — Product, Category, CartItem, ShippingInfo, Order, ThemeConfig, CatalogConfig and the checkout types.
---

# Types

All of these are exported from `@neverleans-labs/plug-store-core`.

```ts
import type { Product, ShippingInfo, ThemeConfig } from '@neverleans-labs/plug-store-core';
```

## Catalog

```ts
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;                 // in the store currency, not cents
  originalPrice?: number;        // when set and higher, shows a discount badge
  images: string[];              // absolute URLs; [0] is the card image
  category: string;              // matches Category.name, not its slug
  subcategory?: string;
  rating: number;                // 0–5
  reviewCount: number;
  variants?: ProductVariant[];
  tags: string[];
  inStock: boolean;
  industry: IndustryTemplate;
  featured?: boolean;
}

interface ProductVariant {
  id: string;
  name: string;
  type: 'size' | 'color' | 'weight' | 'material' | 'flavor';
  options: string[];
}

interface Category {
  id: string;
  name: string;
  slug: string;                  // appears in /products?category=…
  image: string;
  industry: IndustryTemplate;
}

interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;                  // ISO date
}
```

## Cart and orders

```ts
interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Order {
  id: string;
  items: CartItem[];
  shipping: ShippingInfo;
  total: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
```

`createOrder` on a data provider receives `Omit<Order, 'id' | 'date' | 'status'>`
— you assign those three.

## Checkout

```ts
type PaymentMethod = 'whatsapp' | 'pix' | 'stripe' | 'mercadopago';

interface CheckoutPayload {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  notes?: string;
}

interface PaymentResult {
  success: boolean;
  orderId?: string;
  paymentUrl?: string;
  pixCode?: string;
  pixQrCodeUrl?: string;
  whatsappUrl?: string;
  error?: string;
}

type PaymentGatewayAdapter = (payload: CheckoutPayload) => Promise<PaymentResult>;

interface UseCheckoutOptions {
  adapters?: Partial<Record<PaymentMethod, PaymentGatewayAdapter>>;
  autoRedirect?: boolean;
}

interface PixGatewayOptions {
  pixKey?: string;
  merchantName?: string;
  merchantCity?: string;
}

interface PixStaticParams {
  pixKey: string;
  merchantName: string;         // truncated to 25 chars, ASCII-folded
  merchantCity: string;         // truncated to 15 chars, ASCII-folded
  amount?: number;              // omit for a payer-defined amount
  txid?: string;                // defaults to '***'
}
```

## Data providers

```ts
interface CatalogDataProvider {
  getProducts: (params?: DataProviderQueryParams) => Promise<Product[]>;
  getProductById: (id: string) => Promise<Product | null>;
  getCategories: () => Promise<Category[]>;
  getReviews?: (productId: string) => Promise<Review[]>;
  createOrder?: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<Order>;
}

interface DataProviderQueryParams {
  category?: string;
  search?: string;
  limit?: number;
  featured?: boolean;
}
```

Hook results:

```ts
interface UseProductsResult {
  products: Product[];           // never undefined
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// UseCategoriesResult → { categories: Category[], … }
// UseProductResult    → { product: Product | null, … }
// UseProductReviewsResult → { reviews: Review[], … }
```

## Theming

```ts
interface ThemeConfig {
  id: string;
  name: string;
  tagline: string;
  colors: {
    primary: string;             // HSL channels: "340 65% 52%"
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    heroGradientFrom: string;
    heroGradientTo: string;
  };
  fonts: { heading: string; body: string };
  heroStyle:
    | 'fullwidth' | 'split' | 'centered' | 'overlay' | 'minimal'
    | 'energetic' | 'editorial' | 'playful' | 'industrial' | 'gallery';
  cardStyle:
    | 'rounded' | 'sharp' | 'elevated' | 'bordered' | 'minimal'
    | 'tilted' | 'paper' | 'soft' | 'metal' | 'frame';
  navStyle: 'standard' | 'centered' | 'minimal' | 'bold' | 'elegant';
  heroImage?: string;
}

// The 50 built-in ids, widened with `| string` so a custom id is allowed.
type IndustryTemplate = 'fashion' | 'electronics' | /* … */ | string;

// The built-in registry is keyed by id, not an array:
declare const themeConfigs: Record<string, ThemeConfig>;
```

## Configuration

```ts
type CurrencyCode = 'BRL' | 'USD' | 'EUR';
type Language = 'pt' | 'en';

interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  label: string;
}
```

`CatalogConfig` is documented field by field on the
[Configuration](../guides/configuration.md) page. `SiteConfig` is its runtime
counterpart: the same fields, all required, plus `coupons` and
`previewAsCustomer`.

## Next

- [All exports](./exports.md)
- [CLI](./cli.md)
