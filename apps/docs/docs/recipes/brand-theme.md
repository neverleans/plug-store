---
id: brand-theme
title: Build a client brand theme
sidebar_label: Client brand theme
sidebar_position: 4
description: Turning a client's brand guidelines into a PlugStore theme — converting hex to HSL channels, loading fonts, and checking contrast.
---

# Build a client brand theme

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

A theme that matches a real brand guide, with readable contrast in both light
and dark mode.

</div>

## Step 1 — convert the palette

Themes take **HSL channels without the `hsl()` wrapper**, because Tailwind
composes them as `hsl(var(--primary))` and needs the raw values to apply
opacity.

`#D92F6A` becomes `340 65% 52%`.

```js
// Paste into the browser console to convert a hex from a brand guide.
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

## Step 2 — load the fonts

PlugStore does not fetch webfonts. Add them before anything renders:

```html title="index.html"
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

## Step 3 — define the theme

```ts title="src/theme.ts"
import { defineTheme } from '@neverleans-labs/plug-store-themes';

export const bloom = defineTheme({
  id: 'bloom',
  name: 'BLOOM COSMETICS',
  tagline: 'Clean beauty, delivered',

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

## Step 4 — apply it

```tsx title="src/App.tsx"
import { CatalogApp } from '@neverleans-labs/plug-store-core';
import { bloom } from './theme';

export default function App() {
  return (
    <CatalogApp
      customTheme={bloom}
      config={{ companyName: 'Bloom Cosmetics', currency: 'BRL' }}
    />
  );
}
```

`customTheme` wins over `defaultTheme`, so you can drop the latter.

## Step 5 — check contrast

The pairs that must stay readable:

| Foreground | Background |
|---|---|
| `primaryForeground` | `primary` |
| `secondaryForeground` | `secondary` |
| `accentForeground` | `accent` |
| `foreground` | `background` |
| `cardForeground` | `card` |
| `mutedForeground` | `muted` |
| `primaryForeground` | the hero gradient, at both ends |

A brand's signature colour is often too light for white text. When the contrast
ratio falls below 4.5:1, darken the *token* rather than the brand: use the brand
colour for large hero areas and a darkened variant for buttons and small text.

## Step 6 — dark mode

The store ships a dark mode toggle. PlugStore derives dark surfaces from your
tokens, so verify it rather than assuming — a near-white `card` will glow
against a dark page. Override in your own CSS if a token needs a different value
in dark mode:

```css title="src/index.css"
.dark {
  --card: 25 20% 12%;
  --card-foreground: 30 30% 94%;
}
```

Remember your stylesheet is imported *after* the library's, so these win.

## Starting from a built-in theme

When the brief is close to something that ships, extend instead of starting from
scratch:

```ts
import { themeConfigs, defineTheme } from '@neverleans-labs/plug-store-themes';

const base = themeConfigs.find((theme) => theme.id === 'beauty')!;

export const bloom = defineTheme({
  ...base,
  id: 'bloom',
  name: 'BLOOM COSMETICS',
  tagline: 'Clean beauty, delivered',
  colors: { ...base.colors, primary: '340 65% 52%' },
});
```

## Next

- [Theme reference](../guides/themes.md)
- [All 50 themes](../themes/gallery.mdx)
