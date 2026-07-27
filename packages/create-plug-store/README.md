# create-plug-store

> Scaffold a production-ready [PlugStore](https://neverleans.github.io/plug-store/)
> catalog application in seconds.

**[Documentation](https://neverleans.github.io/plug-store/) · [Live demo](https://neverleans.github.io/plug-store/demo/) · [Em português](https://neverleans.github.io/plug-store/pt-BR/)**

[![npm](https://img.shields.io/npm/v/create-plug-store.svg?color=brightgreen)](https://www.npmjs.com/package/create-plug-store)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](https://github.com/neverleans/plug-store/blob/master/LICENSE)

## Usage

```bash
npx create-plug-store meu-catalogo
```

Answer a few prompts — store name, starting theme, currency, WhatsApp number and, for BRL
stores, a Pix key — and you get a fully initialised React + Tailwind CSS storefront,
ready to accept real orders.

```bash
cd meu-catalogo
npm install
npm run dev
```

## What you get

- A wired-up `<CatalogApp />` using the theme you picked out of 50 industry presets.
- Tailwind CSS, TypeScript and Vite preconfigured.
- A checkout that already offers WhatsApp and Pix — if you entered a Pix key, it generates
  a real, scannable BR Code, not a placeholder.
- PWA manifest and service worker for offline catalog browsing.

## Non-interactive

Every prompt has a flag, so the scaffold works in a script or a CI job:

```bash
npm create plug-store bloom -- \
  --yes \
  --company "Bloom Cosmeticos" \
  --theme beauty \
  --currency BRL \
  --whatsapp 5511999998888 \
  --pix-key bloom@example.com \
  --pix-city "Sao Paulo"
```

Prompts follow your shell's `LANG`; pass `--lang en` or `--lang pt` to override.
The full list is in the [CLI reference](https://neverleans.github.io/plug-store/docs/reference/cli).

## Requirements

Node.js 18 or newer. The generated project builds on React 18 and React 19 alike.

## Documentation

- [Create a project](https://neverleans.github.io/plug-store/docs/getting-started/cli)
- [CLI reference](https://neverleans.github.io/plug-store/docs/reference/cli) — flags,
  exit codes and the files it writes
- [Deploy](https://neverleans.github.io/plug-store/docs/getting-started/deploy) — Vercel,
  Netlify and GitHub Pages

## License

Apache-2.0 © neverleans
