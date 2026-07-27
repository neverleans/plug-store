---
id: supabase
title: Conectar o Supabase
sidebar_label: Supabase
sidebar_position: 2
description: Esquema das tabelas, políticas de row-level security e o data provider para rodar uma loja PlugStore no Supabase.
---

# Conectar o Supabase

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Uma loja lendo do Supabase, com pedidos sendo gravados de volta, e RLS
configurado para a chave anônima não conseguir causar estrago.

</div>

## Esquema

```sql
create table categories (
  id       text primary key,
  name     text not null,
  slug     text not null unique,
  image    text not null default '',
  industry text not null default 'fashion'
);

create table products (
  id             text primary key,
  name           text not null,
  description    text not null default '',
  price          numeric not null,
  original_price numeric,
  images         text[] not null default '{}',
  -- Bate com categories.name, que é o que o PlugStore compara.
  category       text not null,
  subcategory    text,
  rating         numeric not null default 0,
  review_count   int not null default 0,
  tags           text[] not null default '{}',
  in_stock       boolean not null default true,
  industry       text not null default 'fashion',
  featured       boolean not null default false
);

create table reviews (
  id         text primary key,
  product_id text not null references products(id) on delete cascade,
  author     text not null,
  rating     numeric not null,
  comment    text not null default '',
  date       text not null
);

create table orders (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status     text not null default 'confirmed',
  total      numeric not null,
  shipping   jsonb not null,
  items      jsonb not null
);
```

## Row-level security

A chave anônima vai dentro do seu bundle JavaScript. Qualquer pessoa consegue
ler, então quem precisa dizer não é o banco.

```sql
alter table products   enable row level security;
alter table categories enable row level security;
alter table reviews    enable row level security;
alter table orders     enable row level security;

-- O catálogo é público, somente leitura.
create policy "public read products"   on products   for select using (true);
create policy "public read categories" on categories for select using (true);
create policy "public read reviews"    on reviews    for select using (true);

-- Qualquer um pode criar pedido; ninguém pode ler os pedidos.
create policy "public create orders" on orders for insert with check (true);
```

:::danger Não dê select em `orders`
Com uma política pública de select, o nome, o endereço e o histórico de compras
de cada cliente ficam a uma consulta de distância de qualquer visitante. Leia os
pedidos pelo seu servidor com a chave service role.
:::

## O provider

```ts title="src/supabaseProvider.ts"
import { createClient } from '@supabase/supabase-js';
import { customDataProvider } from '@neverleans-labs/plug-store-core';
import type { Product, Category, Review } from '@neverleans-labs/plug-store-core';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  images: string[];
  category: string;
  subcategory: string | null;
  rating: number;
  review_count: number;
  tags: string[];
  in_stock: boolean;
  industry: string;
  featured: boolean;
}

const toProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: Number(row.price),
  originalPrice: row.original_price ? Number(row.original_price) : undefined,
  images: row.images,
  category: row.category,
  subcategory: row.subcategory ?? undefined,
  rating: Number(row.rating),
  reviewCount: row.review_count,
  tags: row.tags,
  inStock: row.in_stock,
  industry: row.industry,
  featured: row.featured,
});

export const supabaseProvider = customDataProvider({
  async getProducts(params) {
    let query = supabase.from('products').select('*');

    if (params?.category) query = query.eq('category', params.category);
    if (params?.featured) query = query.eq('featured', true);
    if (params?.limit) query = query.limit(params.limit);
    if (params?.search) {
      // Mesmo comportamento do provider de demonstração: nome ou descrição.
      query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as ProductRow[]).map(toProduct);
  },

  async getProductById(id) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? toProduct(data as ProductRow) : null;
  },

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return (data ?? []) as Category[];
  },

  async getReviews(productId): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId);
    if (error) throw error;

    return (data ?? []).map((r) => ({
      id: r.id,
      productId: r.product_id,
      author: r.author,
      rating: Number(r.rating),
      comment: r.comment,
      date: r.date,
    }));
  },

  async createOrder(order) {
    const { data, error } = await supabase
      .from('orders')
      .insert({ total: order.total, shipping: order.shipping, items: order.items })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      date: data.created_at,
      status: 'confirmed',
      items: order.items,
      shipping: order.shipping,
      total: order.total,
    };
  },
});
```

:::note `insert().select()` precisa de política de leitura
Devolver a linha inserida exige permissão de select. Se você mantiver os pedidos
somente para escrita, como recomendado acima, remova o `.select().single()` e
monte o retorno com um id gerado no cliente.
:::

## Montar

```tsx
import { CatalogApp } from '@neverleans-labs/plug-store-core';
import { supabaseProvider } from './supabaseProvider';

export default function App() {
  return (
    <CatalogApp
      dataProvider={supabaseProvider}
      defaultTheme="beauty"
      config={{ companyName: 'Bloom Cosméticos', currency: 'BRL' }}
    />
  );
}
```

## Próximos passos

- [Referência dos data providers](../guides/data.md)
- [Checkout customizado](./custom-checkout.md)
