import { describe, it, expect } from 'vitest';
import { getProducts, getCategories, searchProducts } from '../data';

describe('@neverleans/plug-store-core Data Accessors & Search', () => {
  it('should fetch products for fashion template', () => {
    const products = getProducts('fashion');
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('name');
    expect(products[0]).toHaveProperty('price');
  });

  it('should fetch categories for electronics template', () => {
    const categories = getCategories('electronics');
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty('slug');
  });

  it('should filter products matching search query', () => {
    const results = searchProducts('fashion', 'dress');
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
  });
});
