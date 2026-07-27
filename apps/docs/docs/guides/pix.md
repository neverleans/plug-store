---
id: pix
title: Pix payments
sidebar_label: Pix
sidebar_position: 5
description: How PlugStore builds a real, spec-compliant static Pix BR Code — the EMV payload, the CRC-16 checksum, the field limits, and what static Pix cannot do.
---

# Pix payments

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

A checkout that produces a Pix code a Brazilian banking app actually accepts,
and a clear picture of where static Pix stops.

</div>

## Turning it on

Two config fields, and BRL:

```tsx
<CatalogApp
  config={{
    currency: 'BRL',
    pixKey: 'bloom@example.com',
    pixMerchantCity: 'Sao Paulo',
    companyName: 'Bloom Cosmetics',
  }}
/>
```

The Pix option then appears at checkout, showing the QR code and the
copy-and-paste string ("Pix Copia e Cola").

`pixKey` accepts any key type: CPF, CNPJ, e-mail, phone in `+55…` form, or a
random key.

## It is a real BR Code

This is worth stating plainly because placeholder implementations are common.
PlugStore implements the **EMV® QRCPS-MPM** payload described in the Banco
Central do Brasil's *Manual de Padrões para Iniciação do Pix*.

The payload is a series of TLV fields — a two-digit id, a two-digit length,
then the value:

| Id | Content |
|---|---|
| `00` | Payload format indicator, `01` |
| `01` | Point of initiation, `11` (static, reusable) |
| `26` | Merchant account: `br.gov.bcb.pix` + your key |
| `52` | Merchant category code, `0000` |
| `53` | Currency, `986` (BRL) |
| `54` | Amount, omitted when zero so the payer types it |
| `58` | Country, `BR` |
| `59` | Beneficiary name |
| `60` | Beneficiary city |
| `62` | Additional data: the reference label |
| `63` | CRC-16 |

The checksum is **CRC-16/CCITT-FALSE** — polynomial `0x1021`, initial value
`0xFFFF`, no input or output reflection — computed over the whole payload
*including* the `6304` tag of the CRC field itself. Getting that wrong is what
makes a code scan as invalid, so it is covered by unit tests.

## Field limits

The spec restricts names and cities to printable ASCII. PlugStore folds them
for you: accents are decomposed and stripped, the text is upper-cased and
truncated.

| Field | Source | Limit | Fallback |
|---|---|---|---|
| Beneficiary name | `config.companyName` | 25 chars | `RECEBEDOR` |
| Beneficiary city | `config.pixMerchantCity` | 15 chars | `BRASIL` |
| Reference (txid) | the generated order id | 25 chars | `***` |

So `São Paulo` becomes `SAO PAULO`, and a long store name is cut at 25
characters. Pick a short trading name if the legal name is long.

## Generating a code yourself

The generator is exported, so you can build a code outside the checkout — for
an invoice, a receipt, or a "pay this amount" link.

```ts
import { buildPixPayload } from '@neverleans-labs/plug-store-core';

const code = buildPixPayload({
  pixKey: 'bloom@example.com',
  merchantName: 'Bloom Cosmetics',
  merchantCity: 'Sao Paulo',
  amount: 149.9,        // omit for a payer-defined amount
  txid: 'PEDIDO-1042',  // optional, defaults to '***'
});
```

`buildPixPayload` throws when `pixKey` is missing — a Pix code without a key is
never useful, so failing loudly beats emitting a string that silently does
nothing.

The checksum function is exported too, if you need to validate a payload from
elsewhere:

```ts
import { pixCrc16 } from '@neverleans-labs/plug-store-core';

const body = code.slice(0, -4);         // everything up to the CRC value
pixCrc16(body) === code.slice(-4);      // true for a valid code
```

## Rendering a QR code

`pixGateway` returns `pixQrCodeUrl`, an image URL from a public QR service, so
the built-in checkout works with no extra dependency.

For a production store, generate the QR locally instead — it avoids sending the
payload to a third party and works offline:

```tsx
import QRCode from 'qrcode';

const dataUrl = await QRCode.toDataURL(code, { width: 300, margin: 1 });
```

## What static Pix cannot do

The bundled flow is **static Pix**. It creates a valid payment request. Nothing
more.

- **No confirmation.** Your app never learns that the money arrived. Someone has
  to check the bank.
- **No per-order reconciliation from the bank side.** The txid is in the
  payload, but matching it to a settlement requires the bank's API.
- **No refunds or cancellation.**

Automatic confirmation means *dynamic Pix*: a PSP account, a webhook endpoint on
your server, and a signature check. When you have that, wire it in as a
[custom adapter](./checkout.md#custom-adapters) — PlugStore stays out of the way.

## Next

- [Checkout and adapters](./checkout.md)
- [Store configuration](./configuration.md)
