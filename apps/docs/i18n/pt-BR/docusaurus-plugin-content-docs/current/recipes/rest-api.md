---
id: rest-api
title: Conectar uma API REST
sidebar_label: API REST
sidebar_position: 1
description: Passo a passo completo para apontar o PlugStore para o seu backend REST, com os formatos de resposta e como adaptar um esquema que não bate.
---

# Conectar uma API REST

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Seus produtos, categorias e avaliações aparecendo na loja, servidos pela sua
API.

</div>

## Se a sua API já bate

```tsx
import { CatalogApp, restDataProvider } from '@neverleans-labs/plug-store-core';

export default function App() {
  return (
    <CatalogApp
      dataProvider={restDataProvider('https://api.minha-loja.com/v1')}
      config={{ companyName: 'Minha Loja', currency: 'BRL' }}
    />
  );
}
```

As rotas que ele vai chamar:

```
GET  /products?category=&search=&featured=true&limit=
GET  /products/:id
GET  /categories
GET  /products/:id/reviews
POST /orders
```

Com autenticação:

```tsx
restDataProvider('https://api.minha-loja.com/v1', {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Se a sua API não bate

Quase nenhuma bate. Escreva o mapeamento explicitamente — normalmente são vinte
linhas.

```ts title="src/catalogProvider.ts"
import { customDataProvider } from '@neverleans-labs/plug-store-core';
import type { Product, Category } from '@neverleans-labs/plug-store-core';

const API = 'https://api.minha-loja.com';

// O formato da sua API, seja ele qual for.
interface ApiProduct {
  sku: string;
  title: string;
  body_html: string;
  price_cents: number;
  compare_at_cents?: number;
  photos: { url: string }[];
  collection: string;
  labels: string[];
  available: boolean;
  is_highlight: boolean;
  reviews_avg: number;
  reviews_total: number;
}

const toProduct = (p: ApiProduct): Product => ({
  id: p.sku,
  name: p.title,
  description: p.body_html.replace(/<[^>]+>/g, ''),
  // O PlugStore espera um valor decimal na moeda da loja, não centavos.
  price: p.price_cents / 100,
  originalPrice: p.compare_at_cents ? p.compare_at_cents / 100 : undefined,
  images: p.photos.map((photo) => photo.url),
  // Precisa bater com Category.name, não com o slug.
  category: p.collection,
  rating: p.reviews_avg,
  reviewCount: p.reviews_total,
  tags: p.labels,
  inStock: p.available,
  industry: 'fashion',
  featured: p.is_highlight,
});

const json = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} em ${path}`);
  return res.json();
};

export const catalogProvider = customDataProvider({
  async getProducts(params) {
    const query = new URLSearchParams();
    if (params?.category) query.set('collection', params.category);
    if (params?.search) query.set('q', params.search);
    if (params?.featured) query.set('highlight', '1');
    if (params?.limit) query.set('per_page', String(params.limit));

    const data = await json<ApiProduct[]>(`/catalog?${query}`);
    return data.map(toProduct);
  },

  async getProductById(id) {
    try {
      return toProduct(await json<ApiProduct>(`/catalog/${id}`));
    } catch {
      // Produto inexistente é null, não exceção — a página renderiza o próprio
      // estado de "não encontrado".
      return null;
    }
  },

  async getCategories(): Promise<Category[]> {
    const data = await json<{ id: string; title: string; handle: string; image: string }[]>(
      '/collections',
    );
    return data.map((c) => ({
      id: c.id,
      name: c.title,
      slug: c.handle,
      image: c.image,
      industry: 'fashion',
    }));
  },

  async createOrder(order) {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: order.shipping,
        line_items: order.items.map((item) => ({
          sku: item.product.id,
          quantity: item.quantity,
          variants: item.selectedVariants,
        })),
        total_cents: Math.round(order.total * 100),
      }),
    });

    const created = await res.json();
    return {
      id: created.number,
      date: created.created_at,
      status: 'confirmed',
      items: order.items,
      shipping: order.shipping,
      total: order.total,
    };
  },
});
```

Depois:

```tsx
import { catalogProvider } from './catalogProvider';

<CatalogApp dataProvider={catalogProvider} />
```

## Conferindo se funcionou

Abra a aba de rede e carregue a home. Você deve ver uma requisição de produtos
em destaque. Se ela só aparece ao navegar para uma página de produto, o provider
não está montado — confirme que ele foi passado para o `CatalogApp` /
`CatalogProvider` mais externo.

Erros comuns:

- **O filtro de categoria não mostra nada.** `Product.category` precisa ser igual
  a `Category.name`, não ao slug.
- **Preços 100× maiores.** Sua API devolve centavos; divida.
- **As imagens não carregam.** `images` precisa ter URLs absolutas; caminhos
  relativos resolvem contra a origem da loja.
- **Tudo desatualizado.** Os resultados ficam em cache por cinco minutos por
  conjunto de parâmetros. Passe o seu próprio `queryClient` se precisar de outro
  comportamento.

## Próximos passos

- [Referência dos data providers](../guides/data.md)
- [Supabase](./supabase.md)
