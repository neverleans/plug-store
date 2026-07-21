import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { CatalogDataProvider } from '../data/provider';
import { dummyDataProvider } from '../data/adapters';
import { useTheme } from './ThemeContext';

interface DataContextType {
  dataProvider: CatalogDataProvider;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

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

  const activeProvider = useMemo(() => {
    if (customProvider) return customProvider;
    return dummyDataProvider(template);
  }, [customProvider, template]);

  return (
    <DataContext.Provider value={{ dataProvider: activeProvider }}>
      {children}
    </DataContext.Provider>
  );
};

export const useCatalogData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useCatalogData must be used within DataProviderWrapper / CatalogProvider');
  }
  return ctx.dataProvider;
};
