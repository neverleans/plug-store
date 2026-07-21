import { Product } from '@/types';

/** Deterministic pseudo-stock in [0, 20] derived from the product id. */
export const getStock = (product: Product): number => {
  if (!product.inStock) return 0;
  let h = 0;
  for (let i = 0; i < product.id.length; i++) h = (h * 31 + product.id.charCodeAt(i)) | 0;
  return (Math.abs(h) % 20) + 1; // 1-20
};

export const isLowStock = (product: Product) => {
  const s = getStock(product);
  return s > 0 && s <= 5;
};
