---
id: admin
title: Painel admin
sidebar_label: Painel admin
sidebar_position: 10
description: A rota /admin embutida — o que ela consegue mudar, como funcionam a importação e exportação em CSV, e por que ela não substitui um backoffice de verdade.
---

# Painel admin

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Uma loja que seu cliente consegue ajustar sozinho — e uma visão honesta do que
esse painel é e do que ele não é.

</div>

## O que é

`<CatalogApp />` monta uma tela de administração em `/admin` com quatro abas:

| Aba | O que o dono muda |
|---|---|
| Dashboard | Um panorama do catálogo atual |
| Configurações | Identidade, contato, WhatsApp, Pix, moeda, logo, favicon, ids de analytics |
| Catálogo | Importar e exportar produtos em CSV, imprimir uma folha de catálogo |
| Marketing | Códigos de cupom e seus valores |

Tudo que ele grava vai para `localStorage`, em `ecom-site-config` e
`ecom-imported-products`.

:::danger Isso é local ao navegador, e sem proteção
**Não existe autenticação** em `/admin`, e nada do que ele salva sai do
navegador do visitante. É uma conveniência para uma loja de um operador só, uma
demonstração, ou uma prévia para o cliente — não é um backoffice.

Para qualquer coisa séria: desligue a rota e gerencie os dados pelo seu
[data provider](./data.md).
:::

```tsx
<CatalogApp disableAdmin />
```

## Importação e exportação em CSV

A aba de catálogo lê e escreve CSV, que é como um dono de loja pequena de fato
mantém uma lista de produtos.

```tsx
import {
  productsToCsv,
  parseProductsCsv,
  downloadProductsCsv,
  openCatalogPrintable,
} from '@neverleans-labs/plug-store-core';

// Exportar
downloadProductsCsv(products, 'catalogo.csv');

// Ou pegar a string
const csv = productsToCsv(products);

// Importar
const products = parseProductsCsv(csvText, 'fashion');

// Uma folha de catálogo pronta para impressão em nova janela
openCatalogPrintable(products, 'Bloom Cosméticos');
```

Produtos importados são guardados por id de tema e mesclados sobre o catálogo de
demonstração:

```tsx
import {
  setImportedProducts,
  getImportedProducts,
  clearImportedProducts,
} from '@neverleans-labs/plug-store-core';

setImportedProducts('fashion', products);
clearImportedProducts('fashion');
```

:::info A importação só afeta o provider de demonstração
Essas funções gravam no armazenamento do navegador que o provider de
demonstração lê. Quando você fornece o seu próprio `dataProvider`, ele é a fonte
da verdade e os produtos importados não são consultados. Importe no seu backend.
:::

## Prévia como cliente

As configurações incluem um botão de "visualizar como cliente", guardado em
`previewAsCustomer`. Ele esconde os controles de dono para que o cliente veja a
loja do jeito que o comprador vai ver.

## Substituindo o painel

O painel é uma página comum, então a abordagem usual em um projeto sério é
desligá-lo e construir o seu atrás da sua autenticação:

```tsx
<CatalogProvider dataProvider={provider}>
  <Routes>
    <Route path="/*" element={<Loja />} />
    <Route path="/gerenciar/*" element={<ExigeAuth><MeuAdmin /></ExigeAuth>} />
  </Routes>
</CatalogProvider>
```

Dentro dele, `useSiteConfig().updateConfig` te dá as mesmas alavancas que o
painel embutido usa.

## Próximos passos

- [Configuração da loja](./configuration.md)
- [Data providers](./data.md)
