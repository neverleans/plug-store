---
id: cli
title: CLI reference
sidebar_label: CLI
sidebar_position: 3
description: Every flag accepted by create-plug-store, the files it generates, and its exit codes.
---

# CLI reference

```bash
npm create plug-store [folder] [flags]
```

## Flags

| Flag | Values | Default |
|---|---|---|
| `--yes`, `-y` | — | Prompts interactively |
| `--company` | any string | `My Plug Store` / `Minha Loja Plug` |
| `--theme` | one of the 50 [theme ids](../themes/gallery.mdx) | `fashion` |
| `--currency` | `BRL`, `USD`, `EUR` | `BRL` |
| `--whatsapp` | digits with country code | empty |
| `--pix-key` | CPF, CNPJ, e-mail, phone, random key | empty |
| `--pix-city` | max 15 ASCII characters | empty (falls back to `BRASIL`) |
| `--lang` | `pt`, `en` | the machine's `LANG` / `LC_ALL` |

The positional argument is the folder name. Without it you get `my-catalog` in
English or `meu-catalogo` in Portuguese.

## Exit codes

| Code | Meaning |
|---|---|
| `0` | Project created |
| `1` | Invalid `--theme`, `--currency` or `--lang`; or the target folder already exists |

An invalid value prints the accepted list, so a typo in a pipeline fails loudly
instead of silently producing a fashion store.

## Interactive prompts

Seven questions, of which the last two are conditional:

1. Project folder name
2. Store / company name
3. Industry theme (a searchable list of 50)
4. Currency
5. WhatsApp number
6. **Pix key** — only when the currency is `BRL`
7. **Pix city** — only when a Pix key was given

## Generated files

```
my-store/
├── .gitignore
├── index.html
├── package.json          # core + themes pinned to this CLI's version
├── postcss.config.js
├── tailwind.config.js    # content includes the compiled library
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.tsx           # <CatalogApp /> with your answers
    ├── index.css         # Tailwind directives + token overrides
    └── main.tsx          # library CSS, then your CSS
```

The generated `package.json` pins `@neverleans-labs/plug-store-core` and
`@neverleans-labs/plug-store-themes` to `^<the CLI's own version>`. All three
packages are released together on the same version, so the CLI you ran and the
packages you get are always a tested pair.

## Examples

Non-interactive, full configuration:

```bash
npm create plug-store bloom -- \
  --yes \
  --company "Bloom Cosmetics" \
  --theme beauty \
  --currency BRL \
  --whatsapp 5511999998888 \
  --pix-key bloom@example.com \
  --pix-city "Sao Paulo"
```

English prompts on a Portuguese machine:

```bash
npm create plug-store my-store -- --lang en
```

## Next

- [Create a project](../getting-started/cli.md)
- [All exports](./exports.md)
