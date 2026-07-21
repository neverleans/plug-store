import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '@/types';

const KEY = 'ecom-recently-viewed';
const MAX = 8;

interface Ctx {
  items: Product[];
  add: (product: Product) => void;
  clear: () => void;
}

const RecentlyViewedContext = createContext<Ctx | undefined>(undefined);

export const RecentlyViewedProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const add = useCallback((product: Product) => {
    setItems((prev) => {
      const next = [product, ...prev.filter((p) => p.id !== product.id)];
      return next.slice(0, MAX);
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return (
    <RecentlyViewedContext.Provider value={{ items, add, clear }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  return ctx;
};
