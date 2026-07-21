# @neverleans/plug-store-themes

> 50 ready-made industry design themes and the `defineTheme` customizer for the
> [PlugStore Framework](https://github.com/neverleans/plug-store).

[![npm](https://img.shields.io/npm/v/@neverleans/plug-store-themes.svg?color=orange)](https://www.npmjs.com/package/@neverleans/plug-store-themes)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](https://github.com/neverleans/plug-store/blob/master/LICENSE)

## Installation

```bash
npm install @neverleans/plug-store-themes @neverleans/plug-store-core
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
import { defineTheme } from '@neverleans/plug-store-themes';

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
custom properties.

## License

Apache-2.0 © neverleans
