---
id: cli
title: Criar um projeto
sidebar_label: Criar um projeto
sidebar_position: 1
description: Gere um projeto PlugStore já configurado com a CLI create-plug-store, de forma interativa ou por flags.
---

# Criar um projeto

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Uma loja rodando em `http://localhost:5173`, configurada com o nome da sua
loja, tema, moeda, número de WhatsApp e chave Pix.

</div>

## Rodar a CLI

```bash
npm create plug-store minha-loja
```

Equivalente com os outros gerenciadores:

```bash
pnpm create plug-store minha-loja
```

```bash
yarn create plug-store minha-loja
```

A CLI faz de cinco a sete perguntas. As de Pix só aparecem quando você escolhe
**BRL** como moeda, porque uma chave Pix não faz sentido fora disso.

| Pergunta | O que define |
|---|---|
| Nome da pasta do projeto | O diretório a criar |
| Nome da Loja / Empresa | `config.companyName`, usado no header, no rodapé e nas mensagens de pedido |
| Nicho / Tema inicial | `defaultTheme` — um dos [50 temas](../themes/gallery.mdx) |
| Moeda principal | `config.currency` (`BRL`, `USD` ou `EUR`) |
| Número do WhatsApp | `config.whatsappPhone`, só dígitos, com o código do país |
| Chave Pix *(só em BRL)* | `config.pixKey` — CPF, CNPJ, e-mail, telefone ou chave aleatória |
| Cidade do Pix *(se houve chave)* | `config.pixMerchantCity`, máximo 15 caracteres |

Depois:

```bash
cd minha-loja
npm install
npm run dev
```

## Modo não interativo

Passe `--yes` para pular todas as perguntas. Útil em CI, em um Dockerfile, ou
quando você está gerando vários projetos de cliente.

```bash
npm create plug-store minha-loja -- \
  --yes \
  --company "Bloom Cosméticos" \
  --theme beauty \
  --currency BRL \
  --whatsapp 5511999998888 \
  --pix-key bloom@example.com \
  --pix-city "Sao Paulo"
```

| Flag | Valores | Padrão |
|---|---|---|
| `--yes`, `-y` | — | modo interativo |
| `--company` | qualquer texto | `Minha Loja Plug` |
| `--theme` | qualquer um dos 50 ids de tema | `fashion` |
| `--currency` | `BRL`, `USD`, `EUR` | `BRL` |
| `--whatsapp` | dígitos com código do país | vazio |
| `--pix-key` | CPF, CNPJ, e-mail, telefone, chave aleatória | vazio |
| `--pix-city` | máximo 15 caracteres | vazio (cai para `BRASIL`) |
| `--lang` | `pt`, `en` | o locale da sua máquina |

Um `--theme` ou `--currency` inválido sai com código diferente de zero e lista
os valores aceitos, então um erro de digitação quebra o pipeline em vez de
gerar silenciosamente uma loja de moda.

## O que é gerado

```
minha-loja/
├── index.html
├── package.json          # core e themes travados na versão da própria CLI
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js    # content inclui a biblioteca compilada
├── postcss.config.js
└── src/
    ├── main.tsx          # importa o CSS da biblioteca, depois o seu
    ├── App.tsx           # <CatalogApp /> com as suas respostas
    └── index.css         # diretivas do Tailwind + overrides de tokens
```

`src/App.tsx` é a loja inteira:

```tsx
import { CatalogApp } from '@neverleans-labs/plug-store-core';

export default function App() {
  return (
    <CatalogApp
      defaultTheme="beauty"
      config={{
        companyName: "Bloom Cosméticos",
        currency: "BRL",
        whatsappPhone: "5511999998888",
        pixKey: "bloom@example.com",
        pixMerchantCity: "Sao Paulo",
      }}
    />
  );
}
```

:::tip Por que o `main.tsx` importa dois arquivos de estilo
O pacote core é compilado em modo library do Vite, que emite `dist/index.css`
como arquivo separado — `dist/index.js` não o referencia. O seu ponto de entrada
precisa importá-lo, senão a loja renderiza sem nenhum design token. Os estilos
da biblioteca vêm primeiro para que o que você escrever em `src/index.css` vença.
:::

## Confira o build

Antes de publicar qualquer coisa, confirme que o build de produção funciona:

```bash
npm run build
```

Toda versão do PlugStore é validada do mesmo jeito, no Linux e no Windows,
contra React 18 e React 19 — veja o job `e2e-consumer` no CI do repositório.

## Próximos passos

- [Instalar em um projeto que já existe](./manual-install.md)
- [Configurar a loja](../guides/configuration.md)
- [Publicar](./deploy.md)
