---
id: manual-install
title: Adicionar a um projeto existente
sidebar_label: Projeto existente
sidebar_position: 2
description: Instale o PlugStore em um projeto React que você já tem, com os imports exatos e a configuração de providers necessária.
---

# Adicionar a um projeto existente

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

O PlugStore renderizando dentro de um app React que já é seu, com os estilos
resolvendo corretamente.

</div>

## Instalar

```bash
npm install @neverleans-labs/plug-store-core @neverleans-labs/plug-store-themes
```

Os dois pacotes são lançados juntos e sempre carregam a mesma versão.

### Requisitos

| | |
|---|---|
| React | 18 ou 19 (os dois verificados no CI) |
| Bundler | Vite, ou qualquer um que lide com ESM e import de CSS |
| Tailwind CSS | 3.x, configurado — veja [Configurar o Tailwind](./tailwind.md) |

`react` e `react-dom` são peer dependencies, então a versão é decisão do seu
app. Nenhum `--legacy-peer-deps` é necessário no React 19.

## Importar o CSS

Esse é o passo que as pessoas esquecem. O pacote core é compilado em modo
library do Vite: `dist/index.css` sai como arquivo separado e `dist/index.js`
não o importa. Nada puxa esse arquivo por você.

```tsx title="src/main.tsx"
import ReactDOM from 'react-dom/client';
import App from './App';

// A biblioteca primeiro — todos os design tokens estão aqui.
import '@neverleans-labs/plug-store-core/dist/index.css';
// O seu depois, para os seus overrides vencerem.
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

Sem esse primeiro import os componentes até montam, mas toda cor resolve para
nada e a loja renderiza sem estilo.

## Renderizar a loja inteira

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

O `CatalogApp` traz o próprio roteador. Se o seu app já tem um, use o
`CatalogProvider`.

## Renderizar só partes dela

Envolva sua árvore no `CatalogProvider` e os contextos ficam disponíveis para o
que você construir. Qualquer componente do PlugStore funciona dentro dele.

```tsx title="src/App.tsx"
import {
  CatalogProvider,
  ProductCard,
  useProducts,
} from '@neverleans-labs/plug-store-core';

function Grade() {
  const { products, isLoading } = useProducts();
  if (isLoading) return <p>Carregando…</p>;

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
      <MeuHeader />
      <Grade />
    </CatalogProvider>
  );
}
```

:::warning Os componentes precisam dos providers
`ProductCard`, `MiniCart`, `Header` e os demais leem dos contextos de tema,
carrinho e configuração. Renderizar qualquer um fora do `CatalogProvider` lança
erro. Não existe modo avulso.
:::

## Próximos passos

- [Configurar o Tailwind](./tailwind.md) — obrigatório, e a segunda maior causa
  de "ficou quebrado"
- [Configuração da loja](../guides/configuration.md)
