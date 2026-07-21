import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '@/types';

const KEY = 'ecom-compare';
const MAX = 4;

interface Ctx {
  items: Product[];
  toggle: (product: Product) => boolean; // returns true if added, false if removed/blocked
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  isFull: boolean;
}

const CompareContext = createContext<Ctx | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const has = useCallback((id: string) => items.some((p) => p.id === id), [items]);
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((p) => p.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);
  const toggle = useCallback((product: Product) => {
    let added = false;
    setItems((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= MAX) return prev;
      added = true;
      return [...prev, product];
    });
    return added;
  }, []);

  return (
    <CompareContext.Provider value={{ items, toggle, remove, clear, has, isFull: items.length >= MAX }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
};
