import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CatalogApp } from '../CatalogApp';
import { CatalogProvider } from '../CatalogProvider';
import ProductsPage from '../pages/ProductsPage';
import { useProducts, useCategories } from '../hooks/useCatalogQuery';
import type { CatalogDataProvider } from '../data/provider';
import type { Category, Product } from '../types';

/**
 * `dataProvider` used to be accepted, stored in a context, and then ignored by
 * every page: they imported the bundled demo dataset directly. So a store
 * wired to a real backend still rendered demo products, and the framework's
 * headless promise was not true. These tests pin the behaviour down.
 */

const product = (id: string, name: string, category: string, extra?: Partial<Product>): Product => ({
  id,
  name,
  description: `${name} description`,
  price: 42,
  images: ['https://example.com/img.png'],
  category,
  rating: 4.5,
  reviewCount: 3,
  tags: ['custom'],
  inStock: true,
  industry: 'fashion',
  ...extra,
});

const category = (id: string, name: string): Category => ({
  id,
  name,
  slug: name.toLowerCase().replace(/\s+/g, '-'),
  image: 'https://example.com/cat.png',
  industry: 'fashion',
});

const CUSTOM_PRODUCTS = [
  product('p1', 'Backend Widget', 'Widgets', { featured: true }),
  product('p2', 'Backend Gadget', 'Gadgets'),
];

const CUSTOM_CATEGORIES = [category('c1', 'Widgets'), category('c2', 'Gadgets')];

function makeProvider(overrides: Partial<CatalogDataProvider> = {}) {
  return {
    getProducts: vi.fn(async (params) => {
      let list = CUSTOM_PRODUCTS;
      if (params?.featured) list = list.filter((p) => p.featured);
      if (params?.category) list = list.filter((p) => p.category === params.category);
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q));
      }
      return list;
    }),
    getProductById: vi.fn(async (id: string) => CUSTOM_PRODUCTS.find((p) => p.id === id) ?? null),
    getCategories: vi.fn(async () => CUSTOM_CATEGORIES),
    getReviews: vi.fn(async () => []),
    ...overrides,
  } satisfies CatalogDataProvider;
}

describe('data provider wiring', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders products from a custom provider instead of the demo dataset', async () => {
    const provider = makeProvider();

    render(
      <MemoryRouter initialEntries={['/']}>
        <CatalogProvider dataProvider={provider} config={{ companyName: 'Custom' }}>
          <ProductsPage />
        </CatalogProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Backend Widget')).toBeInTheDocument();
    expect(screen.getByText('Backend Gadget')).toBeInTheDocument();
    expect(provider.getProducts).toHaveBeenCalled();
  });

  it('asks the provider for categories rather than reading them locally', async () => {
    const provider = makeProvider();

    render(
      <MemoryRouter initialEntries={['/']}>
        <CatalogProvider dataProvider={provider}>
          <ProductsPage />
        </CatalogProvider>
      </MemoryRouter>,
    );

    await waitFor(() => expect(provider.getCategories).toHaveBeenCalled());
  });

  it('reaches the provider through CatalogApp, not only CatalogProvider', async () => {
    const provider = makeProvider();

    render(<CatalogApp defaultTheme="fashion" dataProvider={provider} />);

    // The home page renders featured products, so this also pins the params
    // the page passes down.
    await waitFor(() => expect(provider.getProducts).toHaveBeenCalled());
    expect(provider.getProducts).toHaveBeenCalledWith(
      expect.objectContaining({ featured: true }),
    );
  });

  it('falls back to the bundled demo data when no provider is given', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <CatalogProvider defaultTheme="fashion">
          <ProductsPage />
        </CatalogProvider>
      </MemoryRouter>,
    );

    // Whatever the demo catalog contains, it is not the fixture above.
    await waitFor(() =>
      expect(screen.queryByText('Backend Widget')).not.toBeInTheDocument(),
    );
    expect(document.querySelector('h1')).toBeInTheDocument();
  });
});

describe('catalog query hooks', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('useProducts forwards query params to the provider', async () => {
    const provider = makeProvider();

    const Probe = () => {
      const { products } = useProducts({ search: 'gadget' });
      return <ul>{products.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
    };

    render(
      <CatalogProvider dataProvider={provider}>
        <Probe />
      </CatalogProvider>,
    );

    expect(await screen.findByText('Backend Gadget')).toBeInTheDocument();
    expect(screen.queryByText('Backend Widget')).not.toBeInTheDocument();
    expect(provider.getProducts).toHaveBeenCalledWith({ search: 'gadget' });
  });

  it('useCategories exposes an empty list while loading rather than undefined', async () => {
    const provider = makeProvider();
    const seen: number[] = [];

    const Probe = () => {
      const { categories } = useCategories();
      seen.push(categories.length);
      return <span>{categories.length}</span>;
    };

    render(
      <CatalogProvider dataProvider={provider}>
        <Probe />
      </CatalogProvider>,
    );

    // First render happens before the promise resolves; consumers map over the
    // array immediately, so it must never be undefined.
    expect(seen[0]).toBe(0);
    expect(await screen.findByText('2')).toBeInTheDocument();
  });

  it('tolerates a provider that does not implement getReviews', async () => {
    const provider = makeProvider();
    // getReviews is optional on the interface.
    delete (provider as Partial<CatalogDataProvider>).getReviews;

    render(<CatalogApp defaultTheme="fashion" dataProvider={provider as CatalogDataProvider} />);

    await waitFor(() => expect(provider.getProducts).toHaveBeenCalled());
    expect(document.querySelector('main')).toBeInTheDocument();
  });
});
