---
id: checkout
title: Checkout
sidebar_label: Checkout
sidebar_position: 4
description: The built-in checkout, the useCheckout hook, and how to plug in Stripe, Mercado Pago or any other payment provider through the adapter interface.
---

# Checkout

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

A working checkout on WhatsApp, Pix or your own payment provider — and you will
know exactly what PlugStore does and does not handle.

</div>

## What ships

`<CatalogApp />` includes a checkout page with a payment-method picker. No code
required: fill in `whatsappPhone` and/or `pixKey` in
[config](./configuration.md) and the corresponding options appear.

| Method | Requires | Result |
|---|---|---|
| WhatsApp | `whatsappPhone` | Opens a pre-filled order message in a new tab |
| Pix | `pixKey` **and** `currency: 'BRL'` | Shows a scannable BR Code and a copy-paste string |
| Card | — | A demo flow, not a real acquirer |

:::danger The card option is a demo
It exists so the flow is complete on a fresh install. It does not talk to any
acquirer and takes no money. Replace it with a real adapter — see
[Custom adapters](#custom-adapters) — before going live.
:::

## `useCheckout`

For your own checkout UI on top of `<CatalogProvider />`:

```tsx
import { useCheckout } from '@neverleans-labs/plug-store-core';
import type { ShippingInfo } from '@neverleans-labs/plug-store-core';

function PayButton({ shipping }: { shipping: ShippingInfo }) {
  const { processCheckout, loading, result, error } = useCheckout();

  const pay = async () => {
    const res = await processCheckout(shipping, 'pix');
    if (res.success) console.log(res.pixCode);
  };

  return (
    <>
      <button onClick={pay} disabled={loading}>
        {loading ? 'Processing…' : 'Pay with Pix'}
      </button>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
```

### `ShippingInfo`

```ts
interface ShippingInfo {
  firstName: string;
  lastName:  string;
  email:     string;
  address:   string;
  city:      string;
  state:     string;
  zip:       string;
  country:   string;
}
```

### What `processCheckout` does

`processCheckout(shippingInfo, method?, notes?)` — `method` defaults to
`'whatsapp'`.

1. Emits a `begin_checkout` analytics event.
2. Builds a `CheckoutPayload` from the current cart: items, subtotal, discount,
   shipping cost, total, the shipping info and the method.
3. Runs the adapter for that method.
4. On success, calls `createOrder` on your [data provider](./data.md) if it
   implements one.
5. Emits `purchase`, clears the cart, and either opens the WhatsApp tab or
   redirects to the payment URL when `autoRedirect` is set.

### `PaymentResult`

```ts
interface PaymentResult {
  success: boolean;
  orderId?: string;
  paymentUrl?: string;    // Stripe / Mercado Pago redirect
  pixCode?: string;       // BR Code, copy-paste
  pixQrCodeUrl?: string;  // QR image URL
  whatsappUrl?: string;
  error?: string;
}
```

`processCheckout` never throws — a failure comes back as
`{ success: false, error }` and is also exposed on the hook's `error`.

## Bundled adapters

An adapter is a single function:

```ts
type PaymentGatewayAdapter = (payload: CheckoutPayload) => Promise<PaymentResult>;
```

### `whatsappGateway(phone)`

Builds a `https://wa.me/…` link with the order formatted as a message: customer
name, address, each line item, discount, shipping and total. Fails with a clear
error when no phone is configured.

### `pixGateway(keyOrOptions)`

Generates a real static Pix BR Code. See [Pix payments](./pix.md).

```ts
pixGateway({
  pixKey: 'bloom@example.com',
  merchantName: 'Bloom Cosmetics',
  merchantCity: 'Sao Paulo',
});
```

### `stripeGateway(endpoint, options?)`

`POST`s the payload to **your** endpoint and expects `{ url }` or
`{ paymentUrl }` back. Your server creates the Stripe Checkout Session — the
secret key never touches the browser.

```ts
stripeGateway('/api/checkout/stripe', {
  headers: { Authorization: `Bearer ${token}` },
});
```

### `mercadopagoGateway(endpoint, options?)`

Same shape. Your server creates the preference and returns `init_point`,
`sandbox_init_point` or `paymentUrl`.

Both default to `/api/checkout/stripe` and `/api/checkout/mercadopago` when
selected through the built-in checkout page.

## Custom adapters {#custom-adapters}

Override any method by passing your own function:

```tsx
import { useCheckout } from '@neverleans-labs/plug-store-core';
import type { PaymentGatewayAdapter } from '@neverleans-labs/plug-store-core';

const pagarme: PaymentGatewayAdapter = async (payload) => {
  const res = await fetch('/api/pagarme/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) return { success: false, error: `Gateway error ${res.status}` };

  const data = await res.json();
  return { success: true, orderId: data.id, paymentUrl: data.checkout_url };
};

function Checkout() {
  const { processCheckout } = useCheckout({
    adapters: { stripe: pagarme },
    autoRedirect: true,
  });
  // …
}
```

`adapters` is keyed by `PaymentMethod` — `'whatsapp' | 'pix' | 'stripe' |
'mercadopago'`. There is no way to add a fifth key today, so reuse the slot
whose semantics match: a redirect-based provider fits `stripe`.

## What is not handled

- **Payment confirmation.** Nothing tells the store that a Pix transfer landed.
  That needs a PSP webhook on your server.
- **Inventory decrement.** `createOrder` is called; what it does is yours.
- **Tax and fiscal documents.** Out of scope.
- **Shipping quotes.** The shipping cost comes from cart logic, not a carrier
  API.

Each of these is deliberate — they need a server, a contract or a tax regime, and
guessing at them in a client-side library is how stores lose money quietly. If one
of them is blocking a store you are shipping,
[tell us which](https://github.com/neverleans/plug-store/issues/new?template=production_need.yml).

## Next

- [Pix in detail](./pix.md)
- [Build a custom checkout UI](../recipes/custom-checkout.md)
- [Persist orders through your data provider](./data.md)
