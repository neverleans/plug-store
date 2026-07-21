import { Product, Category, Review } from '../types/index.ts';

export const artProducts: Product[] = [
  { id: 'ar1', name: 'Abstract Composition #7', description: 'Original mixed-media abstract on linen canvas. Signed by the artist.', price: 1850, originalPrice: 2200, images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600'], category: 'Paintings', rating: 5.0, reviewCount: 12, tags: ['original','abstract'], inStock: true, industry: 'art', featured: true },
  { id: 'ar2', name: 'Brutalist Sculpture I', description: 'Hand-cast bronze brutalist sculpture. Limited edition of 25.', price: 3400, images: ['https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=600'], category: 'Sculpture', rating: 4.9, reviewCount: 8, tags: ['bronze','brutalist'], inStock: true, industry: 'art', featured: true },
  { id: 'ar3', name: 'Silver Gelatin Print', description: 'Hand-printed silver gelatin photograph. 16x20 inches, archivally mounted.', price: 680, images: ['https://images.unsplash.com/photo-1502740479091-635887520276?w=600'], category: 'Photography', rating: 4.8, reviewCount: 23, tags: ['photography','print'], inStock: true, industry: 'art' },
  { id: 'ar4', name: 'Ceramic Vessel No. 14', description: 'Wheel-thrown stoneware vessel with ash glaze. One-of-a-kind.', price: 420, images: ['https://images.unsplash.com/photo-1493106819501-66d381c466f1?w=600'], category: 'Ceramics', rating: 4.9, reviewCount: 17, tags: ['ceramics','handmade'], inStock: true, industry: 'art', featured: true },
  { id: 'ar5', name: 'Charcoal Figure Study', description: 'Original charcoal drawing on archival paper. 22x30 inches.', price: 290, images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600'], category: 'Drawings', rating: 4.7, reviewCount: 14, tags: ['charcoal','figure'], inStock: true, industry: 'art' },
  { id: 'ar6', name: 'Risograph Print Series', description: 'Three-color risograph print, edition of 50. Signed and numbered.', price: 85, images: ['https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600'], category: 'Prints', rating: 4.8, reviewCount: 41, tags: ['print','editions'], inStock: true, industry: 'art', featured: true },
  { id: 'ar7', name: 'Kinetic Wall Mobile', description: 'Calder-inspired hand-balanced wall mobile in painted aluminum.', price: 920, images: ['https://images.unsplash.com/photo-1517697471339-4aa32003c11a?w=600'], category: 'Sculpture', rating: 4.9, reviewCount: 9, tags: ['mobile','kinetic'], inStock: true, industry: 'art' },
  { id: 'ar8', name: 'Watercolor Landscape', description: 'Plein-air watercolor on hot-press paper. Framed in white oak.', price: 540, images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600'], category: 'Paintings', rating: 4.8, reviewCount: 11, tags: ['watercolor','landscape'], inStock: true, industry: 'art' },
];

export const artCategories: Category[] = [
  { id: 'arc1', name: 'Paintings', slug: 'paintings', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400', industry: 'art' },
  { id: 'arc2', name: 'Sculpture', slug: 'sculpture', image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400', industry: 'art' },
  { id: 'arc3', name: 'Photography', slug: 'photography', image: 'https://images.unsplash.com/photo-1502740479091-635887520276?w=400', industry: 'art' },
  { id: 'arc4', name: 'Ceramics', slug: 'ceramics', image: 'https://images.unsplash.com/photo-1493106819501-66d381c466f1?w=400', industry: 'art' },
  { id: 'arc5', name: 'Drawings', slug: 'drawings', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400', industry: 'art' },
  { id: 'arc6', name: 'Prints', slug: 'prints', image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400', industry: 'art' },
];

export const artReviews: Review[] = [
  { id: 'arr1', productId: 'ar1', author: 'Curator J.', rating: 5, comment: 'Stunning piece. Even more powerful in person.', date: '2024-03-19' },
  { id: 'arr2', productId: 'ar4', author: 'Mira H.', rating: 5, comment: 'Beautiful glaze depth. Perfect addition to my collection.', date: '2024-02-22' },
];
