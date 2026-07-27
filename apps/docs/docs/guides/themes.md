---
id: themes
title: Themes
sidebar_label: Themes
sidebar_position: 2
description: Pick one of the 50 built-in industry themes, or build your client's brand with defineTheme — every colour token, font and layout style explained.
---

# Themes

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

A store in your client's exact colours and typography, and an understanding of
why changing `defaultTheme` sometimes appears to do nothing.

</div>

## Using a built-in theme

```tsx
<CatalogApp defaultTheme="coffee" />
```

That is the whole API. Fifty ids are available — see the
[theme gallery](../themes/gallery.mdx) for all of them with previews, or browse
them live in the [demo](pathname:///demo/).

Each theme carries its own palette, heading and body fonts, hero layout, card
style, nav style, brand name, tagline and hero copy. They are not one template
recoloured fifty times.

## Building your client's brand

`defineTheme` fills in a sensible base and lets you override only what matters.

```tsx
import { defineTheme } from '@neverleans-labs/plug-store-themes';
import { CatalogApp } from '@neverleans-labs/plug-store-core';

const bloom = defineTheme({
  id: 'bloom',
  name: 'BLOOM COSMETICS',
  tagline: 'Clean beauty, delivered',
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

`id`, `name` and `tagline` are required; everything else falls back to the base
theme. `customTheme` takes precedence over `defaultTheme`.

:::warning Colours are HSL channels, without `hsl()`
Every colour is three space-separated values: `340 65% 47%`. Not `#d92f6a`, not
`hsl(340 65% 47%)`. They are injected as CSS custom properties and composed by
Tailwind as `hsl(var(--primary))`, so the wrapper has to be absent.
:::

### Colour tokens

| Token | Used for |
|---|---|
| `primary` | Buttons, active states, badges, price highlights |
| `primaryForeground` | Text on top of `primary` |
| `secondary` | Secondary buttons and surfaces |
| `secondaryForeground` | Text on `secondary` |
| `accent` | Hover states, small highlights |
| `accentForeground` | Text on `accent` |
| `background` | Page background |
| `foreground` | Default body text |
| `card` | Product cards, panels |
| `cardForeground` | Text inside cards |
| `muted` | Skeletons, disabled surfaces, chips |
| `mutedForeground` | Secondary text |
| `border` | All borders and dividers |
| `heroGradientFrom` | Hero gradient start |
| `heroGradientTo` | Hero gradient end |

### Fonts

```ts
fonts: {
  heading: '"Playfair Display", serif',
  body: '"Inter", sans-serif',
}
```

PlugStore does not load webfonts for you. Add the `<link>` to your `index.html`
or `@import` it in your CSS — otherwise the browser falls back to the next
family in the stack.

### Layout styles

`heroStyle` picks the home page hero:

`fullwidth` · `split` · `centered` · `overlay` · `minimal` · `energetic` ·
`editorial` · `playful` · `industrial` · `gallery`

`cardStyle` picks the product card treatment:

`rounded` · `sharp` · `elevated` · `bordered` · `minimal` · `tilted` · `paper` ·
`soft` · `metal` · `frame`

`navStyle` picks the header treatment:

`standard` · `centered` · `minimal` · `bold` · `elegant`

An optional `heroImage` overrides the hero background image path.

## Extending a built-in theme

Spread one of the shipped themes and change only what the client needs:

```tsx
import { themeConfigs } from '@neverleans-labs/plug-store-themes';
import { defineTheme } from '@neverleans-labs/plug-store-themes';

const base = themeConfigs.find((t) => t.id === 'coffee')!;

const myRoastery = defineTheme({
  ...base,
  id: 'my-roastery',
  name: 'SERRA ROASTERS',
  tagline: 'Single origin, roasted weekly',
  colors: { ...base.colors, primary: '25 70% 38%' },
});
```

## Letting visitors switch themes

`ThemeSwitcher` renders a picker over all 50. Useful for a demo or an agency
showcase; usually not something a real store ships.

```tsx
import { ThemeSwitcher } from '@neverleans-labs/plug-store-core';
```

To read or set the theme yourself:

```tsx
import { useTheme } from '@neverleans-labs/plug-store-core';

const { theme, template, setTemplate } = useTheme();
// theme    → the full ThemeConfig currently applied
// template → its id, e.g. 'coffee'
// setTemplate('bakery') → switches and persists
```

## `defaultTheme` vs stored theme {#defaulttheme-vs-stored-theme}

The selected theme is persisted to `localStorage` under `ecom-template`, so a
returning visitor sees the same store they left.

That created a trap: a visitor who had ever loaded any PlugStore site was
pinned to the stored value, and changing `defaultTheme` in code did nothing for
them. The provider now also records which `defaultTheme` produced the stored
value, in `ecom-template-default`. When you change the prop, the new value
wins; when you do not, the visitor's own choice survives.

If you are testing and want a clean slate:

```js
localStorage.removeItem('ecom-template');
localStorage.removeItem('ecom-template-default');
```

## Next

- [Browse all 50 themes](../themes/gallery.mdx)
- [Build a client brand theme end to end](../recipes/brand-theme.md)
- [Configure the store](./configuration.md)
