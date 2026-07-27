---
id: exports
title: API reference
sidebar_label: All exports
sidebar_position: 1
description: Every value exported by the PlugStore packages, with signatures and links to the guide that explains each one.
---

# API reference

Everything the two packages export. Types are on the
[types page](./types.md); the CLI is on [its own page](./cli.md).

```tsx
import { CatalogApp /* … */ } from '@neverleans-labs/plug-store-core';
import { defineTheme, themeConfigs } from '@neverleans-labs/plug-store-themes';
import '@neverleans-labs/plug-store-core/dist/index.css';
```

## Entry points

| Export | Signature | Guide |
|---|---|---|
| `CatalogApp` | `(props: CatalogAppProps) => JSX.Element` | [How it works](../architecture.md) |
| `CatalogProvider` | `(props: CatalogProviderProps) => JSX.Element` | [How it works](../architecture.md) |

### `CatalogAppProps`

| Prop | Type | Default |
|---|---|---|
| `defaultTheme` | `IndustryTemplate \| string` | `'fashion'` |
| `customTheme` | `ThemeConfig` | — |
| `config` | `CatalogConfig` | — |
| `defaultLanguage` | `'pt' \| 'en'` | stored, then `'pt'` |
| `dataProvider` | `CatalogDataProvider` | `dummyDataProvider` |
| `disableAdmin` | `boolean` | `false` |
| `basename` | `string` | — |

`CatalogProviderProps` is the same minus `disableAdmin` and `basename`, plus
`children` and `queryClient`.

## Data

| Export | Signature | Guide |
|---|---|---|
| `useProducts` | `(params?: DataProviderQueryParams, options?: { enabled?: boolean }) => UseProductsResult` | [Data](../guides/data.md) |
| `useCategories` | `() => UseCategoriesResult` | [Data](../guides/data.md) |
| `useProduct` | `(id?: string) => UseProductResult` | [Data](../guides/data.md) |
| `useProductReviews` | `(productId?: string) => UseProductReviewsResult` | [Data](../guides/data.md) |
| `useCatalogData` | `() => CatalogDataProvider` | [Data](../guides/data.md) |
| `dummyDataProvider` | `(industry?: IndustryTemplate) => CatalogDataProvider` | [Data](../guides/data.md) |
| `restDataProvider` | `(baseUrl: string, options?: { headers?: Record<string,string> }) => CatalogDataProvider` | [REST recipe](../recipes/rest-api.md) |
| `customDataProvider` | `(handlers: CatalogDataProvider) => CatalogDataProvider` | [Supabase recipe](../recipes/supabase.md) |
| `DataProviderWrapper` | component | — |

Direct access to the bundled demo dataset — rarely needed, and ignored when you
supply your own provider: `getProducts`, `getCategories`, `getReviews`,
`getFeaturedProducts`, `getProductById`, `getProductsByCategory`,
`getReviewsByProduct`, `searchProducts`, `setImportedProducts`,
`getImportedProducts`, `clearImportedProducts`.

## Checkout

| Export | Signature | Guide |
|---|---|---|
| `useCheckout` | `(options?: UseCheckoutOptions) => { processCheckout, loading, result, error }` | [Checkout](../guides/checkout.md) |
| `whatsappGateway` | `(phone?: string) => PaymentGatewayAdapter` | [Checkout](../guides/checkout.md) |
| `pixGateway` | `(keyOrOptions?: string \| PixGatewayOptions) => PaymentGatewayAdapter` | [Pix](../guides/pix.md) |
| `stripeGateway` | `(endpoint: string, options?) => PaymentGatewayAdapter` | [Checkout](../guides/checkout.md) |
| `mercadopagoGateway` | `(endpoint: string, options?) => PaymentGatewayAdapter` | [Checkout](../guides/checkout.md) |
| `buildPixPayload` | `(params: PixStaticParams) => string` | [Pix](../guides/pix.md) |
| `pixCrc16` | `(payload: string) => string` | [Pix](../guides/pix.md) |

## State hooks

| Export | Returns | Guide |
|---|---|---|
| `useCart` | `{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, discount, shippingCost, total, discountCode, setDiscountCode }` | [Cart](../guides/cart-wishlist.md) |
| `useWishlist` | `{ items, addItem, removeItem, isInWishlist, toggleItem }` | [Cart](../guides/cart-wishlist.md) |
| `useCompare` | `{ items, toggle, remove, clear, has, isFull }` | [Cart](../guides/cart-wishlist.md) |
| `useRecentlyViewed` | `{ items, add, clear }` | [Cart](../guides/cart-wishlist.md) |
| `useTheme` | `{ theme, template, setTemplate }` | [Themes](../guides/themes.md) |
| `useSiteConfig` | `{ config, updateConfig }` | [Configuration](../guides/configuration.md) |
| `useLanguage` | `{ t, language, setLanguage }` | [Language](../guides/i18n-currency.md) |
| `useColorMode` | light/dark state | — |
| `useAuth` | `{ user, isAuthenticated, login, logout }` | — |
| `useAccount` | orders, addresses, notify-me | — |
| `usePWA` | `{ isOffline, isInstalled, installPrompt, promptInstall }` | [PWA](../guides/pwa.md) |
| `useCatalogAnalytics` | installs GA4 / Meta Pixel | [Analytics](../guides/seo-analytics.md) |
| `useCatalogLink` | builds in-store links | — |
| `useMoney` | `(amount: number) => string`, plus `.currency` and `.symbol` | [Currency](../guides/i18n-currency.md) |

Every provider is also exported individually — `ThemeProvider`, `CartProvider`,
`WishlistProvider`, `CompareProvider`, `RecentlyViewedProvider`, `AuthProvider`,
`AccountProvider`, `SiteConfigProvider`, `LanguageProvider`, `ColorModeProvider`
— for the rare case where you want to compose them yourself instead of using
`CatalogProvider`.

## Components

**Layout** — `Header`, `Footer`

**Product** — `ProductCard`, `ProductCardSkeleton`, `QuickViewDialog`,
`RecentlyViewedRow`

**Cart** — `MiniCart`

**Common** — `SEOHead`, `CatalogSEO`, `ThemeSwitcher`, `CompareBar`,
`DarkModeToggle`, `WhatsAppOrderButton`, `PageTransition`, `AnalyticsInjector`,
`FaviconInjector`, `PWAOfflineBanner`

**Pages** — `HomePage`, `ProductsPage`, `ProductDetailPage`, `CartPage`,
`WishlistPage`, `CheckoutPage`, `OrderConfirmationPage`, `LoginPage`,
`SignupPage`, `AboutPage`, `ContactPage`, `ComparePage`, `AccountPage`,
`AdminPage`, `PublicCatalogPage`, `NotFound`

:::warning Components require the providers
Every one of these reads from a context. Rendering any of them outside
`CatalogProvider` throws.
:::

## Utilities

| Export | Signature |
|---|---|
| `formatMoney` | `(amount: number, currency?: CurrencyCode) => string` |
| `CURRENCIES` | `Record<CurrencyCode, { symbol, locale, code }>` |
| `trackEvent` | `(name: 'view_item' \| 'add_to_cart' \| 'begin_checkout' \| 'purchase', params?) => void` |
| `productsToCsv` | `(products: Product[]) => string` |
| `parseProductsCsv` | `(text: string, industry: string) => Product[]` |
| `downloadProductsCsv` | `(products: Product[], filename?: string) => void` |
| `openCatalogPrintable` | `(products: Product[], title: string) => void` |
| `safeImage` / `safeCategoryImage` | image URL fallbacks |
| `isLowStock` | `(product: Product) => boolean` |
| `panelClasses` | card style class helper |
| `localizeCategory` / `localizeTagline` / `localizeTemplate` / `templateLabels` | [i18n](../guides/i18n-currency.md) |
| `themeConfigs` | `Record<string, ThemeConfig>` — the 50 built-in themes, keyed by id. Use `Object.values()` to iterate |

## The themes package

| Export | Signature |
|---|---|
| `defineTheme` | `(config: Partial<ThemeConfig> & { id, name, tagline }) => ThemeConfig` |
| `defaultThemeBase` | the base every custom theme extends |
| `themeConfigs` | re-exported from core, so both import paths give the same registry |

## Next

- [Types](./types.md)
- [CLI flags](./cli.md)
