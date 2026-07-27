---
id: i18n-currency
title: Idioma e moeda
sidebar_label: Idioma e moeda
sidebar_position: 7
description: Alternar a interface entre português e inglês, formatar valores em BRL, USD e EUR, e por que o PlugStore nunca converte preços.
---

# Idioma e moeda

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Uma loja no idioma certo com preços formatados corretamente — e o entendimento
de por que a configuração de moeda nunca pode ser tratada como conversor.

</div>

## Idioma

Português e inglês vêm prontos. Defina o idioma inicial e deixe o visitante
trocar pelo botão de globo no header.

```tsx
<CatalogApp defaultLanguage="pt" />
```

```tsx
import { useLanguage } from '@neverleans-labs/plug-store-core';

function Saudacao() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <>
      <h1>{t.allProducts}</h1>
      <button onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}>
        {language === 'pt' ? 'EN' : 'PT'}
      </button>
    </>
  );
}
```

`t` é um objeto plano de textos de interface. `defaultLanguage` só vale na
primeira visita; depois disso a escolha do visitante é guardada e vence.

### Conteúdo que não está em `t`

Nomes de categoria, slogans de tema e subtítulos de hero vêm de dados, não da
tabela de tradução, então são localizados por funções auxiliares:

```tsx
import {
  localizeCategory,
  localizeTagline,
  localizeTemplate,
} from '@neverleans-labs/plug-store-core';

localizeCategory('Dresses', 'pt');      // nome da categoria
localizeTagline('coffee', fallback, 'pt');
localizeTemplate('coffee', 'pt');       // rótulo legível de um id de tema
```

O que vem do *seu* backend passa intacto — traduza do seu lado se precisar.

## Moeda

```tsx
<CatalogApp config={{ currency: 'BRL' }} />
```

| Código | Símbolo | Locale de formatação |
|---|---|---|
| `BRL` | R$ | `pt-BR` |
| `USD` | $ | `en-US` |
| `EUR` | € | `de-DE` |

A formatação passa por `Intl.NumberFormat`, então agrupamento e separador
decimal seguem o locale: `R$ 1.234,56` contra `$1,234.56`.

### Formata, não converte

:::danger Não existe taxa de câmbio
`currency` muda como um número é *exibido*. Um produto com preço `199.9` aparece
como `R$ 199,90`, `$199.90` ou `199,90 €` — o mesmo valor, três símbolos.

O PlugStore já multiplicava os preços por uma taxa fixa, então uma loja em BRL
mostrava tudo por cerca de cinco vezes o valor real. Isso acabou. Uma loja opera
em uma moeda e os preços dela são guardados nessa moeda.
:::

Se você realmente precisa de multimoeda, converta no seu backend e devolva
preços já convertidos pelo seu [data provider](./data.md).

### Formatar valores por conta própria

```tsx
import { useMoney, formatMoney, CURRENCIES } from '@neverleans-labs/plug-store-core';

function Preco({ amount }: { amount: number }) {
  const money = useMoney();      // preso à moeda da loja
  return <span>{money(amount)}</span>;
}
```

`money` também carrega `money.currency` e `money.symbol`. Fora de um provider,
`formatMoney(valor, 'BRL')` faz o mesmo com o código explícito, e `CURRENCIES`
expõe a tabela de símbolo e locale.

## Próximos passos

- [Configuração da loja](./configuration.md)
- [Totais do carrinho](./cart-wishlist.md)
