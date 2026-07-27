---
id: tailwind
title: Configurar o Tailwind
sidebar_label: Configurar o Tailwind
sidebar_position: 3
description: A configuração de Tailwind que o PlugStore exige, por que o array content precisa incluir o pacote compilado, e como diagnosticar uma loja renderizando sem estilo.
---

# Configurar o Tailwind

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Um build do Tailwind correto — e a capacidade de diagnosticar as duas formas de
uma instalação do PlugStore renderizar errado.

</div>

A CLI escreve tudo isto para você. Esta página é para quem está adicionando o
PlugStore a um projeto existente, ou depurando.

## `tailwind.config.js`

```js title="tailwind.config.js"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Obrigatório: as classes da biblioteca estão na saída compilada dela.
    './node_modules/@neverleans-labs/plug-store-core/dist/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
```

## `postcss.config.js`

```js title="postcss.config.js"
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

## `src/index.css`

```css title="src/index.css"
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Ordem dos imports no ponto de entrada

```tsx title="src/main.tsx"
import '@neverleans-labs/plug-store-core/dist/index.css';  // tokens
import './index.css';                                      // seu build do Tailwind
```

## Por que a entrada em `content` importa

O Tailwind só gera uma classe utilitária que ele viu em algum arquivo escaneado.
Os componentes do PlugStore são JavaScript compilado dentro de `node_modules`,
então, sem escanear esse caminho, toda classe que a biblioteca usa é removida e
a loja renderiza como HTML sem estilo.

## Por que o import do CSS importa

O pacote core é compilado em modo library do Vite. Isso emite `dist/index.css`
como arquivo separado, e `dist/index.js` **não** o importa. O pacote declara
`sideEffects` para esse arquivo, mas `sideEffects` só diz ao bundler para não
remover um CSS que algo já importou — ele nunca cria o import.

Então a folha de estilo precisa ser importada explicitamente. Sem isso os
componentes montam, os utilitários do Tailwind estão lá, mas cada
`hsl(var(--primary))` resolve contra uma variável que nunca foi definida.

## Diagnóstico

| Sintoma | Causa |
|---|---|
| O layout está certo, mas tudo é preto e branco ou transparente | O CSS da biblioteca não foi importado |
| Nenhum layout, só HTML empilhado | Falta o caminho de `node_modules` em `content` |
| Funciona em dev, quebra no build de produção | Quase sempre `content` — o dev serve o CSS sem purge |
| O botão de modo escuro não faz nada | Falta `darkMode: 'class'` |

Um teste rápido no console do navegador:

```js
getComputedStyle(document.documentElement).getPropertyValue('--primary');
// string vazia → a folha de estilo da biblioteca não foi carregada
```

## Tailwind v4

O PlugStore mira o Tailwind **3.x**. A v4 substitui o `tailwind.config.js` por
configuração via CSS e ainda não é suportada.

## Próximos passos

- [Publicar](./deploy.md)
- [Temas e tokens](../guides/themes.md)
