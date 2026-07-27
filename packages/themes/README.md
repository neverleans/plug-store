# @neverleans-labs/plug-store-themes

> 50 ready-made industry design themes and the `defineTheme` customizer for the
> [PlugStore Framework](https://neverleans.github.io/plug-store/).

**[Browse all 50 themes, live](https://neverleans.github.io/plug-store/docs/themes/gallery) · [Documentation](https://neverleans.github.io/plug-store/) · [Em português](https://neverleans.github.io/plug-store/pt-BR/)**

[![npm](https://img.shields.io/npm/v/@neverleans-labs/plug-store-themes.svg?color=orange)](https://www.npmjs.com/package/@neverleans-labs/plug-store-themes)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](https://github.com/neverleans/plug-store/blob/master/LICENSE)

## Installation

```bash
npm install @neverleans-labs/plug-store-themes @neverleans-labs/plug-store-core
```

## Built-in themes

Fifty curated design systems covering fashion, tech, food, furniture, beauty, sports,
books, pets, automotive, art, jewelry, homeware, market, wellness, stationery, winery,
brewery, coffee, bakery, spices, chocolates, gaming, geek, music, boardgames, toys,
hardware, lighting, gardening, office, security, cycling, outdoors, fishing, fitness,
combat, motorcycles, optics, dental, medical, pharmacy, watchmakers, perfume,
handcrafted, party, flowers, leather, baby, spiritual and vintage.

```tsx
<CatalogApp defaultTheme="bakery" />
```

## Custom brand themes

Match a client's exact brand identity with `defineTheme`:

```ts
import { defineTheme } from '@neverleans-labs/plug-store-themes';

export const myBrand = defineTheme({
  id: 'my-brand',
  name: 'MY BRAND STORE',
  tagline: 'Premium Style',
  colors: {
    primary: '210 100% 50%',
    primaryForeground: '0 0% 100%',
    background: '210 20% 98%',
    card: '0 0% 100%',
    heroGradientFrom: '210 100% 45%',
    heroGradientTo: '230 80% 30%',
  },
  fonts: {
    heading: '"Space Grotesk", sans-serif',
    body: '"Inter", sans-serif',
  },
  heroStyle: 'split',
  cardStyle: 'bordered',
});
```

Colors are HSL channel triplets (no `hsl()` wrapper) so they slot straight into CSS
custom properties. `themeConfigs` is a `Record<string, ThemeConfig>` keyed by id — use
`Object.values(themeConfigs)` to iterate it.

## Documentation

- [Themes guide](https://neverleans.github.io/plug-store/docs/guides/themes) — every
  token, the ten hero styles and the ten card styles
- [Build a client's brand theme](https://neverleans.github.io/plug-store/docs/recipes/brand-theme)
  — a worked example from a logo to a shipped store
- [Theme gallery](https://neverleans.github.io/plug-store/docs/themes/gallery) — all 50,
  rendered with their own tokens

## License

Apache-2.0 © neverleans
