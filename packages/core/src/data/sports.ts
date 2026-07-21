import { Product, Category, Review } from '../types/index.ts';

export const sportsProducts: Product[] = [
  { id: 's1', name: 'Pro Running Shoes X9', description: 'Carbon-plated racing shoes engineered for marathon PRs. Lightweight foam, snappy response.', price: 220, originalPrice: 280, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'], category: 'Footwear', rating: 4.9, reviewCount: 412, variants: [{ id: 'v1', name: 'Size', type: 'size', options: ['7','8','9','10','11','12'] }], tags: ['running','marathon'], inStock: true, industry: 'sports', featured: true },
  { id: 's2', name: 'CrossFit Power Bar', description: '20kg Olympic barbell with knurled grip and dual markings. IWF-certified.', price: 340, images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600'], category: 'Strength', rating: 4.8, reviewCount: 156, tags: ['barbell','crossfit'], inStock: true, industry: 'sports', featured: true },
  { id: 's3', name: 'Trail Hydration Vest', description: '12L hydration vest with two soft flasks, perfect for ultra-trail runners.', price: 165, images: ['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600'], category: 'Running', rating: 4.7, reviewCount: 89, variants: [{ id: 'v1', name: 'Size', type: 'size', options: ['S','M','L'] }], tags: ['trail','hydration'], inStock: true, industry: 'sports' },
  { id: 's4', name: 'Carbon Road Bike Helmet', description: 'Aero-optimized carbon helmet, MIPS-protected, sub-250g weight.', price: 280, images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600'], category: 'Cycling', rating: 4.6, reviewCount: 73, tags: ['cycling','helmet'], inStock: true, industry: 'sports', featured: true },
  { id: 's5', name: 'Performance Compression Tights', description: 'Engineered compression for muscle support and faster recovery.', price: 95, images: ['https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600'], category: 'Apparel', rating: 4.5, reviewCount: 201, variants: [{ id: 'v1', name: 'Size', type: 'size', options: ['XS','S','M','L','XL'] }], tags: ['compression'], inStock: true, industry: 'sports' },
  { id: 's6', name: 'Adjustable Dumbbell Set', description: '5-50lb adjustable dumbbells. Replaces an entire weight rack.', price: 449, originalPrice: 549, images: ['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600'], category: 'Strength', rating: 4.9, reviewCount: 312, tags: ['home gym','strength'], inStock: true, industry: 'sports', featured: true },
  { id: 's7', name: 'Boxing Gloves Pro 14oz', description: 'Premium leather boxing gloves with multi-layer foam for sparring.', price: 130, images: ['https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600'], category: 'Combat', rating: 4.7, reviewCount: 98, tags: ['boxing','gloves'], inStock: true, industry: 'sports' },
  { id: 's8', name: 'Yoga Mat Cork Pro', description: 'Natural cork yoga mat with rubber backing. Eco-friendly and grippy.', price: 78, images: ['https://images.unsplash.com/photo-1591291621164-2c6367723315?w=600'], category: 'Fitness', rating: 4.6, reviewCount: 167, tags: ['yoga','eco'], inStock: true, industry: 'sports' },
];

export const sportsCategories: Category[] = [
  { id: 'sc1', name: 'Footwear', slug: 'footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', industry: 'sports' },
  { id: 'sc2', name: 'Strength', slug: 'strength', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400', industry: 'sports' },
  { id: 'sc3', name: 'Running', slug: 'running', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400', industry: 'sports' },
  { id: 'sc4', name: 'Cycling', slug: 'cycling', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400', industry: 'sports' },
  { id: 'sc5', name: 'Combat', slug: 'combat', image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=400', industry: 'sports' },
  { id: 'sc6', name: 'Fitness', slug: 'fitness', image: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=400', industry: 'sports' },
];

export const sportsReviews: Review[] = [
  { id: 'sr1', productId: 's1', author: 'Marathon Mike', rating: 5, comment: 'Set a new PR in these. Insane responsiveness.', date: '2024-04-02' },
  { id: 'sr2', productId: 's6', author: 'Home Gym Hero', rating: 5, comment: 'Replaced my entire dumbbell rack. Game changer.', date: '2024-03-22' },
];
