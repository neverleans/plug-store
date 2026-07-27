---
id: data
title: Data providers
sidebar_label: Dados e seu backend
sidebar_position: 3
description: Conecte o PlugStore à sua API REST, Supabase, Firebase, Prisma ou GraphQL implementando cinco funções assíncronas.
---

# Data providers

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Seus produtos aparecendo na loja, vindos do seu backend em vez do catálogo de
demonstração.

</div>

## O contrato

Um data provider é um objeto simples com cinco funções. Duas são obrigatórias.

```ts
interface CatalogDataProvider {
  getProducts:     (params?: DataProviderQueryParams) => Promise<Product[]>;
  getProductById:  (id: string) => Promise<Product | null>;
  getCategories:   () => Promise<Category[]>;
  getReviews?:     (productId: string) => Promise<Review[]>;
  createOrder?:    (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<Order>;
}
```

```ts
interface DataProviderQueryParams {
  category?: string;   // compara com Product.category pelo nome
  search?:   string;
  limit?:    number;
  featured?: boolean;
}
```

`getReviews` e `createOrder` são opcionais. Sem `getReviews`, a página de
produto simplesmente não mostra avaliações — ela não quebra. Sem `createOrder`,
os pedidos não são gravados em lugar nenhum; o checkout ainda produz o artefato
de pagamento.

## Montar o provider

Passe para o `CatalogApp` ou o `CatalogProvider`. Tudo que a loja renderiza
passa a vir dele: a linha de destaques da home, a grade de produtos, a página de
produto, os relacionados, as sugestões de busca do header e as categorias do
rodapé.

```tsx
import { CatalogApp, restDataProvider } from '@neverleans-labs/plug-store-core';

export default function App() {
  return (
    <CatalogApp
      dataProvider={restDataProvider('https://api.minha-loja.com/v1')}
      config={{ companyName: 'Minha Loja' }}
    />
  );
}
```

Sem passar nada, você recebe o `dummyDataProvider`, que serve o catálogo de
demonstração correspondente ao tema ativo. É o que faz uma instalação nova
parecer uma loja de verdade imediatamente.

## O provider REST embutido

`restDataProvider(baseUrl, options?)` espera estas rotas:

| Chamada | Requisição |
|---|---|
| `getProducts({ category, search, featured, limit })` | `GET {baseUrl}/products?category=…&search=…&featured=true&limit=…` |
| `getProductById(id)` | `GET {baseUrl}/products/{id}` |
| `getCategories()` | `GET {baseUrl}/categories` |
| `getReviews(productId)` | `GET {baseUrl}/products/{productId}/reviews` |
| `createOrder(order)` | `POST {baseUrl}/orders` |

Adicione cabeçalhos quando sua API precisar:

```ts
restDataProvider('https://api.minha-loja.com/v1', {
  headers: { Authorization: `Bearer ${token}` },
});
```

Uma resposta fora da faixa 2xx lança erro, que aparece como estado de erro nos
hooks abaixo.

## Qualquer outra coisa

`customDataProvider` é um helper de identidade que dá a checagem de tipos sem
impor um transporte. Use para Supabase, Firebase, Prisma, GraphQL ou um `fetch`
escrito à mão.

```ts
import { customDataProvider } from '@neverleans-labs/plug-store-core';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, anonKey);

export const provider = customDataProvider({
  async getProducts(params) {
    let query = supabase.from('products').select('*');
    if (params?.category) query = query.eq('category', params.category);
    if (params?.featured) query = query.eq('featured', true);
    if (params?.search) query = query.ilike('name', `%${params.search}%`);
    if (params?.limit) query = query.limit(params.limit);

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async getProductById(id) {
    const { data } = await supabase.from('products').select('*').eq('id', id).single();
    return data ?? null;
  },

  async getCategories() {
    const { data } = await supabase.from('categories').select('*');
    return data ?? [];
  },
});
```

Veja a [receita do Supabase](../recipes/supabase.md) para o esquema das tabelas.

## O formato que seu backend precisa devolver

`getProducts` e `getProductById` devem devolver objetos no formato `Product`:

| Campo | Tipo | Obrigatório | Observações |
|---|---|---|---|
| `id` | `string` | ✅ | Usado em URLs — mantenha seguro para slug |
| `name` | `string` | ✅ | |
| `description` | `string` | ✅ | |
| `price` | `number` | ✅ | Na moeda da loja, não em centavos |
| `originalPrice` | `number` | | Quando maior que `price`, aparece um selo de desconto |
| `images` | `string[]` | ✅ | URLs absolutas. A primeira é a imagem do card |
| `category` | `string` | ✅ | Precisa bater com `Category.name`, não com o slug |
| `subcategory` | `string` | | |
| `rating` | `number` | ✅ | 0 a 5 |
| `reviewCount` | `number` | ✅ | |
| `variants` | `ProductVariant[]` | | `{ id, name, type, options }` |
| `tags` | `string[]` | ✅ | Alimentam o filtro de tags na página de produtos |
| `inStock` | `boolean` | ✅ | |
| `industry` | `string` | ✅ | O id do tema ao qual o produto pertence |
| `featured` | `boolean` | | Linha de destaques na home |

`getCategories` devolve `Category`: `{ id, name, slug, image, industry }`. O
`slug` é o que aparece em `/products?category=…`; o `name` é o que os produtos
referenciam.

:::warning `category` bate pelo nome
`Product.category` é comparado com `Category.name`, não com `Category.slug`. Se
o seu backend guarda slugs, converta antes de devolver.
:::

## Ler dados nos seus componentes

Quatro hooks exportados envolvem o provider ativo com cache, deduplicação e
estado de carregamento. São exatamente os que as páginas prontas usam.

```tsx
import { useProducts, useCategories, useProduct } from '@neverleans-labs/plug-store-core';

function Destaques() {
  const { products, isLoading, isError } = useProducts({ featured: true, limit: 8 });

  if (isLoading) return <GridSkeleton />;
  if (isError) return <p>Não foi possível carregar os produtos.</p>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

| Hook | Devolve |
|---|---|
| `useProducts(params?, options?)` | `{ products, isLoading, isError, error }` |
| `useCategories()` | `{ categories, isLoading, isError, error }` |
| `useProduct(id)` | `{ product, isLoading, isError, error }` |
| `useProductReviews(productId)` | `{ reviews, isLoading, isError, error }` |

`products`, `categories` e `reviews` nunca são `undefined` — eles caem para
array vazio, então dá para iterar já na primeira renderização.

Passe `{ enabled: false }` como segundo argumento do `useProducts` para segurar
a requisição até os parâmetros ficarem prontos:

```tsx
const { product } = useProduct(id);
const { products: relacionados } = useProducts(
  product ? { category: product.category } : undefined,
  { enabled: Boolean(product) },
);
```

### Chegar no provider diretamente

`useCatalogData()` devolve o objeto do provider em si, para chamadas
imperativas fora da renderização:

```tsx
const provider = useCatalogData();
const resultados = await provider.getProducts({ search: termo });
```

Prefira os hooks para qualquer coisa que você renderize — eles fazem cache e
entregam os estados de carregamento e erro de graça.

## Cache

Os resultados são cacheados por provider e por conjunto de parâmetros, e
considerados frescos por cinco minutos. Trocar de tema invalida o cache do
provider de demonstração, porque os dados dele são específicos por tema; um
provider customizado mantém o cache quando o visitante muda a aparência da loja.

Para compartilhar um único cache com um app que já usa react-query, passe o seu
client:

```tsx
<CatalogProvider queryClient={meuQueryClient} dataProvider={provider}>
```

## Próximos passos

- [Conectar uma API REST passo a passo](../recipes/rest-api.md)
- [Conectar o Supabase](../recipes/supabase.md)
- [Checkout e pedidos](./checkout.md)
