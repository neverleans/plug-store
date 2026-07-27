import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useCatalogDataContext } from '@/contexts/DataContext';
import type { DataProviderQueryParams } from '@/data/provider';
import type { Category, Product, Review } from '@/types';

/**
 * Read hooks over the active CatalogDataProvider.
 *
 * The built-in pages used to import the bundled demo dataset directly, which
 * meant passing `dataProvider` to <CatalogApp /> changed nothing on screen —
 * the storefront still rendered demo products. These hooks are the seam: every
 * page reads through them, so whatever provider is mounted is what the store
 * displays.
 *
 * react-query is already a dependency and its QueryClientProvider is already
 * mounted by CatalogProvider, so this adds caching, deduplication, loading and
 * error state without new machinery.
 */

/** Namespace so a host app's own react-query cache never collides with ours. */
const ROOT = 'plugstore';

/** Five minutes matches the QueryClient default configured in CatalogProvider. */
const STALE_TIME = 1000 * 60 * 5;

export interface CatalogQueryResult {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export interface UseProductsResult extends CatalogQueryResult {
  products: Product[];
}

export interface UseCategoriesResult extends CatalogQueryResult {
  categories: Category[];
}

export interface UseProductResult extends CatalogQueryResult {
  product: Product | null;
}

export interface UseProductReviewsResult extends CatalogQueryResult {
  reviews: Review[];
}

/**
 * Products from the active provider, optionally filtered server-side.
 *
 * Filters the provider understands (`category`, `search`, `featured`, `limit`)
 * are passed through; anything more specific is meant to be applied to the
 * returned array, which is what the products page does for price, rating and
 * tags.
 */
export const useProducts = (
  params?: DataProviderQueryParams,
  /**
   * Set `enabled: false` to hold the request back — used when the parameters
   * depend on something still loading, so the hook does not fire once with the
   * wrong filter and again with the right one.
   */
  options?: { enabled?: boolean },
): UseProductsResult => {
  const { dataProvider, providerKey } = useCatalogDataContext();
  const enabled = options?.enabled ?? true;

  const query = useQuery({
    queryKey: [ROOT, providerKey, 'products', params ?? null],
    queryFn: () => dataProvider.getProducts(params),
    enabled,
    staleTime: STALE_TIME,
    // Keep the previous results on screen while a new filter loads, instead of
    // collapsing the grid to empty on every keystroke.
    placeholderData: keepPreviousData,
  });

  return {
    products: query.data ?? [],
    isLoading: enabled && query.isPending,
    isError: query.isError,
    error: query.error,
  };
};

export const useCategories = (): UseCategoriesResult => {
  const { dataProvider, providerKey } = useCatalogDataContext();

  const query = useQuery({
    queryKey: [ROOT, providerKey, 'categories'],
    queryFn: () => dataProvider.getCategories(),
    staleTime: STALE_TIME,
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
  };
};

/** A single product. Pass a falsy id to skip the request entirely. */
export const useProduct = (id: string | undefined): UseProductResult => {
  const { dataProvider, providerKey } = useCatalogDataContext();

  const query = useQuery({
    queryKey: [ROOT, providerKey, 'product', id],
    queryFn: () => dataProvider.getProductById(id as string),
    enabled: Boolean(id),
    staleTime: STALE_TIME,
  });

  return {
    product: query.data ?? null,
    // A disabled query never resolves, so report it as settled rather than
    // leaving the caller stuck on a spinner for a product that has no id.
    isLoading: Boolean(id) && query.isPending,
    isError: query.isError,
    error: query.error,
  };
};

/**
 * Reviews for a product. `getReviews` is optional on the provider interface;
 * when a backend does not implement it this resolves to an empty list rather
 * than throwing.
 */
export const useProductReviews = (productId: string | undefined): UseProductReviewsResult => {
  const { dataProvider, providerKey } = useCatalogDataContext();
  const supported = Boolean(productId) && typeof dataProvider.getReviews === 'function';

  const query = useQuery({
    queryKey: [ROOT, providerKey, 'reviews', productId],
    queryFn: () => dataProvider.getReviews!(productId as string),
    enabled: supported,
    staleTime: STALE_TIME,
  });

  return {
    reviews: query.data ?? [],
    isLoading: supported && query.isPending,
    isError: query.isError,
    error: query.error,
  };
};
