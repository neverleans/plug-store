---
id: configuration
title: Store configuration
sidebar_label: Configuration
sidebar_position: 1
description: Every option in CatalogConfig — store identity, currency, WhatsApp, Pix, social links and analytics — and how runtime configuration overrides it.
---

# Store configuration

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

A store that shows your brand, your contact channels and your payment details,
and an understanding of why the admin panel can override any of it.

</div>

## Passing config

`config` accepts a `CatalogConfig` object. Every field is optional.

```tsx
<CatalogApp
  config={{
    companyName: 'Bloom Cosmetics',
    tagline: 'Clean beauty, delivered',
    currency: 'BRL',
    whatsappPhone: '5511999998888',
    pixKey: 'bloom@example.com',
    pixMerchantCity: 'Sao Paulo',
  }}
/>
```

## Every option

### Identity

| Option | Type | Shown where |
|---|---|---|
| `companyName` | `string` | Header logo text, footer, order messages. Falls back to the theme's name |
| `tagline` | `string` | Footer, under the brand. Falls back to the theme's tagline |
| `footerText` | `string` | Footer copyright line |
| `shippingBanner` | `string` | The thin bar above the header |
| `logoDataUrl` | `string` | Base64 image next to the brand name in the header |
| `faviconDataUrl` | `string` | Base64 image injected as the page favicon |

### Contact and social

| Option | Type | Notes |
|---|---|---|
| `contactEmail` | `string` | Footer and contact page |
| `contactPhone` | `string` | Footer and contact page |
| `address` | `string` | Footer and contact page |
| `whatsappPhone` | `string` | **Digits only, with country code** — `5511999998888`. Powers the footer icon, the floating order button and WhatsApp checkout |
| `instagramUrl` | `string` | Full URL |
| `tiktokUrl` | `string` | Full URL |
| `facebookUrl` | `string` | Full URL |

### Commerce

| Option | Type | Notes |
|---|---|---|
| `currency` | `'BRL' \| 'USD' \| 'EUR'` | Formatting only — see [Currency](./i18n-currency.md). Prices are never converted |
| `pixKey` | `string` | CPF, CNPJ, e-mail, phone or random key. Enables the Pix option at checkout |
| `pixMerchantCity` | `string` | Max 15 characters, ASCII. Defaults to `BRASIL` if empty |
| `publicSlug` | `string` | Public catalog route: `my-store` serves `/c/my-store` |

:::info Pix requires BRL
The checkout only offers Pix when `currency` is `BRL` **and** `pixKey` is set.
A Pix code in euros would not be payable.
:::

### Analytics

| Option | Type | Notes |
|---|---|---|
| `gaId` | `string` | GA4 measurement id, `G-XXXXXXXX` |
| `metaPixelId` | `string` | Numeric Meta Pixel id |

Setting either injects the script and starts emitting `view_item`,
`add_to_cart`, `begin_checkout` and `purchase`. See
[Analytics](./seo-analytics.md).

## Config is a seed, not a lock

This surprises people, so it is worth being explicit.

`config` is **merged into `localStorage` when the provider mounts**, under the
key `ecom-site-config`. From that moment the store reads the stored copy, which
the built-in admin panel can edit at runtime.

Consequences:

- Changing a value in `config` and reloading **does** update the store, because
  the merge runs on every mount and your prop wins.
- Anything an admin changed in the panel persists in that browser until the same
  key is passed in `config` again.
- Clearing site data resets the store to whatever `config` says.

To inspect or change configuration from your own components:

```tsx
import { useSiteConfig } from '@neverleans-labs/plug-store-core';

function ShippingNotice() {
  const { config, updateConfig } = useSiteConfig();

  return (
    <button onClick={() => updateConfig({ shippingBanner: 'Free shipping today' })}>
      {config.shippingBanner}
    </button>
  );
}
```

## Coupons

Coupons live in runtime config rather than in `CatalogConfig`, because they are
something a store owner changes often. Four ship by default:

| Code | Effect |
|---|---|
| `SAVE10` | 10% off |
| `SAVE20` | 20% off |
| `WELCOME5` | 5 off the total |
| `FREESHIP` | Removes the shipping cost |

Replace them through `updateConfig`:

```tsx
const { updateConfig } = useSiteConfig();

updateConfig({
  coupons: [
    { code: 'BLOOM15', type: 'percent', value: 15, label: '15% off' },
    { code: 'FRETEGRATIS', type: 'flat', value: 0, label: 'Free shipping' },
  ],
});
```

## Other provider props

These sit next to `config`, not inside it:

| Prop | Type | Purpose |
|---|---|---|
| `defaultTheme` | `string` | Starting theme id — see [Themes](./themes.md) |
| `customTheme` | `ThemeConfig` | A theme built with `defineTheme` |
| `defaultLanguage` | `'pt' \| 'en'` | Initial UI language |
| `dataProvider` | `CatalogDataProvider` | Your backend — see [Data providers](./data.md) |
| `queryClient` | `QueryClient` | Share a react-query cache with the host app |

## Next

- [Pick or build a theme](./themes.md)
- [Connect your backend](./data.md)
