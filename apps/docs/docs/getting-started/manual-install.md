---
id: manual-install
title: Add to an existing project
sidebar_label: Add to an existing app
sidebar_position: 2
description: Install PlugStore into a React project you already have, with the exact imports and provider setup required.
---

# Add to an existing project

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

PlugStore rendering inside a React app you already own, with the styles
resolving correctly.

</div>

## Install

```bash
npm install @neverleans-labs/plug-store-core @neverleans-labs/plug-store-themes
```

Both packages are released together and always carry the same version.

### Requirements

| | |
|---|---|
| React | 18 or 19 (both verified in CI) |
| Bundler | Vite, or anything that handles ESM + CSS imports |
| Tailwind CSS | 3.x, configured — see [Tailwind setup](./tailwind.md) |

`react` and `react-dom` are peer dependencies, so your app controls the version.
No `--legacy-peer-deps` is needed on React 19.

## Import the stylesheet

This is the step people miss. The core package is built in Vite library mode:
`dist/index.css` is emitted as a standalone file and `dist/index.js` does not
import it. Nothing pulls it in for you.

```tsx title="src/main.tsx"
import ReactDOM from 'react-dom/client';
import App from './App';

// Library first — every design token lives here.
import '@neverleans-labs/plug-store-core/dist/index.css';
// Yours second, so your overrides win.
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

Without that first import the components still mount, but every colour resolves
to nothing and the store renders unstyled.

## Render the whole store

```tsx title="src/App.tsx"
import { CatalogApp } from '@neverleans-labs/plug-store-core';

export default function App() {
  return (
    <CatalogApp
      defaultTheme="electronics"
      config={{
        companyName: 'TechVault',
        currency: 'BRL',
        whatsappPhone: '5511999998888',
      }}
    />
  );
}
```

`CatalogApp` brings its own router. If your app already has one, use
`CatalogProvider` instead.

## Render only parts of it

Wrap your tree in `CatalogProvider` and the contexts become available to
whatever you build. Any PlugStore component works inside it.

```tsx title="src/App.tsx"
import {
  CatalogProvider,
  ProductCard,
  useCatalogData,
} from '@neverleans-labs/plug-store-core';

function Grid() {
  const { products, isLoading } = useCatalogData();
  if (isLoading) return <p>Loading…</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function App() {
  return (
    <CatalogProvider defaultTheme="electronics" config={{ companyName: 'TechVault' }}>
      <MyOwnHeader />
      <Grid />
    </CatalogProvider>
  );
}
```

:::warning Components need the providers
`ProductCard`, `MiniCart`, `Header` and the rest read from the theme, cart and
config contexts. Rendering one outside `CatalogProvider` throws. There is no
standalone mode.
:::

## Next

- [Configure Tailwind](./tailwind.md) — required, and the second most common
  source of "it looks broken"
- [Store configuration](../guides/configuration.md)
