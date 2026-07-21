import { CatalogDataProvider } from './provider';
import { getProducts, getCategories, getReviews, getProductById } from './index';
import { IndustryTemplate, Product, Category, Review, Order } from '@/types';

/**
 * dummyDataProvider
 * 
 * Data provider using built-in mock datasets across all 15 industry templates.
 */
export const dummyDataProvider = (industry: IndustryTemplate = 'fashion'): CatalogDataProvider => ({
  async getProducts(params) {
    let list = getProducts(industry);
    if (params?.category) {
      list = list.filter((p) => p.category === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (params?.featured) {
      list = list.filter((p) => p.featured);
    }
    if (params?.limit) {
      list = list.slice(0, params.limit);
    }
    return list;
  },

  async getProductById(id: string) {
    return getProductById(industry, id) || null;
  },

  async getCategories() {
    return getCategories(industry);
  },

  async getReviews(productId: string) {
    return getReviews(industry).filter((r) => r.productId === productId);
  },

  async createOrder(orderData) {
    const order: Order = {
      id: 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      date: new Date().toISOString(),
      status: 'confirmed',
      items: orderData.items || [],
      shipping: orderData.shipping || { fullName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '' },
      total: orderData.total || 0,
    };
    return order;
  },
});

/**
 * restDataProvider
 * 
 * Generic Data Provider for REST APIs.
 * Connects PlugStore UI directly to any backend endpoint (Node.js, Laravel, Django, Python, Go, etc.)
 */
export const restDataProvider = (
  baseUrl: string,
  options?: { headers?: Record<string, string> }
): CatalogDataProvider => {
  const fetchJson = async <T>(endpoint: string): Promise<T> => {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!res.ok) {
      throw new Error(`REST Provider Error [${res.status}]: ${res.statusText}`);
    }
    return res.json();
  };

  return {
    async getProducts(params) {
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.featured) query.set('featured', 'true');
      if (params?.limit) query.set('limit', String(params.limit));

      const qs = query.toString() ? `?${query.toString()}` : '';
      return fetchJson<Product[]>(`/products${qs}`);
    },

    async getProductById(id: string) {
      return fetchJson<Product>(`/products/${id}`);
    },

    async getCategories() {
      return fetchJson<Category[]>('/categories');
    },

    async getReviews(productId: string) {
      return fetchJson<Review[]>(`/products/${productId}/reviews`);
    },

    async createOrder(orderData) {
      const res = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: JSON.stringify(orderData),
      });
      return res.json();
    },
  };
};

/**
 * customDataProvider
 * 
 * Allows developers to define custom async handler functions for maximum flexibility
 * (Prisma, GraphQL, Supabase, Firebase, Custom Fetch, etc.)
 */
export const customDataProvider = (handlers: CatalogDataProvider): CatalogDataProvider => handlers;
