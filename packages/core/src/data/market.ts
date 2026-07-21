import { Product, Category, Review } from '../types/index.ts';

export const marketProducts: Product[] = [
  { id: 'm1', name: 'Cold-Pressed Olive Oil', description: 'Single-estate Tuscan extra virgin olive oil. 500ml dark glass bottle.', price: 28, images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600'], category: 'Pantry', rating: 4.9, reviewCount: 423, tags: ['olive oil', 'tuscan', 'cold-pressed'], inStock: true, industry: 'market', featured: true },
  { id: 'm2', name: 'Single-Origin Coffee Beans', description: 'Whole-bean Ethiopian Yirgacheffe. Bright, floral, citrus notes. 340g.', price: 22, images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600'], category: 'Beverages', rating: 4.8, reviewCount: 567, variants: [{ id: 'v1', name: 'Grind', type: 'flavor', options: ['Whole Bean', 'Espresso', 'Filter', 'French Press'] }], tags: ['coffee', 'beans', 'single-origin'], inStock: true, industry: 'market', featured: true },
  { id: 'm3', name: 'Aged Manchego Cheese', description: '12-month aged sheep milk Manchego. 250g wedge, vacuum-sealed.', price: 18, images: ['https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600'], category: 'Dairy', rating: 4.7, reviewCount: 198, tags: ['cheese', 'manchego', 'aged'], inStock: true, industry: 'market' },
  { id: 'm4', name: 'Sourdough Loaf', description: 'Naturally leavened sourdough, baked daily. Crisp crust, open crumb.', price: 9, images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600'], category: 'Bakery', rating: 4.9, reviewCount: 789, tags: ['bread', 'sourdough', 'fresh'], inStock: true, industry: 'market', featured: true },
  { id: 'm5', name: 'Heirloom Tomatoes', description: 'Mixed heirloom tomatoes from local farms. 1kg basket, peak season.', price: 12, images: ['https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=600'], category: 'Produce', rating: 4.8, reviewCount: 312, tags: ['tomato', 'heirloom', 'local'], inStock: true, industry: 'market' },
  { id: 'm6', name: 'Wildflower Honey', description: 'Raw, unfiltered wildflower honey from regional apiaries. 350g jar.', price: 16, images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600'], category: 'Pantry', rating: 4.9, reviewCount: 234, tags: ['honey', 'raw', 'local'], inStock: true, industry: 'market' },
  { id: 'm7', name: 'Free-Range Eggs', description: 'Dozen pasture-raised brown eggs from happy hens. Always fresh.', price: 8, images: ['https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=600'], category: 'Dairy', rating: 4.8, reviewCount: 678, tags: ['eggs', 'free-range', 'dozen'], inStock: true, industry: 'market' },
  { id: 'm8', name: 'Sea Salt Flakes', description: 'Hand-harvested flaky sea salt in reusable tin. The finishing touch.', price: 14, images: ['https://images.unsplash.com/photo-1612440113503-abe2dabbef47?w=600'], category: 'Pantry', rating: 4.7, reviewCount: 345, tags: ['salt', 'sea salt', 'flakes'], inStock: true, industry: 'market' },
  { id: 'm9', name: 'Sparkling Mineral Water', description: 'French Alpine sparkling water, 12-pack glass bottles. Crisp and clean.', price: 36, images: ['https://images.unsplash.com/photo-1606168094336-48f8b0c1f29e?w=600'], category: 'Beverages', rating: 4.6, reviewCount: 156, tags: ['water', 'sparkling', 'french'], inStock: true, industry: 'market' },
  { id: 'm10', name: 'Dark Chocolate Bar 70%', description: 'Single-origin Ecuadorian dark chocolate. Velvety, complex, no additives.', price: 7, images: ['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600'], category: 'Pantry', rating: 4.8, reviewCount: 489, variants: [{ id: 'v1', name: 'Cacao', type: 'flavor', options: ['70%', '85%', '100%'] }], tags: ['chocolate', 'dark', 'single-origin'], inStock: true, industry: 'market', featured: true },
  { id: 'm11', name: 'Organic Pasta', description: 'Bronze-die durum wheat pasta from Puglia. 500g, traditional shapes.', price: 6, images: ['https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=600'], category: 'Pantry', rating: 4.7, reviewCount: 267, variants: [{ id: 'v1', name: 'Shape', type: 'flavor', options: ['Spaghetti', 'Penne', 'Rigatoni', 'Orecchiette'] }], tags: ['pasta', 'organic', 'italian'], inStock: true, industry: 'market' },
  { id: 'm12', name: 'Natural Wine', description: 'Low-intervention orange wine from a small biodynamic vineyard. 750ml.', price: 32, images: ['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600'], category: 'Beverages', rating: 4.7, reviewCount: 134, tags: ['wine', 'natural', 'biodynamic'], inStock: true, industry: 'market' },
];

export const marketCategories: Category[] = [
  { id: 'mc1', name: 'Pantry', slug: 'pantry', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', industry: 'market' },
  { id: 'mc2', name: 'Produce', slug: 'produce', image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400', industry: 'market' },
  { id: 'mc3', name: 'Bakery', slug: 'bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', industry: 'market' },
  { id: 'mc4', name: 'Dairy', slug: 'dairy', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', industry: 'market' },
  { id: 'mc5', name: 'Beverages', slug: 'beverages', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', industry: 'market' },
];

export const marketReviews: Review[] = [
  { id: 'mr1', productId: 'm1', author: 'GiuliaR', rating: 5, comment: 'The most peppery, alive olive oil I have tasted outside Italy.', date: '2024-04-03' },
  { id: 'mr2', productId: 'm2', author: 'NoahB', rating: 5, comment: 'Bright cup with citrus and jasmine. Perfect filter coffee.', date: '2024-03-28' },
  { id: 'mr3', productId: 'm4', author: 'IvyM', rating: 5, comment: 'Crackling crust and a beautiful crumb. Tastes like Saturday morning.', date: '2024-03-21' },
];
