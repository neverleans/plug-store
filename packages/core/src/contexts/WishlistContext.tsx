import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_KEY = 'ecom-wishlist';

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product) => setItems(prev => prev.some(i => i.id === product.id) ? prev : [...prev, product]);
  const removeItem = (productId: string) => setItems(prev => prev.filter(i => i.id !== productId));
  const isInWishlist = (productId: string) => items.some(i => i.id === productId);
  const toggleItem = (product: Product) => isInWishlist(product.id) ? removeItem(product.id) : addItem(product);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, toggleItem }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
