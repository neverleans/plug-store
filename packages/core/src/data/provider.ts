import { Product, Category, Review, Order } from '@/types';

export interface DataProviderQueryParams {
  category?: string;
  search?: string;
  limit?: number;
  featured?: boolean;
}

export interface CatalogDataProvider {
  /** Fetch list of products with optional filtering */
  getProducts: (params?: DataProviderQueryParams) => Promise<Product[]>;
  /** Fetch single product by ID */
  getProductById: (id: string) => Promise<Product | null>;
  /** Fetch categories list */
  getCategories: () => Promise<Category[]>;
  /** Fetch product reviews (optional) */
  getReviews?: (productId: string) => Promise<Review[]>;
  /** Handle new order creation (optional) */
  createOrder?: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<Order>;
}
