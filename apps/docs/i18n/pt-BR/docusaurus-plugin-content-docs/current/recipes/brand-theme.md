---
id: brand-theme
title: Criar o tema da marca do cliente
sidebar_label: Tema de marca
sidebar_position: 4
description: Transformando o manual de marca de um cliente em um tema PlugStore — converter hex para canais HSL, carregar fontes e conferir contraste.
---

# Criar o tema da marca do cliente

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Um tema que combina com um manual de marca real, com contraste legível no modo
claro e no escuro.

</div>

## Passo 1 — converter a paleta

Temas recebem **canais HSL sem o invólucro `hsl()`**, porque o Tailwind os compõe
como `hsl(var(--primary))` e precisa dos valores crus para aplicar opacidade.

`#D92F6A` vira `340 65% 52%`.

```js
// Cole no console do navegador para converter um hex do manual de marca.
const toHslChannels = (hex) => {
  const [r, g, b] = hex.replace('#', '').match(/../g).map((h) => parseInt(h, 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  return `${h} ${(s * 100).toFixed(0)}% ${(l * 100).toFixed(0)}%`;
};

toHslChannels('#D92F6A'); // "340 65% 52%"
```

## Passo 2 — carregar as fontes

O PlugStore não busca webfonts. Adicione antes de qualquer coisa renderizar:

```html title="index.html"
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

## Passo 3 — definir o tema

```ts title="src/theme.ts"
import { defineTheme } from '@neverleans-labs/plug-store-themes';

export const bloom = defineTheme({
  id: 'bloom',
  name: 'BLOOM COSMÉTICOS',
  tagline: 'Beleza limpa, entregue em casa',

  colors: {
    primary: '340 65% 52%',
    primaryForeground: '0 0% 100%',

    secondary: '25 30% 22%',
    secondaryForeground: '30 40% 96%',

    accent: '20 85% 62%',
    accentForeground: '25 40% 12%',

    background: '30 40% 98%',
    foreground: '25 30% 14%',

    card: '0 0% 100%',
    cardForeground: '25 30% 14%',

    muted: '30 25% 94%',
    mutedForeground: '25 12% 46%',

    border: '30 22% 88%',

    heroGradientFrom: '340 60% 42%',
    heroGradientTo: '20 75% 58%',
  },

  fonts: {
    heading: '"Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
  },

  heroStyle: 'split',
  cardStyle: 'rounded',
  navStyle: 'elegant',
});
```

## Passo 4 — aplicar

```tsx title="src/App.tsx"
import { CatalogApp } from '@neverleans-labs/plug-store-core';
import { bloom } from './theme';

export default function App() {
  return (
    <CatalogApp
      customTheme={bloom}
      config={{ companyName: 'Bloom Cosméticos', currency: 'BRL' }}
    />
  );
}
```

`customTheme` vence o `defaultTheme`, então dá para remover o segundo.

## Passo 5 — conferir contraste

Os pares que precisam continuar legíveis:

| Frente | Fundo |
|---|---|
| `primaryForeground` | `primary` |
| `secondaryForeground` | `secondary` |
| `accentForeground` | `accent` |
| `foreground` | `background` |
| `cardForeground` | `card` |
| `mutedForeground` | `muted` |
| `primaryForeground` | o gradiente do hero, nas duas pontas |

A cor de assinatura de uma marca costuma ser clara demais para texto branco.
Quando a razão de contraste cai abaixo de 4,5:1, escureça o *token*, não a
marca: use a cor da marca em grandes áreas de hero e uma variante mais escura em
botões e textos pequenos.

## Passo 6 — modo escuro

A loja traz um botão de modo escuro. O PlugStore deriva as superfícies escuras
dos seus tokens, então verifique em vez de supor — um `card` quase branco vai
brilhar contra uma página escura. Sobrescreva no seu CSS se algum token precisar
de outro valor no escuro:

```css title="src/index.css"
.dark {
  --card: 25 20% 12%;
  --card-foreground: 30 30% 94%;
}
```

Lembre que a sua folha de estilo é importada *depois* da biblioteca, então estes
valores vencem.

## Partindo de um tema pronto

Quando o briefing está perto de algo que já existe, estenda em vez de começar do
zero:

```ts
import { themeConfigs, defineTheme } from '@neverleans-labs/plug-store-themes';

// themeConfigs é um record indexado pelo id do tema.
const base = themeConfigs.beauty;

export const bloom = defineTheme({
  ...base,
  id: 'bloom',
  name: 'BLOOM COSMÉTICOS',
  tagline: 'Beleza limpa, entregue em casa',
  colors: { ...base.colors, primary: '340 65% 52%' },
});
```

## Próximos passos

- [Referência de temas](../guides/themes.md)
- [Ver os 50 temas](../themes/gallery.mdx)
