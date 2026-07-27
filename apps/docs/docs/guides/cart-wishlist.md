---
id: cart-wishlist
title: Cart, wishlist and comparison
sidebar_label: Cart & wishlist
sidebar_position: 6
description: The useCart, useWishlist, useCompare and useRecentlyViewed hooks — their full API, how totals are computed, and where the state is persisted.
---

# Cart, wishlist and comparison

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

You can drive the cart from your own components and trust the totals the
checkout uses.

</div>

## `useCart`

```tsx
import { useCart } from '@neverleans-labs/plug-store-core';

function AddToCart({ product }) {
  const { addItem, itemCount } = useCart();

  return (
    <button onClick={() => addItem(product, 1)}>
      Add to cart ({itemCount})
    </button>
  );
}
```

| Member | Type | Notes |
|---|---|---|
| `items` | `CartItem[]` | `{ product, quantity, selectedVariants? }` |
| `addItem` | `(product, quantity?, variants?) => void` | Adding the same product and variants increases the quantity |
| `removeItem` | `(productId) => void` | |
| `updateQuantity` | `(productId, quantity) => void` | Zero removes the line |
| `clearCart` | `() => void` | Called automatically after a successful checkout |
| `itemCount` | `number` | Sum of quantities, not distinct lines |
| `subtotal` | `number` | Line prices × quantities |
| `discount` | `number` | Amount removed by the applied coupon |
| `shippingCost` | `number` | |
| `total` | `number` | `subtotal − discount + shippingCost` |
| `discountCode` | `string` | Currently applied coupon code |
| `setDiscountCode` | `(code) => void` | Validates against the configured coupons |

:::warning Use `total`, never recompute it
`total` already includes discount and shipping. A checkout screen that adds
shipping on top of `total` charges it twice — which is exactly the bug the
built-in checkout page once had.
:::

## `useWishlist`

```tsx
const { items, addItem, removeItem, isInWishlist, toggleItem } = useWishlist();
```

`toggleItem(product)` is what the heart button on `ProductCard` calls.
`isInWishlist(productId)` returns a boolean.

## `useCompare`

```tsx
const { items, toggle, remove, clear, has, isFull } = useCompare();
```

The comparison list is capped; `isFull` tells you when adding another would be
rejected, so you can disable the control instead of failing silently. The
`/compare` route renders a side-by-side table of whatever is in the list, and
`CompareBar` is the floating summary bar.

## `useRecentlyViewed`

```tsx
const { items, add, clear } = useRecentlyViewed();
```

`ProductDetailPage` calls `add(product)` on mount. `RecentlyViewedRow` renders
the strip.

## Persistence

All four persist to `localStorage` and rehydrate on the next visit:

| Hook | Key |
|---|---|
| `useCart` | `ecom-cart` |
| `useWishlist` | `ecom-wishlist` |
| `useCompare` | `ecom-compare` |
| `useRecentlyViewed` | `ecom-recently-viewed` |

The stored value holds whole product objects, not just ids, so a cart survives
even if a product later disappears from the backend. The flip side is that a
price change is not reflected in an old cart until the item is re-added —
re-validate server-side before charging.

## Coupons

`setDiscountCode` checks the code against the coupons in
[runtime config](./configuration.md#coupons). A `percent` coupon takes that
percentage off the subtotal; a `flat` coupon subtracts its value, and a `flat`
coupon with `value: 0` is how free shipping is expressed.

```tsx
const { setDiscountCode, discount, discountCode } = useCart();

setDiscountCode('SAVE10');
// discount is now 10% of the subtotal
```

## Next

- [Checkout](./checkout.md)
- [Currency formatting](./i18n-currency.md)
