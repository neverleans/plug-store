---
id: exports
title: Referência da API
sidebar_label: Todos os exports
sidebar_position: 1
description: Todo valor exportado pelos pacotes do PlugStore, com assinaturas e links para o guia que explica cada um.
---

# Referência da API

Tudo que os dois pacotes exportam. Os tipos estão na
[página de tipos](./types.md); a CLI tem [página própria](./cli.md).

```tsx
import { CatalogApp /* … */ } from '@neverleans-labs/plug-store-core';
import { defineTheme, themeConfigs } from '@neverleans-labs/plug-store-themes';
import '@neverleans-labs/plug-store-core/dist/index.css';
```

## Pontos de entrada

| Export | Assinatura | Guia |
|---|---|---|
| `CatalogApp` | `(props: CatalogAppProps) => JSX.Element` | [Como funciona](../architecture.md) |
| `CatalogProvider` | `(props: CatalogProviderProps) => JSX.Element` | [Como funciona](../architecture.md) |

### `CatalogAppProps`

| Prop | Tipo | Padrão |
|---|---|---|
| `defaultTheme` | `IndustryTemplate \| string` | `'fashion'` |
| `customTheme` | `ThemeConfig` | — |
| `config` | `CatalogConfig` | — |
| `defaultLanguage` | `'pt' \| 'en'` | o guardado, depois `'pt'` |
| `dataProvider` | `CatalogDataProvider` | `dummyDataProvider` |
| `disableAdmin` | `boolean` | `false` |
| `basename` | `string` | — |

`CatalogProviderProps` é o mesmo sem `disableAdmin` e `basename`, mais
`children` e `queryClient`.

## Dados

| Export | Assinatura | Guia |
|---|---|---|
| `useProducts` | `(params?: DataProviderQueryParams, options?: { enabled?: boolean }) => UseProductsResult` | [Dados](../guides/data.md) |
| `useCategories` | `() => UseCategoriesResult` | [Dados](../guides/data.md) |
| `useProduct` | `(id?: string) => UseProductResult` | [Dados](../guides/data.md) |
| `useProductReviews` | `(productId?: string) => UseProductReviewsResult` | [Dados](../guides/data.md) |
| `useCatalogData` | `() => CatalogDataProvider` | [Dados](../guides/data.md) |
| `dummyDataProvider` | `(industry?: IndustryTemplate) => CatalogDataProvider` | [Dados](../guides/data.md) |
| `restDataProvider` | `(baseUrl: string, options?: { headers?: Record<string,string> }) => CatalogDataProvider` | [Receita REST](../recipes/rest-api.md) |
| `customDataProvider` | `(handlers: CatalogDataProvider) => CatalogDataProvider` | [Receita Supabase](../recipes/supabase.md) |
| `DataProviderWrapper` | componente | — |

Acesso direto ao conjunto de dados de demonstração — raramente necessário, e
ignorado quando você fornece o seu provider: `getProducts`, `getCategories`,
`getReviews`, `getFeaturedProducts`, `getProductById`, `getProductsByCategory`,
`getReviewsByProduct`, `searchProducts`, `setImportedProducts`,
`getImportedProducts`, `clearImportedProducts`.

## Checkout

| Export | Assinatura | Guia |
|---|---|---|
| `useCheckout` | `(options?: UseCheckoutOptions) => { processCheckout, loading, result, error }` | [Checkout](../guides/checkout.md) |
| `whatsappGateway` | `(phone?: string) => PaymentGatewayAdapter` | [Checkout](../guides/checkout.md) |
| `pixGateway` | `(keyOrOptions?: string \| PixGatewayOptions) => PaymentGatewayAdapter` | [Pix](../guides/pix.md) |
| `stripeGateway` | `(endpoint: string, options?) => PaymentGatewayAdapter` | [Checkout](../guides/checkout.md) |
| `mercadopagoGateway` | `(endpoint: string, options?) => PaymentGatewayAdapter` | [Checkout](../guides/checkout.md) |
| `buildPixPayload` | `(params: PixStaticParams) => string` | [Pix](../guides/pix.md) |
| `pixCrc16` | `(payload: string) => string` | [Pix](../guides/pix.md) |

## Hooks de estado

| Export | Devolve | Guia |
|---|---|---|
| `useCart` | `{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, discount, shippingCost, total, discountCode, setDiscountCode }` | [Carrinho](../guides/cart-wishlist.md) |
| `useWishlist` | `{ items, addItem, removeItem, isInWishlist, toggleItem }` | [Carrinho](../guides/cart-wishlist.md) |
| `useCompare` | `{ items, toggle, remove, clear, has, isFull }` | [Carrinho](../guides/cart-wishlist.md) |
| `useRecentlyViewed` | `{ items, add, clear }` | [Carrinho](../guides/cart-wishlist.md) |
| `useTheme` | `{ theme, template, setTemplate }` | [Temas](../guides/themes.md) |
| `useSiteConfig` | `{ config, updateConfig }` | [Configuração](../guides/configuration.md) |
| `useLanguage` | `{ t, language, setLanguage }` | [Idioma](../guides/i18n-currency.md) |
| `useColorMode` | estado claro/escuro | — |
| `useAuth` | `{ user, isAuthenticated, login, logout }` | — |
| `useAccount` | pedidos, endereços, avise-me | — |
| `usePWA` | `{ isOffline, isInstalled, installPrompt, promptInstall }` | [PWA](../guides/pwa.md) |
| `useCatalogAnalytics` | instala GA4 / Meta Pixel | [Analytics](../guides/seo-analytics.md) |
| `useCatalogLink` | monta links internos da loja | — |
| `useMoney` | `(amount: number) => string`, mais `.currency` e `.symbol` | [Moeda](../guides/i18n-currency.md) |

Todo provider também é exportado individualmente — `ThemeProvider`,
`CartProvider`, `WishlistProvider`, `CompareProvider`,
`RecentlyViewedProvider`, `AuthProvider`, `AccountProvider`,
`SiteConfigProvider`, `LanguageProvider`, `ColorModeProvider` — para o caso raro
em que você queira compor à mão em vez de usar o `CatalogProvider`.

## Componentes

**Layout** — `Header`, `Footer`

**Produto** — `ProductCard`, `ProductCardSkeleton`, `QuickViewDialog`,
`RecentlyViewedRow`

**Carrinho** — `MiniCart`

**Comuns** — `SEOHead`, `CatalogSEO`, `ThemeSwitcher`, `CompareBar`,
`DarkModeToggle`, `WhatsAppOrderButton`, `PageTransition`, `AnalyticsInjector`,
`FaviconInjector`, `PWAOfflineBanner`

**Páginas** — `HomePage`, `ProductsPage`, `ProductDetailPage`, `CartPage`,
`WishlistPage`, `CheckoutPage`, `OrderConfirmationPage`, `LoginPage`,
`SignupPage`, `AboutPage`, `ContactPage`, `ComparePage`, `AccountPage`,
`AdminPage`, `PublicCatalogPage`, `NotFound`

:::warning Os componentes exigem os providers
Todos eles leem de um contexto. Renderizar qualquer um fora do
`CatalogProvider` lança erro.
:::

## Utilitários

| Export | Assinatura |
|---|---|
| `formatMoney` | `(amount: number, currency?: CurrencyCode) => string` |
| `CURRENCIES` | `Record<CurrencyCode, { symbol, locale, code }>` |
| `trackEvent` | `(name: 'view_item' \| 'add_to_cart' \| 'begin_checkout' \| 'purchase', params?) => void` |
| `productsToCsv` | `(products: Product[]) => string` |
| `parseProductsCsv` | `(text: string, industry: string) => Product[]` |
| `downloadProductsCsv` | `(products: Product[], filename?: string) => void` |
| `openCatalogPrintable` | `(products: Product[], title: string) => void` |
| `safeImage` / `safeCategoryImage` | fallbacks de URL de imagem |
| `isLowStock` | `(product: Product) => boolean` |
| `panelClasses` | helper de classe do estilo de card |
| `localizeCategory` / `localizeTagline` / `localizeTemplate` / `templateLabels` | [i18n](../guides/i18n-currency.md) |
| `themeConfigs` | `Record<string, ThemeConfig>` — os 50 temas, indexados por id. Use `Object.values()` para iterar |

## O pacote de temas

| Export | Assinatura |
|---|---|
| `defineTheme` | `(config: Partial<ThemeConfig> & { id, name, tagline }) => ThemeConfig` |
| `defaultThemeBase` | a base que todo tema customizado estende |
| `themeConfigs` | reexportado do core, então os dois caminhos de import dão o mesmo registro |

## Próximos passos

- [Tipos](./types.md)
- [Flags da CLI](./cli.md)
