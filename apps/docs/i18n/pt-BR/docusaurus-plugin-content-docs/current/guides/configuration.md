---
id: configuration
title: Configuração da loja
sidebar_label: Configuração
sidebar_position: 1
description: Todas as opções de CatalogConfig — identidade da loja, moeda, WhatsApp, Pix, redes sociais e analytics — e como a configuração em runtime sobrescreve tudo isso.
---

# Configuração da loja

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Uma loja que mostra sua marca, seus canais de contato e seus dados de pagamento,
e o entendimento de por que o painel admin consegue sobrescrever qualquer coisa.

</div>

## Passando a configuração

`config` aceita um objeto `CatalogConfig`. Todo campo é opcional.

```tsx
<CatalogApp
  config={{
    companyName: 'Bloom Cosméticos',
    tagline: 'Beleza limpa, entregue em casa',
    currency: 'BRL',
    whatsappPhone: '5511999998888',
    pixKey: 'bloom@example.com',
    pixMerchantCity: 'Sao Paulo',
  }}
/>
```

## Todas as opções

### Identidade

| Opção | Tipo | Onde aparece |
|---|---|---|
| `companyName` | `string` | Marca no header, rodapé, mensagens de pedido. Cai para o nome do tema |
| `tagline` | `string` | Rodapé, abaixo da marca. Cai para o slogan do tema |
| `footerText` | `string` | Linha de copyright do rodapé |
| `shippingBanner` | `string` | A faixa fina acima do header |
| `logoDataUrl` | `string` | Imagem em base64 ao lado da marca no header |
| `faviconDataUrl` | `string` | Imagem em base64 injetada como favicon |

### Contato e redes

| Opção | Tipo | Observações |
|---|---|---|
| `contactEmail` | `string` | Rodapé e página de contato |
| `contactPhone` | `string` | Rodapé e página de contato |
| `address` | `string` | Rodapé e página de contato |
| `whatsappPhone` | `string` | **Só dígitos, com código do país** — `5511999998888`. Alimenta o ícone no rodapé, o botão flutuante de pedido e o checkout por WhatsApp |
| `instagramUrl` | `string` | URL completa |
| `tiktokUrl` | `string` | URL completa |
| `facebookUrl` | `string` | URL completa |

### Comércio

| Opção | Tipo | Observações |
|---|---|---|
| `currency` | `'BRL' \| 'USD' \| 'EUR'` | Só formatação — veja [Moeda](./i18n-currency.md). Preços nunca são convertidos |
| `pixKey` | `string` | CPF, CNPJ, e-mail, telefone ou chave aleatória. Habilita a opção Pix no checkout |
| `pixMerchantCity` | `string` | Máximo 15 caracteres, ASCII. Cai para `BRASIL` se vazio |
| `publicSlug` | `string` | Rota do catálogo público: `minha-loja` serve `/c/minha-loja` |

:::info Pix exige BRL
O checkout só oferece Pix quando `currency` é `BRL` **e** `pixKey` está
preenchida. Um código Pix em euros não seria pagável.
:::

### Analytics

| Opção | Tipo | Observações |
|---|---|---|
| `gaId` | `string` | ID de medição do GA4, `G-XXXXXXXX` |
| `metaPixelId` | `string` | ID numérico do Meta Pixel |

Preencher qualquer um injeta o script e passa a emitir `view_item`,
`add_to_cart`, `begin_checkout` e `purchase`. Veja
[Analytics](./seo-analytics.md).

## `config` é semente, não trava

Isso costuma surpreender, então vale ser explícito.

`config` é **mesclado no `localStorage` quando o provider monta**, sob a chave
`ecom-site-config`. A partir daí a loja lê a cópia guardada, que o painel admin
pode editar em tempo de execução.

Consequências:

- Mudar um valor em `config` e recarregar **atualiza** a loja, porque a mescla
  roda a cada montagem e a sua prop vence.
- O que um admin mudou no painel persiste naquele navegador até a mesma chave
  ser passada em `config` de novo.
- Limpar os dados do site devolve a loja ao que `config` disser.

Para ler ou mudar a configuração a partir dos seus componentes:

```tsx
import { useSiteConfig } from '@neverleans-labs/plug-store-core';

function AvisoDeFrete() {
  const { config, updateConfig } = useSiteConfig();

  return (
    <button onClick={() => updateConfig({ shippingBanner: 'Frete grátis hoje' })}>
      {config.shippingBanner}
    </button>
  );
}
```

## Cupons

Cupons vivem na configuração de runtime, e não em `CatalogConfig`, porque são
algo que o dono da loja muda com frequência. Quatro vêm por padrão:

| Código | Efeito |
|---|---|
| `SAVE10` | 10% de desconto |
| `SAVE20` | 20% de desconto |
| `WELCOME5` | 5 a menos no total |
| `FREESHIP` | Zera o frete |

Substitua via `updateConfig`:

```tsx
const { updateConfig } = useSiteConfig();

updateConfig({
  coupons: [
    { code: 'BLOOM15', type: 'percent', value: 15, label: '15% off' },
    { code: 'FRETEGRATIS', type: 'flat', value: 0, label: 'Frete grátis' },
  ],
});
```

## Outras props do provider

Ficam ao lado de `config`, não dentro dele:

| Prop | Tipo | Para quê |
|---|---|---|
| `defaultTheme` | `string` | Id do tema inicial — veja [Temas](./themes.md) |
| `customTheme` | `ThemeConfig` | Um tema criado com `defineTheme` |
| `defaultLanguage` | `'pt' \| 'en'` | Idioma inicial da interface |
| `dataProvider` | `CatalogDataProvider` | Seu backend — veja [Data providers](./data.md) |
| `queryClient` | `QueryClient` | Compartilhar o cache do react-query com o app anfitrião |

## Próximos passos

- [Escolher ou criar um tema](./themes.md)
- [Conectar seu backend](./data.md)
