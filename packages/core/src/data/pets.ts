import { Product, Category, Review } from '../types/index.ts';

export const petsProducts: Product[] = [
  { id: 'p1', name: 'Plush Donut Dog Bed', description: 'Ultra-soft faux fur donut bed with raised rim for head support. Machine washable.', price: 65, originalPrice: 89, images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600'], category: 'Beds', rating: 4.8, reviewCount: 1241, variants: [{ id: 'v1', name: 'Size', type: 'size', options: ['S','M','L','XL'] }], tags: ['dog','comfort'], inStock: true, industry: 'pets', featured: true },
  { id: 'p2', name: 'Interactive Cat Tower', description: '5-foot cat tree with sisal scratching posts, hideouts, and dangling toys.', price: 159, images: ['https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600'], category: 'Cat', rating: 4.7, reviewCount: 542, tags: ['cat','play'], inStock: true, industry: 'pets', featured: true },
  { id: 'p3', name: 'Smart Auto Feeder', description: 'App-controlled smart feeder with portion control and HD camera.', price: 199, images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600'], category: 'Tech', rating: 4.6, reviewCount: 367, tags: ['smart','feeder'], inStock: true, industry: 'pets', featured: true },
  { id: 'p4', name: 'Leather Dog Harness', description: 'Hand-stitched leather harness with brass hardware. Built for adventure.', price: 89, images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600'], category: 'Walking', rating: 4.5, reviewCount: 198, variants: [{ id: 'v1', name: 'Size', type: 'size', options: ['XS','S','M','L','XL'] }], tags: ['dog','harness'], inStock: true, industry: 'pets' },
  { id: 'p5', name: 'Organic Salmon Treats', description: 'Wild-caught salmon training treats. Grain-free, single ingredient.', price: 14, images: ['https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600'], category: 'Food', rating: 4.9, reviewCount: 893, tags: ['treats','organic'], inStock: true, industry: 'pets' },
  { id: 'p6', name: 'Puzzle Treat Ball', description: 'Adjustable difficulty puzzle ball that keeps pets mentally stimulated.', price: 24, images: ['https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600'], category: 'Toys', rating: 4.6, reviewCount: 612, tags: ['puzzle','enrichment'], inStock: true, industry: 'pets', featured: true },
  { id: 'p7', name: 'Waterproof Travel Bowl', description: 'Collapsible silicone bowl, perfect for hikes and road trips.', price: 12, images: ['https://images.unsplash.com/photo-1548658146-f142deadf8f7?w=600'], category: 'Travel', rating: 4.7, reviewCount: 432, tags: ['travel','bowl'], inStock: true, industry: 'pets' },
  { id: 'p8', name: 'Aquarium Starter Kit', description: '20-gallon aquarium with LED lighting, filter, and decorations.', price: 145, images: ['https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600'], category: 'Aquatic', rating: 4.5, reviewCount: 187, tags: ['fish','aquarium'], inStock: true, industry: 'pets' },
];

export const petsCategories: Category[] = [
  { id: 'pc1', name: 'Beds', slug: 'beds', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400', industry: 'pets' },
  { id: 'pc2', name: 'Cat', slug: 'cat', image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400', industry: 'pets' },
  { id: 'pc3', name: 'Tech', slug: 'tech', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', industry: 'pets' },
  { id: 'pc4', name: 'Walking', slug: 'walking', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400', industry: 'pets' },
  { id: 'pc5', name: 'Food', slug: 'food', image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400', industry: 'pets' },
  { id: 'pc6', name: 'Toys', slug: 'toys', image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400', industry: 'pets' },
];

export const petsReviews: Review[] = [
  { id: 'pr1', productId: 'p1', author: 'Buddy\'s Mom', rating: 5, comment: 'My golden adores it. He never leaves it.', date: '2024-04-01' },
  { id: 'pr2', productId: 'p3', author: 'Tech Cat Dad', rating: 4, comment: 'Great app, occasional wifi hiccups. Camera quality is excellent.', date: '2024-03-15' },
];
