---
id: types
title: Tipos
sidebar_label: Tipos
sidebar_position: 2
description: Todos os tipos TypeScript exportados pelo PlugStore — Product, Category, CartItem, ShippingInfo, Order, ThemeConfig, CatalogConfig e os tipos de checkout.
---

# Tipos

Todos são exportados de `@neverleans-labs/plug-store-core`.

```ts
import type { Product, ShippingInfo, ThemeConfig } from '@neverleans-labs/plug-store-core';
```

## Catálogo

```ts
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;                 // na moeda da loja, não em centavos
  originalPrice?: number;        // quando maior que price, aparece selo de desconto
  images: string[];              // URLs absolutas; [0] é a imagem do card
  category: string;              // bate com Category.name, não com o slug
  subcategory?: string;
  rating: number;                // 0 a 5
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
  slug: string;                  // aparece em /products?category=…
  image: string;
  industry: IndustryTemplate;
}

interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;                  // data ISO
}
```

## Carrinho e pedidos

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

O `createOrder` de um data provider recebe
`Omit<Order, 'id' | 'date' | 'status'>` — esses três são você quem define.

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
  merchantName: string;         // truncado em 25 caracteres, ASCII
  merchantCity: string;         // truncado em 15 caracteres, ASCII
  amount?: number;              // omita para o pagador definir
  txid?: string;                // padrão '***'
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

Resultados dos hooks:

```ts
interface UseProductsResult {
  products: Product[];           // nunca undefined
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// UseCategoriesResult → { categories: Category[], … }
// UseProductResult    → { product: Product | null, … }
// UseProductReviewsResult → { reviews: Review[], … }
```

## Temas

```ts
interface ThemeConfig {
  id: string;
  name: string;
  tagline: string;
  colors: {
    primary: string;             // canais HSL: "340 65% 52%"
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

// Os 50 ids prontos, alargado com `| string` para permitir um id customizado.
type IndustryTemplate = 'fashion' | 'electronics' | /* … */ | string;

// O registro de temas é indexado por id, não é um array:
declare const themeConfigs: Record<string, ThemeConfig>;
```

## Configuração

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

`CatalogConfig` está documentado campo a campo na página de
[Configuração](../guides/configuration.md). `SiteConfig` é a contraparte em
runtime: os mesmos campos, todos obrigatórios, mais `coupons` e
`previewAsCustomer`.

## Próximos passos

- [Todos os exports](./exports.md)
- [CLI](./cli.md)
