---
id: custom-checkout
title: Montar um checkout customizado
sidebar_label: Checkout customizado
sidebar_position: 3
description: Substitua a página de checkout embutida pelo seu formulário e pelo seu meio de pagamento, usando useCheckout e um adaptador próprio.
---

# Montar um checkout customizado

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Sua própria interface de checkout e seu próprio meio de pagamento, com o
PlugStore ainda cuidando do carrinho, dos totais, do analytics e da gravação do
pedido.

</div>

## Quando você precisa disto

O checkout embutido cobre WhatsApp e Pix. Parta para um próprio quando precisar
de adquirente de cartão de verdade, campos extras (CPF, janela de entrega,
mensagem de presente), ou um fluxo em várias etapas do seu jeito.

## O formulário

`ShippingInfo` é o formato que o `processCheckout` espera:

```tsx title="src/MeuCheckout.tsx"
import { useState } from 'react';
import { useCart, useCheckout, useMoney } from '@neverleans-labs/plug-store-core';
import type { ShippingInfo } from '@neverleans-labs/plug-store-core';

const VAZIO: ShippingInfo = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: 'BR',
};

export function MeuCheckout() {
  const { items, subtotal, discount, shippingCost, total } = useCart();
  const { processCheckout, loading, error } = useCheckout({ autoRedirect: true });
  const money = useMoney();

  const [shipping, setShipping] = useState<ShippingInfo>(VAZIO);
  const set = (key: keyof ShippingInfo) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setShipping((prev) => ({ ...prev, [key]: event.target.value }));

  const enviar = async (event: React.FormEvent) => {
    event.preventDefault();
    // 'stripe' é o slot de redirect; o adaptador abaixo o substitui.
    const result = await processCheckout(shipping, 'stripe');
    if (!result.success) console.error(result.error);
  };

  if (items.length === 0) return <p>Seu carrinho está vazio.</p>;

  return (
    <form onSubmit={enviar}>
      <input required value={shipping.firstName} onChange={set('firstName')} placeholder="Nome" />
      <input required value={shipping.lastName} onChange={set('lastName')} placeholder="Sobrenome" />
      <input required type="email" value={shipping.email} onChange={set('email')} placeholder="E-mail" />
      <input required value={shipping.address} onChange={set('address')} placeholder="Endereço" />
      <input required value={shipping.city} onChange={set('city')} placeholder="Cidade" />
      <input required value={shipping.state} onChange={set('state')} placeholder="Estado" />
      <input required value={shipping.zip} onChange={set('zip')} placeholder="CEP" />

      <dl>
        <dt>Subtotal</dt><dd>{money(subtotal)}</dd>
        {discount > 0 && (<><dt>Desconto</dt><dd>−{money(discount)}</dd></>)}
        <dt>Frete</dt><dd>{money(shippingCost)}</dd>
        {/* Use `total` como está: ele já inclui desconto e frete. */}
        <dt>Total</dt><dd>{money(total)}</dd>
      </dl>

      <button type="submit" disabled={loading}>
        {loading ? 'Processando…' : `Pagar ${money(total)}`}
      </button>

      {error && <p role="alert">{error}</p>}
    </form>
  );
}
```

## O adaptador

Um adaptador transforma o carrinho no que o seu provedor precisa. Ele roda no
navegador, então precisa falar com o **seu** servidor — nunca coloque uma chave
secreta aqui.

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
      return { success: false, error: `O provedor devolveu ${res.status}` };
    }

    const data = await res.json();
    return { success: true, orderId: data.id, paymentUrl: data.checkout_url };
  } catch (err) {
    // Nunca lance de dentro de um adaptador — o processCheckout expõe isto como `error`.
    return { success: false, error: err instanceof Error ? err.message : 'Erro de rede' };
  }
};
```

Plugue:

```tsx
const { processCheckout } = useCheckout({
  adapters: { stripe: pagarmeAdapter },
  autoRedirect: true,
});
```

## Rotear para a sua página

Use o `CatalogProvider` com as suas rotas, mantendo as páginas do PlugStore que
você ainda quer:

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
import { MeuCheckout } from './MeuCheckout';

export default function App() {
  return (
    <CatalogProvider config={{ companyName: 'Bloom Cosméticos', currency: 'BRL' }}>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<MeuCheckout />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </CatalogProvider>
  );
}
```

## O que você continua ganhando de graça

- Estado do carrinho, totais e cupons
- Eventos de analytics `begin_checkout` e `purchase`
- `createOrder` no seu data provider
- Limpeza do carrinho no sucesso
- Redirect automático quando o adaptador devolve `paymentUrl`

## Próximos passos

- [Referência do checkout](../guides/checkout.md)
- [Data providers](../guides/data.md)
