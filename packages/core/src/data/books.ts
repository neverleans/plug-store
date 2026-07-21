import { Product, Category, Review } from '../types/index.ts';

export const booksProducts: Product[] = [
  { id: 'b1', name: 'The Midnight Library', description: 'A novel about all the choices that go into a life well lived. Hardcover edition.', price: 24, originalPrice: 32, images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'], category: 'Fiction', rating: 4.7, reviewCount: 8421, tags: ['bestseller','novel'], inStock: true, industry: 'books', featured: true },
  { id: 'b2', name: 'Atomic Habits', description: 'Tiny changes, remarkable results. James Clear\'s definitive guide to habits.', price: 19, images: ['https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600'], category: 'Self-Help', rating: 4.9, reviewCount: 12043, tags: ['habits','productivity'], inStock: true, industry: 'books', featured: true },
  { id: 'b3', name: 'Sapiens', description: 'A brief history of humankind by Yuval Noah Harari.', price: 22, images: ['https://images.unsplash.com/photo-1589998059171-988d887df646?w=600'], category: 'History', rating: 4.6, reviewCount: 6532, tags: ['history','anthropology'], inStock: true, industry: 'books' },
  { id: 'b4', name: 'Project Hail Mary', description: 'Andy Weir\'s thrilling sci-fi adventure of survival and friendship.', price: 21, images: ['https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?w=600'], category: 'Sci-Fi', rating: 4.8, reviewCount: 9234, tags: ['scifi','space'], inStock: true, industry: 'books', featured: true },
  { id: 'b5', name: 'The Pragmatic Programmer', description: 'Your journey to mastery, 20th anniversary edition.', price: 38, images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'], category: 'Tech', rating: 4.8, reviewCount: 3211, tags: ['programming','career'], inStock: true, industry: 'books' },
  { id: 'b6', name: 'Where the Crawdads Sing', description: 'Delia Owens\' bestselling murder mystery and coming-of-age tale.', price: 18, images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'], category: 'Fiction', rating: 4.7, reviewCount: 15321, tags: ['mystery','fiction'], inStock: true, industry: 'books', featured: true },
  { id: 'b7', name: 'Dune', description: 'Frank Herbert\'s legendary epic of politics, religion, and ecology on Arrakis.', price: 16, images: ['https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=600'], category: 'Sci-Fi', rating: 4.8, reviewCount: 21043, tags: ['classic','scifi'], inStock: true, industry: 'books' },
  { id: 'b8', name: 'Thinking, Fast and Slow', description: 'Daniel Kahneman on the two systems that drive the way we think.', price: 26, images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600'], category: 'Psychology', rating: 4.6, reviewCount: 5621, tags: ['psychology','cognition'], inStock: true, industry: 'books' },
];

export const booksCategories: Category[] = [
  { id: 'bc1', name: 'Fiction', slug: 'fiction', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', industry: 'books' },
  { id: 'bc2', name: 'Self-Help', slug: 'self-help', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', industry: 'books' },
  { id: 'bc3', name: 'History', slug: 'history', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400', industry: 'books' },
  { id: 'bc4', name: 'Sci-Fi', slug: 'sci-fi', image: 'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?w=400', industry: 'books' },
  { id: 'bc5', name: 'Tech', slug: 'tech', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', industry: 'books' },
  { id: 'bc6', name: 'Psychology', slug: 'psychology', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', industry: 'books' },
];

export const booksReviews: Review[] = [
  { id: 'br1', productId: 'b2', author: 'Ana C.', rating: 5, comment: 'Changed how I structure my mornings. A must-read.', date: '2024-03-12' },
  { id: 'br2', productId: 'b4', author: 'Tom S.', rating: 5, comment: 'Couldn\'t put it down. Hard sci-fi at its best.', date: '2024-02-19' },
];
