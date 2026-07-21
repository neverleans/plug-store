import { Product, Category, Review } from '../types/index.ts';

export const automotiveProducts: Product[] = [
  { id: 'a1', name: 'Forged Performance Wheels 19"', description: 'Lightweight forged aluminum wheels. Set of 4. Reduces unsprung mass by 30%.', price: 2400, originalPrice: 2800, images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600'], category: 'Wheels', rating: 4.9, reviewCount: 134, tags: ['performance','forged'], inStock: true, industry: 'automotive', featured: true },
  { id: 'a2', name: 'Carbon Fiber Spoiler', description: 'Aerodynamic carbon fiber rear spoiler. Track-tested downforce.', price: 890, images: ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600'], category: 'Aero', rating: 4.7, reviewCount: 67, tags: ['carbon','aero'], inStock: true, industry: 'automotive', featured: true },
  { id: 'a3', name: 'Cold Air Intake System', description: 'High-flow cold air intake. +15 horsepower, dyno-proven.', price: 380, images: ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600'], category: 'Engine', rating: 4.6, reviewCount: 213, tags: ['intake','engine'], inStock: true, industry: 'automotive' },
  { id: 'a4', name: 'Big Brake Kit 6-Piston', description: '6-piston monoblock calipers with 380mm rotors. Track-ready stopping power.', price: 3200, images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600'], category: 'Brakes', rating: 4.9, reviewCount: 89, tags: ['brakes','track'], inStock: true, industry: 'automotive', featured: true },
  { id: 'a5', name: 'Coilover Suspension Kit', description: 'Adjustable coilovers with 32-way damping. Lowers ride height 1-3".', price: 1850, images: ['https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?w=600'], category: 'Suspension', rating: 4.7, reviewCount: 156, tags: ['suspension','tuning'], inStock: true, industry: 'automotive' },
  { id: 'a6', name: 'Titanium Cat-Back Exhaust', description: 'Full titanium exhaust system. Aggressive sound, 12kg lighter.', price: 2950, images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600'], category: 'Exhaust', rating: 4.8, reviewCount: 78, tags: ['titanium','exhaust'], inStock: true, industry: 'automotive', featured: true },
  { id: 'a7', name: 'Racing Bucket Seat', description: 'FIA-approved fixed-back bucket seat with 6-point harness mounts.', price: 1200, images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600'], category: 'Interior', rating: 4.6, reviewCount: 45, tags: ['racing','seat'], inStock: true, industry: 'automotive' },
  { id: 'a8', name: 'LED Headlight Conversion', description: 'Plug-and-play LED headlight upgrade. 4x brighter than halogen.', price: 290, images: ['https://images.unsplash.com/photo-1542362567-b07e54358753?w=600'], category: 'Lighting', rating: 4.5, reviewCount: 312, tags: ['lighting','LED'], inStock: true, industry: 'automotive' },
];

export const automotiveCategories: Category[] = [
  { id: 'ac1', name: 'Wheels', slug: 'wheels', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400', industry: 'automotive' },
  { id: 'ac2', name: 'Aero', slug: 'aero', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400', industry: 'automotive' },
  { id: 'ac3', name: 'Engine', slug: 'engine', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400', industry: 'automotive' },
  { id: 'ac4', name: 'Brakes', slug: 'brakes', image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', industry: 'automotive' },
  { id: 'ac5', name: 'Suspension', slug: 'suspension', image: 'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?w=400', industry: 'automotive' },
  { id: 'ac6', name: 'Exhaust', slug: 'exhaust', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400', industry: 'automotive' },
];

export const automotiveReviews: Review[] = [
  { id: 'ar1', productId: 'a1', author: 'Track Day Tom', rating: 5, comment: 'Felt the weight difference immediately. Massive grip improvement.', date: '2024-03-28' },
  { id: 'ar2', productId: 'a4', author: 'Apex Hunter', rating: 5, comment: 'No more brake fade after 20 laps. Worth every dollar.', date: '2024-03-05' },
];
