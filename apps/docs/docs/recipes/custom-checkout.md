---
id: custom-checkout
title: Build a custom checkout
sidebar_label: Custom checkout
sidebar_position: 3
description: Replace the built-in checkout page with your own form and payment provider, using useCheckout and a custom payment adapter.
---

# Build a custom checkout

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

Your own checkout UI and your own payment provider, with PlugStore still
handling the cart, totals, analytics and order persistence.

</div>

## When you need this

The built-in checkout covers WhatsApp and Pix. Reach for a custom one when you
need a real card acquirer, extra fields (CPF, delivery window, gift message), or
a multi-step flow of your own design.

## The form

`ShippingInfo` is the shape `processCheckout` expects:

```tsx title="src/MyCheckout.tsx"
import { useState } from 'react';
import { useCart, useCheckout, useMoney } from '@neverleans-labs/plug-store-core';
import type { ShippingInfo } from '@neverleans-labs/plug-store-core';

const EMPTY: ShippingInfo = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: 'BR',
};

export function MyCheckout() {
  const { items, subtotal, discount, shippingCost, total } = useCart();
  const { processCheckout, loading, error } = useCheckout({ autoRedirect: true });
  const money = useMoney();

  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY);
  const set = (key: keyof ShippingInfo) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setShipping((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    // 'stripe' is the redirect-style slot; the adapter below overrides it.
    const result = await processCheckout(shipping, 'stripe');
    if (!result.success) console.error(result.error);
  };

  if (items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <form onSubmit={submit}>
      <input required value={shipping.firstName} onChange={set('firstName')} placeholder="First name" />
      <input required value={shipping.lastName} onChange={set('lastName')} placeholder="Last name" />
      <input required type="email" value={shipping.email} onChange={set('email')} placeholder="E-mail" />
      <input required value={shipping.address} onChange={set('address')} placeholder="Address" />
      <input required value={shipping.city} onChange={set('city')} placeholder="City" />
      <input required value={shipping.state} onChange={set('state')} placeholder="State" />
      <input required value={shipping.zip} onChange={set('zip')} placeholder="Postcode" />

      <dl>
        <dt>Subtotal</dt><dd>{money(subtotal)}</dd>
        {discount > 0 && (<><dt>Discount</dt><dd>−{money(discount)}</dd></>)}
        <dt>Shipping</dt><dd>{money(shippingCost)}</dd>
        {/* Use `total` as-is: it already includes discount and shipping. */}
        <dt>Total</dt><dd>{money(total)}</dd>
      </dl>

      <button type="submit" disabled={loading}>
        {loading ? 'Processing…' : `Pay ${money(total)}`}
      </button>

      {error && <p role="alert">{error}</p>}
    </form>
  );
}
```

## The adapter

An adapter turns the cart into whatever your provider needs. It runs in the
browser, so it must talk to **your** server — never put a secret key here.

```ts title="src/pagarmeAdapter.ts"
import type { PaymentGatewayAdapter } from '@neverleans-labs/plug-store-core';

export const pagarmeAdapter: PaymentGatewayAdapter = async (payload) => {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(payload.total * 100),
        customer: {
          name: `${payload.shippingInfo.firstName} ${payload.shippingInfo.lastName}`,
          email: payload.shippingInfo.email,
        },
        items: payload.items.map((item) => ({
          code: item.product.id,
          description: item.product.name,
          amount: Math.round(item.product.price * 100),
          quantity: item.quantity,
        })),
        notes: payload.notes,
      }),
    });

    if (!res.ok) {
      return { success: false, error: `Payment provider returned ${res.status}` };
    }

    const data = await res.json();
    return { success: true, orderId: data.id, paymentUrl: data.checkout_url };
  } catch (err) {
    // Never throw from an adapter — processCheckout surfaces this as `error`.
    return { success: false, error: err instanceof Error ? err.message : 'Network error' };
  }
};
```

Wire it in:

```tsx
const { processCheckout } = useCheckout({
  adapters: { stripe: pagarmeAdapter },
  autoRedirect: true,
});
```

## Routing to your page

Use `CatalogProvider` and your own routes, keeping the PlugStore pages you still
want:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  CatalogProvider,
  Header,
  Footer,
  HomePage,
  ProductsPage,
  ProductDetailPage,
  CartPage,
} from '@neverleans-labs/plug-store-core';
import { MyCheckout } from './MyCheckout';

export default function App() {
  return (
    <CatalogProvider config={{ companyName: 'Bloom Cosmetics', currency: 'BRL' }}>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<MyCheckout />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </CatalogProvider>
  );
}
```

## What you still get for free

- Cart state, totals and coupon handling
- `begin_checkout` and `purchase` analytics events
- `createOrder` on your data provider
- Cart clearing on success
- Automatic redirect when the adapter returns a `paymentUrl`

## Next

- [Checkout reference](../guides/checkout.md)
- [Data providers](../guides/data.md)
