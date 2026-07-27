---
id: cli
title: Create a project
sidebar_label: Create a project
sidebar_position: 1
description: Scaffold a configured PlugStore project with the create-plug-store CLI, interactively or with flags.
---

# Create a project

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

A running storefront on `http://localhost:5173`, configured with your store
name, theme, currency, WhatsApp number and Pix key.

</div>

## Run the CLI

```bash
npm create plug-store my-store
```

Equivalent with the other package managers:

```bash
pnpm create plug-store my-store
```

```bash
yarn create plug-store my-store
```

The CLI asks five to seven questions. The Pix questions only appear when you
pick **BRL** as the currency, because a Pix key is meaningless otherwise.

| Question | What it sets |
|---|---|
| Project folder name | The directory to create |
| Store / company name | `config.companyName`, used in the header, footer and order messages |
| Industry theme | `defaultTheme` — one of the [50 themes](../themes/gallery.mdx) |
| Currency | `config.currency` (`BRL`, `USD` or `EUR`) |
| WhatsApp number | `config.whatsappPhone`, digits only, with country code |
| Pix key *(BRL only)* | `config.pixKey` — CPF, CNPJ, e-mail, phone or random key |
| Pix city *(if a key was given)* | `config.pixMerchantCity`, max 15 characters |

Then:

```bash
cd my-store
npm install
npm run dev
```

## Non-interactive mode

Pass `--yes` to skip every prompt. Useful in CI, in a Dockerfile, or when you
are generating several client projects.

```bash
npm create plug-store my-store -- \
  --yes \
  --company "Bloom Cosmetics" \
  --theme beauty \
  --currency BRL \
  --whatsapp 5511999998888 \
  --pix-key bloom@example.com \
  --pix-city "Sao Paulo"
```

| Flag | Values | Default |
|---|---|---|
| `--yes`, `-y` | — | prompts |
| `--company` | any string | `My Plug Store` |
| `--theme` | any of the 50 theme ids | `fashion` |
| `--currency` | `BRL`, `USD`, `EUR` | `BRL` |
| `--whatsapp` | digits with country code | empty |
| `--pix-key` | CPF, CNPJ, e-mail, phone, random key | empty |
| `--pix-city` | max 15 characters | empty (falls back to `BRASIL`) |
| `--lang` | `pt`, `en` | your machine's locale |

An invalid `--theme` or `--currency` exits with a non-zero code and lists the
accepted values, so a typo fails your pipeline instead of silently producing a
fashion store.

## What gets generated

```
my-store/
├── index.html
├── package.json          # core + themes pinned to the CLI's own version
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js    # content includes the compiled library
├── postcss.config.js
└── src/
    ├── main.tsx          # imports the library CSS, then your own
    ├── App.tsx           # <CatalogApp /> with your answers baked in
    └── index.css         # Tailwind directives + token overrides
```

`src/App.tsx` is the whole store:

```tsx
import { CatalogApp } from '@neverleans-labs/plug-store-core';

export default function App() {
  return (
    <CatalogApp
      defaultTheme="beauty"
      config={{
        companyName: "Bloom Cosmetics",
        currency: "BRL",
        whatsappPhone: "5511999998888",
        pixKey: "bloom@example.com",
        pixMerchantCity: "Sao Paulo",
      }}
    />
  );
}
```

:::tip Why `main.tsx` imports two stylesheets
The core package is built in Vite library mode, which emits `dist/index.css` as
a standalone file — `dist/index.js` does not reference it. Your entry point has
to import it, or the store renders with none of the design tokens. Library
styles come first so that anything you write in `src/index.css` wins.
:::

## Verify the build

Before you deploy anything, confirm the production build works:

```bash
npm run build
```

Every PlugStore release is validated the same way, on Linux and Windows, against
React 18 and React 19 — see the `e2e-consumer` job in the repository's CI.

## Next

- [Install into an existing project](./manual-install.md) instead
- [Configure your store](../guides/configuration.md)
- [Deploy it](./deploy.md)
