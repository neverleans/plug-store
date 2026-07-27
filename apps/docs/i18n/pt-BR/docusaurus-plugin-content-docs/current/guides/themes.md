---
id: themes
title: Temas
sidebar_label: Temas
sidebar_position: 2
description: Escolha um dos 50 temas por segmento, ou construa a marca do seu cliente com defineTheme — cada token de cor, fonte e estilo de layout explicado.
---

# Temas

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Uma loja nas cores e na tipografia exatas do seu cliente, e o entendimento de
por que mudar `defaultTheme` às vezes parece não fazer nada.

</div>

## Usar um tema pronto

```tsx
<CatalogApp defaultTheme="coffee" />
```

É toda a API. Cinquenta ids estão disponíveis — veja a
[galeria de temas](../themes/gallery.mdx) com prévias, ou navegue por eles ao
vivo no [demo](pathname:///demo/).

Cada tema carrega paleta, fontes de título e corpo, layout de hero, estilo de
card, estilo de navegação, nome de marca, slogan e textos de hero próprios. Não
é um template recolorido cinquenta vezes.

## Construir a marca do seu cliente

`defineTheme` preenche uma base sensata e deixa você sobrescrever só o que
importa.

```tsx
import { defineTheme } from '@neverleans-labs/plug-store-themes';
import { CatalogApp } from '@neverleans-labs/plug-store-core';

const bloom = defineTheme({
  id: 'bloom',
  name: 'BLOOM COSMÉTICOS',
  tagline: 'Beleza limpa, entregue em casa',
  colors: {
    primary: '340 65% 47%',
    primaryForeground: '0 0% 100%',
    background: '20 40% 98%',
    heroGradientFrom: '340 60% 40%',
    heroGradientTo: '20 70% 60%',
  },
  fonts: {
    heading: '"Playfair Display", serif',
    body: '"Inter", sans-serif',
  },
  heroStyle: 'split',
  cardStyle: 'rounded',
  navStyle: 'elegant',
});

export default function App() {
  return <CatalogApp customTheme={bloom} />;
}
```

`id`, `name` e `tagline` são obrigatórios; todo o resto cai para o tema base.
`customTheme` tem precedência sobre `defaultTheme`.

:::warning Cores são canais HSL, sem o `hsl()`
Toda cor são três valores separados por espaço: `340 65% 47%`. Não `#d92f6a`,
não `hsl(340 65% 47%)`. Elas são injetadas como custom properties do CSS e
compostas pelo Tailwind como `hsl(var(--primary))`, então o invólucro precisa
estar ausente.
:::

### Tokens de cor

| Token | Usado em |
|---|---|
| `primary` | Botões, estados ativos, selos, destaque de preço |
| `primaryForeground` | Texto sobre `primary` |
| `secondary` | Botões e superfícies secundárias |
| `secondaryForeground` | Texto sobre `secondary` |
| `accent` | Estados de hover, destaques pequenos |
| `accentForeground` | Texto sobre `accent` |
| `background` | Fundo da página |
| `foreground` | Texto padrão |
| `card` | Cards de produto, painéis |
| `cardForeground` | Texto dentro de cards |
| `muted` | Skeletons, superfícies desabilitadas, chips |
| `mutedForeground` | Texto secundário |
| `border` | Todas as bordas e divisórias |
| `heroGradientFrom` | Início do gradiente do hero |
| `heroGradientTo` | Fim do gradiente do hero |

### Fontes

```ts
fonts: {
  heading: '"Playfair Display", serif',
  body: '"Inter", sans-serif',
}
```

O PlugStore não carrega webfonts para você. Adicione o `<link>` no seu
`index.html` ou um `@import` no seu CSS — senão o navegador cai para a próxima
família da pilha.

### Estilos de layout

`heroStyle` escolhe o hero da home:

`fullwidth` · `split` · `centered` · `overlay` · `minimal` · `energetic` ·
`editorial` · `playful` · `industrial` · `gallery`

`cardStyle` escolhe o tratamento do card de produto:

`rounded` · `sharp` · `elevated` · `bordered` · `minimal` · `tilted` · `paper` ·
`soft` · `metal` · `frame`

`navStyle` escolhe o tratamento do header:

`standard` · `centered` · `minimal` · `bold` · `elegant`

Um `heroImage` opcional sobrescreve o caminho da imagem de fundo do hero.

## Estender um tema pronto

`themeConfigs` é um record indexado pelo id do tema, então busque pela chave:

```tsx
import { themeConfigs, defineTheme } from '@neverleans-labs/plug-store-themes';

const base = themeConfigs.coffee;

const minhaTorrefacao = defineTheme({
  ...base,
  id: 'minha-torrefacao',
  name: 'SERRA ROASTERS',
  tagline: 'Grão único, torrado toda semana',
  colors: { ...base.colors, primary: '25 70% 38%' },
});
```

## Deixar o visitante trocar de tema

`ThemeSwitcher` renderiza um seletor com os 50. Útil para um demo ou uma vitrine
de agência; normalmente não é algo que uma loja real publica.

```tsx
import { ThemeSwitcher } from '@neverleans-labs/plug-store-core';
```

Para ler ou definir o tema por conta própria:

```tsx
import { useTheme } from '@neverleans-labs/plug-store-core';

const { theme, template, setTemplate } = useTheme();
// theme    → o ThemeConfig completo aplicado agora
// template → o id dele, ex.: 'coffee'
// setTemplate('bakery') → troca e persiste
```

## `defaultTheme` versus tema guardado {#defaulttheme-vs-stored-theme}

O tema selecionado é persistido em `localStorage` na chave `ecom-template`, para
que quem volta veja a mesma loja que deixou.

Isso criou uma armadilha: quem já tinha carregado qualquer site PlugStore ficava
preso ao valor guardado, e mudar `defaultTheme` no código não fazia nada para
essa pessoa. Agora o provider também registra qual `defaultTheme` gerou o valor
guardado, em `ecom-template-default`. Quando você muda a prop, o novo valor
vence; quando você não muda, a escolha do visitante sobrevive.

Se você está testando e quer começar do zero:

```js
localStorage.removeItem('ecom-template');
localStorage.removeItem('ecom-template-default');
```

## Próximos passos

- [Ver os 50 temas](../themes/gallery.mdx)
- [Criar um tema de marca do início ao fim](../recipes/brand-theme.md)
- [Configurar a loja](./configuration.md)
