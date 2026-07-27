---
id: checkout
title: Checkout
sidebar_label: Checkout
sidebar_position: 4
description: O checkout embutido, o hook useCheckout, e como plugar Stripe, Mercado Pago ou qualquer outro meio de pagamento pela interface de adaptadores.
---

# Checkout

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Um checkout funcionando por WhatsApp, Pix ou seu próprio meio de pagamento — e
você vai saber exatamente o que o PlugStore resolve e o que não resolve.

</div>

## O que já vem

`<CatalogApp />` inclui uma página de checkout com seletor de método de
pagamento. Sem código: preencha `whatsappPhone` e/ou `pixKey` na
[configuração](./configuration.md) e as opções correspondentes aparecem.

| Método | Exige | Resultado |
|---|---|---|
| WhatsApp | `whatsappPhone` | Abre uma mensagem de pedido já preenchida em nova aba |
| Pix | `pixKey` **e** `currency: 'BRL'` | Mostra um BR Code escaneável e o texto para copiar |
| Cartão | — | Um fluxo de demonstração, sem adquirente real |

:::danger A opção de cartão é demonstração
Ela existe para o fluxo ficar completo numa instalação nova. Não conversa com
adquirente nenhum e não recebe dinheiro. Substitua por um adaptador de verdade —
veja [Adaptadores customizados](#custom-adapters) — antes de ir ao ar.
:::

## `useCheckout`

Para o seu próprio checkout em cima do `<CatalogProvider />`:

```tsx
import { useCheckout } from '@neverleans-labs/plug-store-core';
import type { ShippingInfo } from '@neverleans-labs/plug-store-core';

function BotaoPagar({ shipping }: { shipping: ShippingInfo }) {
  const { processCheckout, loading, error } = useCheckout();

  const pagar = async () => {
    const res = await processCheckout(shipping, 'pix');
    if (res.success) console.log(res.pixCode);
  };

  return (
    <>
      <button onClick={pagar} disabled={loading}>
        {loading ? 'Processando…' : 'Pagar com Pix'}
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

### O que `processCheckout` faz

`processCheckout(shippingInfo, método?, notas?)` — `método` cai para
`'whatsapp'`.

1. Emite um evento de analytics `begin_checkout`.
2. Monta um `CheckoutPayload` a partir do carrinho atual: itens, subtotal,
   desconto, frete, total, os dados de entrega e o método.
3. Executa o adaptador daquele método.
4. Em caso de sucesso, chama `createOrder` no seu
   [data provider](./data.md), se ele implementar.
5. Emite `purchase`, limpa o carrinho e abre a aba do WhatsApp ou redireciona
   para a URL de pagamento quando `autoRedirect` está ligado.

### `PaymentResult`

```ts
interface PaymentResult {
  success: boolean;
  orderId?: string;
  paymentUrl?: string;    // redirect do Stripe / Mercado Pago
  pixCode?: string;       // BR Code, copia e cola
  pixQrCodeUrl?: string;  // URL da imagem do QR
  whatsappUrl?: string;
  error?: string;
}
```

`processCheckout` nunca lança — uma falha volta como
`{ success: false, error }` e também aparece no `error` do hook.

## Adaptadores embutidos

Um adaptador é uma única função:

```ts
type PaymentGatewayAdapter = (payload: CheckoutPayload) => Promise<PaymentResult>;
```

### `whatsappGateway(telefoneOuOpcoes)`

Monta um link `https://wa.me/…` com o pedido formatado como mensagem: nome do
cliente, endereço, cada item, desconto, frete e total. Falha com um erro claro
quando não há telefone configurado.

```ts
whatsappGateway({
  phone: '5511999999999',
  currency: 'BRL',   // os valores são formatados nesta moeda
  language: 'pt',    // a mensagem é escrita neste idioma
});
```

`whatsappGateway('5511999999999')` continua funcionando, assumindo BRL e
português. O `useCheckout` passa a moeda e o idioma da própria loja, então uma
loja em BRL escreve `R$ 12,90` e uma em USD escreve `$12.90`.

### `pixGateway(chaveOuOpcoes)`

Gera um BR Code Pix estático de verdade. Veja [Pagamentos Pix](./pix.md).

```ts
pixGateway({
  pixKey: 'bloom@example.com',
  merchantName: 'Bloom Cosméticos',
  merchantCity: 'Sao Paulo',
});
```

### `stripeGateway(endpoint, options?)`

Faz `POST` do payload para o **seu** endpoint e espera `{ url }` ou
`{ paymentUrl }` de volta. Seu servidor cria a Checkout Session do Stripe — a
chave secreta nunca chega no navegador.

```ts
stripeGateway('/api/checkout/stripe', {
  headers: { Authorization: `Bearer ${token}` },
});
```

### `mercadopagoGateway(endpoint, options?)`

Mesmo formato. Seu servidor cria a preference e devolve `init_point`,
`sandbox_init_point` ou `paymentUrl`.

Os dois caem para `/api/checkout/stripe` e `/api/checkout/mercadopago` quando
selecionados pela página de checkout embutida.

## Adaptadores customizados {#custom-adapters}

Sobrescreva qualquer método passando a sua própria função:

```tsx
import { useCheckout } from '@neverleans-labs/plug-store-core';
import type { PaymentGatewayAdapter } from '@neverleans-labs/plug-store-core';

const pagarme: PaymentGatewayAdapter = async (payload) => {
  const res = await fetch('/api/pagarme/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) return { success: false, error: `Erro do gateway ${res.status}` };

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

`adapters` é indexado por `PaymentMethod` — `'whatsapp' | 'pix' | 'stripe' |
'mercadopago'`. Não há como adicionar uma quinta chave hoje, então reaproveite o
slot cuja semântica combina: um provedor baseado em redirect cabe em `stripe`.

## O que não é resolvido

- **Confirmação de pagamento.** Nada avisa a loja de que um Pix caiu. Isso exige
  um webhook do PSP no seu servidor.
- **Baixa de estoque.** `createOrder` é chamado; o que ele faz é com você.
- **Impostos e nota fiscal.** Fora do escopo.
- **Cotação de frete.** O custo de frete vem da lógica do carrinho, não de uma
  API de transportadora.

Cada um desses é deliberado — todos exigem um servidor, um contrato ou um regime
tributário, e chutar isso dentro de uma biblioteca client-side é como lojas
perdem dinheiro em silêncio. Se um deles está travando uma loja que você está
entregando,
[diga qual](https://github.com/neverleans/plug-store/issues/new?template=production_need.yml).

## Próximos passos

- [Pix em detalhe](./pix.md)
- [Montar um checkout customizado](../recipes/custom-checkout.md)
- [Persistir pedidos pelo data provider](./data.md)
