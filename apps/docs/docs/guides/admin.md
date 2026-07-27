---
id: admin
title: Admin panel
sidebar_label: Admin panel
sidebar_position: 10
description: The built-in /admin route — what it can change, how CSV import and export work, and why it is not a substitute for a real backoffice.
---

# Admin panel

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

A store your client can adjust themselves — and a clear-eyed view of what that
panel is and is not.

</div>

## What it is

`<CatalogApp />` mounts an admin screen at `/admin` with four tabs:

| Tab | Lets the owner change |
|---|---|
| Dashboard | An overview of the current catalog |
| Settings | Store identity, contact, WhatsApp, Pix, currency, logo, favicon, analytics ids |
| Catalog | Import and export products as CSV, print a catalog sheet |
| Marketing | Coupon codes and their values |

Everything it writes goes to `localStorage` under `ecom-site-config` and
`ecom-imported-products`.

:::danger This is browser-local, and unprotected
There is **no authentication** on `/admin`, and nothing it saves leaves the
visitor's browser. It is a convenience for a single-operator store, a demo, or a
client preview — not a backoffice.

For anything real: disable the route, and manage data through your
[data provider](./data.md).
:::

```tsx
<CatalogApp disableAdmin />
```

## CSV import and export

The catalog tab reads and writes CSV, which is how a small store owner actually
maintains a product list.

```tsx
import {
  productsToCsv,
  parseProductsCsv,
  downloadProductsCsv,
  openCatalogPrintable,
} from '@neverleans-labs/plug-store-core';

// Export
downloadProductsCsv(products, 'catalog.csv');

// Or get the string
const csv = productsToCsv(products);

// Import
const products = parseProductsCsv(csvText, 'fashion');

// A print-ready catalog sheet in a new window
openCatalogPrintable(products, 'Bloom Cosmetics');
```

Imported products are stored per theme id and merged over the demo catalog:

```tsx
import {
  setImportedProducts,
  getImportedProducts,
  clearImportedProducts,
} from '@neverleans-labs/plug-store-core';

setImportedProducts('fashion', products);
clearImportedProducts('fashion');
```

:::info Import affects the demo provider only
These functions write to browser storage that the bundled demo provider reads.
When you supply your own `dataProvider`, it is the source of truth and imported
products are not consulted. Import into your backend instead.
:::

## Preview as customer

Settings includes a "preview as customer" toggle, stored as
`previewAsCustomer`. It hides owner-only affordances so a client can look at
their store the way a shopper will.

## Replacing it

The panel is a normal page, so the usual approach for a real project is to
disable it and build your own behind your auth:

```tsx
<CatalogProvider dataProvider={provider}>
  <Routes>
    <Route path="/*" element={<StoreFront />} />
    <Route path="/manage/*" element={<RequireAuth><MyAdmin /></RequireAuth>} />
  </Routes>
</CatalogProvider>
```

Inside it, `useSiteConfig().updateConfig` gives you the same levers the built-in
panel uses.

## Next

- [Store configuration](./configuration.md)
- [Data providers](./data.md)
