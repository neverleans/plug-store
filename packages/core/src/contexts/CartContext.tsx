import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variants?: Record<string, string>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  shippingCost: number;
  total: number;
  itemCount: number;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  discount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'ecom-cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [discountCode, setDiscountCode] = useState('');

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1, selectedVariants?: Record<string, string>) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { product, quantity, selectedVariants }];
    });
  };

  const removeItem = (productId: string) => setItems(prev => prev.filter(i => i.product.id !== productId));
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(productId);
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  };
  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const discount = discountCode === 'SAVE10' ? subtotal * 0.1 : 0;
  const shippingCost = subtotal > 500 || subtotal === 0 ? 0 : 25;
  const total = subtotal - discount + shippingCost;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, shippingCost, total, itemCount, discountCode, setDiscountCode, discount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
