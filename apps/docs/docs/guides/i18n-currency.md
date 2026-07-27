---
id: i18n-currency
title: Language and currency
sidebar_label: Language & currency
sidebar_position: 7
description: Switching the interface between Portuguese and English, formatting money for BRL, USD and EUR, and why PlugStore never converts prices.
---

# Language and currency

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

A store in the right language with correctly formatted prices — and you will
know why the currency setting must never be treated as a converter.

</div>

## Language

Portuguese and English ship. Set the starting language and let visitors switch
from the globe button in the header.

```tsx
<CatalogApp defaultLanguage="pt" />
```

```tsx
import { useLanguage } from '@neverleans-labs/plug-store-core';

function Greeting() {
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

`t` is a flat object of UI strings. `defaultLanguage` only applies on a first
visit; after that the visitor's choice is stored and wins.

### Content that is not in `t`

Category names, theme taglines and hero subtitles come from data, not from the
translation table, so they are localised by helper functions:

```tsx
import {
  localizeCategory,
  localizeTagline,
  localizeTemplate,
} from '@neverleans-labs/plug-store-core';

localizeCategory('Dresses', 'pt');      // category name
localizeTagline('coffee', fallback, 'pt');
localizeTemplate('coffee', 'pt');       // human label for a theme id
```

Anything coming from *your* backend is passed through untouched — translate it
on your side if you need to.

## Currency

```tsx
<CatalogApp config={{ currency: 'BRL' }} />
```

| Code | Symbol | Formatting locale |
|---|---|---|
| `BRL` | R$ | `pt-BR` |
| `USD` | $ | `en-US` |
| `EUR` | € | `de-DE` |

Formatting goes through `Intl.NumberFormat`, so grouping and decimal separators
follow the locale: `R$ 1.234,56` versus `$1,234.56`.

### It formats, it does not convert

:::danger There is no exchange rate
`currency` changes how a number is *displayed*. A product priced `199.9` shows
as `R$ 199,90` or `$199.90` or `199,90 €` — the same amount, three symbols.

PlugStore used to multiply prices by a hardcoded rate, so a BRL store showed
every price at roughly five times its real value. That is gone. A store operates
in one currency and its prices are stored in that currency.
:::

If you genuinely need multi-currency, convert on your backend and return
already-converted prices from your [data provider](./data.md).

### Formatting money yourself

```tsx
import { useMoney, formatMoney, CURRENCIES } from '@neverleans-labs/plug-store-core';

function Price({ amount }: { amount: number }) {
  const money = useMoney();      // bound to the store's currency
  return <span>{money(amount)}</span>;
}
```

`money` also carries `money.currency` and `money.symbol`. Outside a provider,
`formatMoney(amount, 'BRL')` does the same job with an explicit code, and
`CURRENCIES` exposes the symbol/locale table.

## Next

- [Store configuration](./configuration.md)
- [Cart totals](./cart-wishlist.md)
