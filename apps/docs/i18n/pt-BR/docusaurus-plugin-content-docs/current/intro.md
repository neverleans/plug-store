---
id: intro
title: O que é o PlugStore?
sidebar_label: O que é o PlugStore?
sidebar_position: 1
description: Framework open source em React e Tailwind para catálogos de produtos e lojas online, com 50 temas por segmento, data providers headless, checkout por WhatsApp e Pix, PWA e SEO já embutidos.
---

# O que é o PlugStore?

O PlugStore é um **framework pronto de catálogo e e-commerce para React**. Um
comando entrega uma loja completa — rotas, grade de produtos, filtros, busca,
carrinho, lista de desejos, comparador, checkout, páginas de conta, PWA e SEO —
que você molda depois na marca que precisa.

Não é uma biblioteca de componentes para você montar uma loja. É a loja, com
cada parte exposta para você trocar o que quiser.

```bash
npm create plug-store minha-loja
```

## Os três pacotes

Tudo é publicado sob a licença Apache-2.0. Os três sobem juntos, sempre no
mesmo número de versão.

| Pacote | O que é |
|---|---|
| [`@neverleans-labs/plug-store-core`](https://www.npmjs.com/package/@neverleans-labs/plug-store-core) | O framework: `CatalogApp`, providers, contextos, hooks, páginas, componentes, checkout e PWA. |
| [`@neverleans-labs/plug-store-themes`](https://www.npmjs.com/package/@neverleans-labs/plug-store-themes) | Os 50 temas e o utilitário `defineTheme` para marcas próprias. |
| [`create-plug-store`](https://www.npmjs.com/package/create-plug-store) | A CLI que gera um projeto já configurado. |

## Duas formas de usar

**Pronto para usar.** Renderize `<CatalogApp />`, passe um objeto de
configuração, e a loja funciona. É o que a CLI gera.

```tsx
import { CatalogApp } from '@neverleans-labs/plug-store-core';
import '@neverleans-labs/plug-store-core/dist/index.css';

export default function App() {
  return (
    <CatalogApp
      defaultTheme="beauty"
      config={{ companyName: 'Bloom Cosméticos', currency: 'BRL' }}
    />
  );
}
```

**Headless.** Envolva a sua própria interface em `<CatalogProvider />` e consuma
os contextos e hooks direto — `useCart`, `useCheckout`, `useProducts`,
`useTheme`. Você fica com a máquina de estado e os adaptadores de pagamento, sem
nada do layout.

Veja [Como funciona](./architecture.md) para entender a relação entre os dois.

## O que faz diferença

- **50 temas que são de fato diferentes.** Cada um carrega paleta, tipografia,
  layout de hero, estilo de card e textos próprios. A loja de café não parece a
  de eletrônicos.
- **Pix que escaneia.** O checkout emite um BR Code EMV/BCB real, com o CRC-16
  exigido pela especificação, então o app do banco resolve para a sua chave.
  Veja [Pagamentos Pix](./guides/pix.md).
- **Checkout por WhatsApp.** Para o número enorme de lojas brasileiras que
  fecham pedido no chat, o pedido vira uma mensagem já preenchida.
- **Seu backend, não o nosso.** Um data provider são cinco funções assíncronas.
  Aponte a loja para REST, Supabase, Firebase, Prisma ou GraphQL.

## Quando *não* usar o PlugStore

Ser honesto aqui economiza uma semana sua:

- **Você precisa de um ERP ou marketplace completo.** O PlugStore é a vitrine.
  Não tem conciliação de estoque, split de pagamento entre vendedores nem
  emissão de nota fiscal.
- **Você precisa de renderização no servidor para SEO em escala.** O PlugStore é
  uma SPA React que roda no cliente. Ele emite JSON-LD e meta tags corretos, o
  que basta para a maioria dos catálogos, mas se busca orgânica é seu principal
  canal de aquisição com milhares de SKUs, prefira um starter de commerce em
  Next.js.
- **Você precisa de confirmação automática de pagamento.** O Pix embutido é
  *estático*: ele cria uma cobrança válida, mas nada avisa o seu app de que o
  dinheiro entrou. Conciliação exige integração com um PSP, que você pluga pela
  [interface de adaptadores](./guides/checkout.md#custom-adapters).
- **Você quer um kit de UI headless.** Se você só quer primitivos sem estilo, use
  Radix ou shadcn/ui direto — o PlugStore é opinativo sobre a vitrine.

## Licença e a camada paga

O framework, a CLI, os 50 temas, os data providers, o checkout (Pix incluído) e
o motor de PWA são **Apache-2.0, permanentemente**. Tudo documentado neste site
é gratuito.

Existe um estudo de camada comercial separada para agências — integrações
mantidas e ferramentas de operação, não componentes atrás de paywall. Nada
descrito nesta documentação depende dela.

## Próximos passos

- [Crie sua primeira loja](./getting-started/cli.md) com a CLI.
- [Entenda a arquitetura](./architecture.md) antes de se comprometer.
- [Veja os 50 temas](./themes/gallery.mdx) para saber de onde você parte.
