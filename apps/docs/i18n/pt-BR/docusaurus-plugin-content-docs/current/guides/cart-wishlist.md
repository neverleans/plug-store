---
id: cart-wishlist
title: Carrinho, desejos e comparação
sidebar_label: Carrinho e desejos
sidebar_position: 6
description: Os hooks useCart, useWishlist, useCompare e useRecentlyViewed — API completa, como os totais são calculados, e onde o estado é persistido.
---

# Carrinho, desejos e comparação

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Você consegue controlar o carrinho pelos seus próprios componentes e confiar nos
totais que o checkout usa.

</div>

## `useCart`

```tsx
import { useCart } from '@neverleans-labs/plug-store-core';

function AdicionarAoCarrinho({ product }) {
  const { addItem, itemCount } = useCart();

  return (
    <button onClick={() => addItem(product, 1)}>
      Adicionar ao carrinho ({itemCount})
    </button>
  );
}
```

| Membro | Tipo | Observações |
|---|---|---|
| `items` | `CartItem[]` | `{ product, quantity, selectedVariants? }` |
| `addItem` | `(product, quantity?, variants?) => void` | Adicionar o mesmo produto e variantes aumenta a quantidade |
| `removeItem` | `(productId) => void` | |
| `updateQuantity` | `(productId, quantity) => void` | Zero remove a linha |
| `clearCart` | `() => void` | Chamado automaticamente após um checkout bem-sucedido |
| `itemCount` | `number` | Soma das quantidades, não de linhas distintas |
| `subtotal` | `number` | Preços das linhas × quantidades |
| `discount` | `number` | Valor removido pelo cupom aplicado |
| `shippingCost` | `number` | |
| `total` | `number` | `subtotal − desconto + frete` |
| `discountCode` | `string` | Código de cupom aplicado no momento |
| `setDiscountCode` | `(code) => void` | Valida contra os cupons configurados |

:::warning Use `total`, nunca recalcule
`total` já inclui desconto e frete. Uma tela de checkout que soma frete em cima
do `total` cobra frete duas vezes — que é exatamente o bug que a página de
checkout embutida já teve.
:::

## `useWishlist`

```tsx
const { items, addItem, removeItem, isInWishlist, toggleItem } = useWishlist();
```

`toggleItem(product)` é o que o botão de coração do `ProductCard` chama.
`isInWishlist(productId)` devolve um booleano.

## `useCompare`

```tsx
const { items, toggle, remove, clear, has, isFull } = useCompare();
```

A lista de comparação tem limite; `isFull` diz quando adicionar outro seria
rejeitado, para você desabilitar o controle em vez de falhar em silêncio. A rota
`/compare` renderiza uma tabela lado a lado do que estiver na lista, e
`CompareBar` é a barra flutuante de resumo.

## `useRecentlyViewed`

```tsx
const { items, add, clear } = useRecentlyViewed();
```

A `ProductDetailPage` chama `add(product)` ao montar. `RecentlyViewedRow`
renderiza a faixa.

## Persistência

Os quatro persistem em `localStorage` e reidratam na visita seguinte:

| Hook | Chave |
|---|---|
| `useCart` | `ecom-cart` |
| `useWishlist` | `ecom-wishlist` |
| `useCompare` | `ecom-compare` |
| `useRecentlyViewed` | `ecom-recently-viewed` |

O valor guardado contém objetos de produto inteiros, não apenas ids, então um
carrinho sobrevive mesmo se o produto sumir do backend depois. O outro lado é
que uma mudança de preço não se reflete em um carrinho antigo até o item ser
adicionado de novo — revalide no servidor antes de cobrar.

## Cupons

`setDiscountCode` confere o código contra os cupons da
[configuração em runtime](./configuration.md#cupons). Um cupom `percent` tira
essa porcentagem do subtotal; um `flat` subtrai o valor, e um `flat` com
`value: 0` é como frete grátis é expresso.

```tsx
const { setDiscountCode, discount, discountCode } = useCart();

setDiscountCode('SAVE10');
// discount agora é 10% do subtotal
```

## Próximos passos

- [Checkout](./checkout.md)
- [Formatação de moeda](./i18n-currency.md)
