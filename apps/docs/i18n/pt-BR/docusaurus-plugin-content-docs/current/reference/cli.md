---
id: cli
title: Referência da CLI
sidebar_label: CLI
sidebar_position: 3
description: Todas as flags aceitas pelo create-plug-store, os arquivos que ele gera e seus códigos de saída.
---

# Referência da CLI

```bash
npm create plug-store [pasta] [flags]
```

## Flags

| Flag | Valores | Padrão |
|---|---|---|
| `--yes`, `-y` | — | Pergunta de forma interativa |
| `--company` | qualquer texto | `Minha Loja Plug` / `My Plug Store` |
| `--theme` | um dos 50 [ids de tema](../themes/gallery.mdx) | `fashion` |
| `--currency` | `BRL`, `USD`, `EUR` | `BRL` |
| `--whatsapp` | dígitos com código do país | vazio |
| `--pix-key` | CPF, CNPJ, e-mail, telefone, chave aleatória | vazio |
| `--pix-city` | máximo 15 caracteres ASCII | vazio (cai para `BRASIL`) |
| `--lang` | `pt`, `en` | o `LANG` / `LC_ALL` da máquina |

O argumento posicional é o nome da pasta. Sem ele você recebe `meu-catalogo` em
português ou `my-catalog` em inglês.

## Códigos de saída

| Código | Significado |
|---|---|
| `0` | Projeto criado |
| `1` | `--theme`, `--currency` ou `--lang` inválido; ou a pasta de destino já existe |

Um valor inválido imprime a lista aceita, então um erro de digitação em um
pipeline falha alto em vez de gerar silenciosamente uma loja de moda.

## Perguntas interativas

Sete perguntas, das quais as duas últimas são condicionais:

1. Nome da pasta do projeto
2. Nome da Loja / Empresa
3. Nicho / Tema inicial (uma lista navegável com 50)
4. Moeda principal
5. Número do WhatsApp
6. **Chave Pix** — só quando a moeda é `BRL`
7. **Cidade do Pix** — só quando houve chave Pix

## Arquivos gerados

```
minha-loja/
├── .gitignore
├── index.html
├── package.json          # core e themes travados na versão desta CLI
├── postcss.config.js
├── tailwind.config.js    # content inclui a biblioteca compilada
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.tsx           # <CatalogApp /> com as suas respostas
    ├── index.css         # diretivas do Tailwind + overrides de tokens
    └── main.tsx          # o CSS da biblioteca, depois o seu
```

O `package.json` gerado trava `@neverleans-labs/plug-store-core` e
`@neverleans-labs/plug-store-themes` em `^<a versão da própria CLI>`. Os três
pacotes são lançados juntos na mesma versão, então a CLI que você rodou e os
pacotes que você recebe são sempre um par testado.

## Exemplos

Não interativo, configuração completa:

```bash
npm create plug-store bloom -- \
  --yes \
  --company "Bloom Cosméticos" \
  --theme beauty \
  --currency BRL \
  --whatsapp 5511999998888 \
  --pix-key bloom@example.com \
  --pix-city "Sao Paulo"
```

Perguntas em inglês em uma máquina em português:

```bash
npm create plug-store minha-loja -- --lang en
```

## Próximos passos

- [Criar um projeto](../getting-started/cli.md)
- [Todos os exports](./exports.md)
