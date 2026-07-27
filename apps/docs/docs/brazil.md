---
id: brazil
title: Built for Brazilian commerce
sidebar_label: Built for Brazil
sidebar_position: 2
description: Pix, WhatsApp and Mercado Pago are checkout adapters that ship in the box and are covered by tests — not plugins you go looking for. What is inside, and exactly where it stops.
---

# Built for Brazilian commerce

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

You will know which parts of Brazilian commerce are inside the framework, which
are not, and how to check either claim in the source.

</div>

## The claim

Most storefront frameworks treat Brazil as a **locale**: a currency symbol, a
date format, a translated string file. The payment methods that actually close
sales here show up later — as a community plugin, or as a paragraph telling you
to build it yourself.

PlugStore treats Brazil as the **default case**. Pix and WhatsApp are not
integrations you add. They are checkout adapters that ship in the box, are
exported from the package root, and are covered by tests that run on every
commit.

That is the differentiator. It is stated here because the rest of these docs only
ever *demonstrate* it, page by page, without ever naming it.

## Pix that a banking app resolves

The bundled Pix adapter does not call an API and does not return an image from
someone's dashboard. It builds the payload itself:

```ts
import { buildPixPayload } from '@neverleans-labs/plug-store-core';

buildPixPayload({
  pixKey: 'padaria@example.com',
  merchantName: 'Padaria São João',
  merchantCity: 'São Paulo',
  amount: 49.9,
});
```

```text title="the returned payload"
00020101021126410014br.gov.bcb.pix0119padaria@example.com520400005303986540549.905802BR5916PADARIA SAO JOAO6009SAO PAULO62070503***63047C4C
```

That string is an EMV® MPM payload following the Banco Central
*Manual de Padrões para Iniciação do Pix*. Paste it into any Brazilian banking
app and it resolves to the merchant's key.

Two details are where implementations quietly get this wrong, and both are worth
naming because a wrong Pix code **does not throw** — it simply refuses to scan,
in production, on a customer's phone:

| Detail | The rule | What happens if you miss it |
|---|---|---|
| **CRC-16** | `CCITT-FALSE`: polynomial `0x1021`, init `0xFFFF`, **no** input or output reflection, computed over the payload *including* the CRC field's own `6304` tag | The bank app rejects the code with a generic error |
| **ASCII folding** | Merchant name and city must be folded to printable ASCII, upper-cased, then truncated to 25 and 15 characters | `São João` breaks the length prefix and corrupts every field after it |

Both are pinned by tests — the CRC against the canonical check vector, the
folding against an accented name that exceeds the cap. Eleven of the suite's
forty-three tests cover the Pix payload alone, which tells you where the risk is
concentrated.

Try it against your own key on the [Pix guide](./guides/pix.md) — the generator
runs in the page.

## WhatsApp as a checkout method, not a share button

A very large number of small Brazilian stores close orders in conversation. The
WhatsApp adapter treats that as a legitimate checkout, not an afterthought: the
order becomes a pre-filled `wa.me` message carrying customer, address, every
line item with quantity and price, discount, shipping and total.

```
👋 *Novo Pedido #ORD-4F2A91*

👤 *Cliente:* Ana Souza
📍 *Endereço:* Rua das Flores 210, São Paulo - SP

📦 *Itens do Pedido:*
• 2x *Pão de forma integral* (R$ 12,90)

🚚 *Frete:* R$ 8,00
💰 *TOTAL:* R$ 33,80
```

Be clear about what this is: a `wa.me` deep link, which needs no approval and no
Meta review. It is not the WhatsApp Business API — see
[where this stops](#where-the-brazilian-knowledge-stops).

## Mercado Pago, without your secret in the browser

`mercadopagoGateway` posts the cart to **your** endpoint and follows the
`init_point` it returns. The access token stays on your server, where it belongs;
the framework never asks you to put it in client code. Same shape for Stripe.

See [Checkout](./guides/checkout.md) for the adapter contract.

## Currency and language

- **BRL is formatted through the `pt-BR` Intl locale** — `R$ 1.234,56`, with the
  separators the right way round.
- **The store has one currency and prices are stored in it.** There is no
  exchange-rate conversion, because a Brazilian store does not price in dollars
  and convert. Switching currency changes formatting, not arithmetic.
- **The Portuguese interface is complete, not a fallback.** `pt.ts` and `en.ts`
  are both 250 lines — every key is translated, including the ones that matter
  for an address form here, like `CEP` instead of a translated "ZIP code".

Details in [Currency and language](./guides/i18n-currency.md).

## Where the Brazilian knowledge stops

This is the more useful half of the page. Everything above is real; everything
below is not in the framework, and pretending otherwise would cost you a week.

| Not included | What you actually need |
|---|---|
| **Payment confirmation** | The bundled Pix is *static*. It creates a valid charge; nothing tells your app the money arrived. Reconciliation means a PSP with a webhook, plugged in through the [adapter interface](./guides/checkout.md#custom-adapters). |
| **NFe** | No fiscal document generation. In practice this means a provider such as Focus NFe or NFe.io, driven from your backend. |
| **Real shipping quotes** | Shipping is a configured value. Correios or Melhor Envio pricing needs a contract, a token, and a table that changes. |
| **Marketplace sync** | No Mercado Livre or Shopee integration. |
| **WhatsApp Business API** | The adapter is a `wa.me` link. Templated messaging, automation and multi-agent inboxes require Meta approval and a BSP. |
| **CPF/CNPJ validation, CEP lookup** | Not implemented. The Pix key field accepts a CPF or CNPJ as a string but does not check the digits, and there is no address autocomplete. |

None of these are hidden behind a paywall today — they are simply not built.

If one of them is the wall between you and a live store,
[say which one](https://github.com/neverleans/plug-store/issues/new?template=production_need.yml).
We are mapping which walls people actually hit before building anything, and the
list above is in the order we currently believe matters — which is exactly the
guess we would like corrected.

## Next

- [Pix payments](./guides/pix.md) — the payload, field by field, with a live generator.
- [Checkout](./guides/checkout.md) — all four adapters and how to write your own.
- [How this is maintained](./maintenance.md) — what keeps the above working.
