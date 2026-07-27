---
id: seo-analytics
title: SEO and analytics
sidebar_label: SEO & analytics
sidebar_position: 9
description: JSON-LD product structured data, OpenGraph and Twitter cards, and zero-config GA4 and Meta Pixel e-commerce events.
---

# SEO and analytics

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

Products that produce rich results in search, links that preview properly when
shared, and purchase funnels visible in GA4 and Meta.

</div>

## Structured data and meta tags

`CatalogSEO` emits everything a product page needs. The built-in pages already
render it; use it directly when you build your own.

```tsx
import { CatalogSEO } from '@neverleans-labs/plug-store-core';

function MyProductPage({ product }) {
  return (
    <>
      <CatalogSEO product={product} />
      {/* … */}
    </>
  );
}
```

| Prop | Purpose |
|---|---|
| `product` | Generates `Schema.org/Product` JSON-LD with price, availability and rating |
| `title` | Appended to the store name; falls back to name + tagline |
| `description` | Falls back to the product description, then the footer text |
| `image` | Falls back to the product's first image, then the logo |
| `url` | Falls back to the current location |

It writes the meta description, OpenGraph tags, Twitter card tags and the JSON-LD
script in one pass. Values come from your [config](./configuration.md), so
filling in `companyName` and `tagline` improves every page at once.

For a page that is not a product, `SEOHead` is the lower-level component —
`title`, `description`, `canonical`, `image`, `url` and a raw `jsonLd` object.

:::info This is a client-rendered SPA
Google executes JavaScript and does index this correctly, but crawlers that do
not will see an empty shell. If organic search is your main acquisition channel
at large catalog sizes, prerender or use a server-rendered framework — see
[when not to use PlugStore](../intro.md).
:::

## Analytics

Set either id in config and the script is injected and events start flowing:

```tsx
<CatalogApp
  config={{
    gaId: 'G-XXXXXXXXXX',
    metaPixelId: '1234567890',
  }}
/>
```

Four e-commerce events are emitted automatically:

| PlugStore event | GA4 | Meta Pixel |
|---|---|---|
| Product page viewed | `view_item` | `ViewContent` |
| Added to cart | `add_to_cart` | `AddToCart` |
| Checkout started | `begin_checkout` | `InitiateCheckout` |
| Order completed | `purchase` | `Purchase` |

`begin_checkout` and `purchase` carry the value, the currency and the full item
list, so GA4's monetisation reports work without extra setup.

### Tracking your own events

```tsx
import { trackEvent } from '@neverleans-labs/plug-store-core';

trackEvent('add_to_cart', {
  value: product.price,
  currency: 'BRL',
  items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity: 1 }],
});
```

`trackEvent` accepts the four event names above and forwards to both platforms,
mapping the name for Meta. It is a no-op when neither script is loaded, so it is
safe to call unconditionally — including during development and in tests.

To install the scripts from your own component tree, call `useCatalogAnalytics()`
once near the root. `AnalyticsInjector` does exactly that and is already
mounted by `CatalogApp`.

## Favicon

`FaviconInjector` writes `config.faviconDataUrl` into the document head at
runtime, which is how the admin panel can change the favicon without a rebuild.
A static favicon in `index.html` still works and is preferable when you control
the build.

## Next

- [Store configuration](./configuration.md)
- [Deploy](../getting-started/deploy.md)
