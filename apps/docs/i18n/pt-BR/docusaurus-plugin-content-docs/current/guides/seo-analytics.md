---
id: seo-analytics
title: SEO e analytics
sidebar_label: SEO e analytics
sidebar_position: 9
description: Dados estruturados JSON-LD de produto, OpenGraph e Twitter cards, e eventos de e-commerce GA4 e Meta Pixel sem configuração.
---

# SEO e analytics

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Produtos que geram resultados ricos na busca, links que exibem prévia correta ao
serem compartilhados, e funis de compra visíveis no GA4 e no Meta.

</div>

## Dados estruturados e meta tags

`CatalogSEO` emite tudo que uma página de produto precisa. As páginas prontas já
o renderizam; use direto quando construir as suas.

```tsx
import { CatalogSEO } from '@neverleans-labs/plug-store-core';

function MinhaPaginaDeProduto({ product }) {
  return (
    <>
      <CatalogSEO product={product} />
      {/* … */}
    </>
  );
}
```

| Prop | Para quê |
|---|---|
| `product` | Gera o JSON-LD `Schema.org/Product` com preço, disponibilidade e nota |
| `title` | Anexado ao nome da loja; cai para nome + slogan |
| `description` | Cai para a descrição do produto, depois para o texto do rodapé |
| `image` | Cai para a primeira imagem do produto, depois para o logo |
| `url` | Cai para a localização atual |

Ele escreve a meta description, as tags de OpenGraph, as de Twitter card e o
script JSON-LD de uma vez só. Os valores vêm da sua
[configuração](./configuration.md), então preencher `companyName` e `tagline`
melhora todas as páginas ao mesmo tempo.

Para uma página que não é de produto, `SEOHead` é o componente de mais baixo
nível — `title`, `description`, `canonical`, `image`, `url` e um objeto `jsonLd`
cru.

:::info Isto é uma SPA renderizada no cliente
O Google executa JavaScript e indexa isto corretamente, mas crawlers que não
executam veem uma casca vazia. Se busca orgânica é seu principal canal de
aquisição com catálogos grandes, faça prerender ou use um framework com
renderização no servidor — veja
[quando não usar o PlugStore](../intro.md).
:::

## Analytics

Preencha qualquer um dos ids na configuração e o script é injetado, com os
eventos começando a fluir:

```tsx
<CatalogApp
  config={{
    gaId: 'G-XXXXXXXXXX',
    metaPixelId: '1234567890',
  }}
/>
```

Quatro eventos de e-commerce são emitidos automaticamente:

| Evento do PlugStore | GA4 | Meta Pixel |
|---|---|---|
| Página de produto vista | `view_item` | `ViewContent` |
| Adicionado ao carrinho | `add_to_cart` | `AddToCart` |
| Checkout iniciado | `begin_checkout` | `InitiateCheckout` |
| Pedido concluído | `purchase` | `Purchase` |

`begin_checkout` e `purchase` carregam o valor, a moeda e a lista completa de
itens, então os relatórios de monetização do GA4 funcionam sem configuração
extra.

### Disparar seus próprios eventos

```tsx
import { trackEvent } from '@neverleans-labs/plug-store-core';

trackEvent('add_to_cart', {
  value: product.price,
  currency: 'BRL',
  items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity: 1 }],
});
```

`trackEvent` aceita os quatro nomes acima e encaminha para as duas plataformas,
traduzindo o nome para o Meta. Não faz nada quando nenhum script foi carregado,
então é seguro chamar sem condicional — inclusive em desenvolvimento e em
testes.

Para instalar os scripts a partir da sua própria árvore de componentes, chame
`useCatalogAnalytics()` uma vez perto da raiz. `AnalyticsInjector` faz
exatamente isso e já é montado pelo `CatalogApp`.

## Favicon

`FaviconInjector` grava o `config.faviconDataUrl` no head do documento em tempo
de execução, que é como o painel admin consegue trocar o favicon sem rebuild. Um
favicon estático no `index.html` continua funcionando e é preferível quando você
controla o build.

## Próximos passos

- [Configuração da loja](./configuration.md)
- [Publicar](../getting-started/deploy.md)
