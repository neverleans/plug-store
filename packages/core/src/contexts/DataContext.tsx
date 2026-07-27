import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { CatalogDataProvider } from '../data/provider';
import { dummyDataProvider } from '../data/adapters';
import { useTheme } from './ThemeContext';

interface DataContextType {
  dataProvider: CatalogDataProvider;
  /**
   * Stable identity for the active provider, used as the react-query cache key
   * prefix. The provider itself is an object and cannot be serialised, and the
   * bundled demo provider is rebuilt per theme — so switching theme must
   * invalidate the cache, while a custom provider must not be re-fetched just
   * because the visitor changed the look of the store.
   */
  providerKey: string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * Stable per-object identity for custom providers.
 *
 * A constant key such as `'custom'` would make two different providers share
 * one cache entry — mount a second store on the same page and it reads the
 * first one's products. Keying off the object itself means the same provider
 * keeps its cache across re-renders while a different one gets its own.
 */
const providerIds = new WeakMap<CatalogDataProvider, string>();
let nextProviderId = 0;

const identify = (provider: CatalogDataProvider): string => {
  let id = providerIds.get(provider);
  if (!id) {
    id = `custom:${(nextProviderId += 1)}`;
    providerIds.set(provider, id);
  }
  return id;
};

export interface DataProviderWrapperProps {
  children: ReactNode;
  /** Optional custom data provider passed by developer */
  dataProvider?: CatalogDataProvider;
}

/**
 * DataProviderWrapper
 * 
 * Exposes the active Headless DataProvider to the rest of the application.
 * Falls back to dummyDataProvider matching active theme if no custom provider is passed.
 */
export const DataProviderWrapper: React.FC<DataProviderWrapperProps> = ({
  children,
  dataProvider: customProvider,
}) => {
  const { template } = useTheme();

  const value = useMemo<DataContextType>(() => {
    if (customProvider) {
      return { dataProvider: customProvider, providerKey: identify(customProvider) };
    }
    return { dataProvider: dummyDataProvider(template), providerKey: `demo:${template}` };
  }, [customProvider, template]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

/** Internal: the full context, including the cache key. */
export const useCatalogDataContext = (): DataContextType => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useCatalogData must be used within DataProviderWrapper / CatalogProvider');
  }
  return ctx;
};

/**
 * The active data provider. Useful when you need to call it imperatively; for
 * rendering, prefer the `useProducts` / `useCategories` / `useProduct` hooks,
 * which add caching, loading and error state on top of it.
 */
export const useCatalogData = (): CatalogDataProvider => useCatalogDataContext().dataProvider;
