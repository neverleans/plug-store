import { Product, Category, Review, IndustryTemplate } from '../types/index.ts';
import { fashionProducts, fashionCategories, fashionReviews } from './fashion.ts';
import { electronicsProducts, electronicsCategories, electronicsReviews } from './electronics.ts';
import { foodProducts, foodCategories, foodReviews } from './food.ts';
import { furnitureProducts, furnitureCategories, furnitureReviews } from './furniture.ts';
import { beautyProducts, beautyCategories, beautyReviews } from './beauty.ts';
import { sportsProducts, sportsCategories, sportsReviews } from './sports.ts';
import { booksProducts, booksCategories, booksReviews } from './books.ts';
import { petsProducts, petsCategories, petsReviews } from './pets.ts';
import { automotiveProducts, automotiveCategories, automotiveReviews } from './automotive.ts';
import { artProducts, artCategories, artReviews } from './art.ts';
import { jewelryProducts, jewelryCategories, jewelryReviews } from './jewelry.ts';
import { homewareProducts, homewareCategories, homewareReviews } from './homeware.ts';
import { marketProducts, marketCategories, marketReviews } from './market.ts';
import { wellnessProducts, wellnessCategories, wellnessReviews } from './wellness.ts';
import { stationeryProducts, stationeryCategories, stationeryReviews } from './stationery.ts';

const allProducts: Record<IndustryTemplate, Product[]> = {
  fashion: fashionProducts,
  electronics: electronicsProducts,
  food: foodProducts,
  furniture: furnitureProducts,
  beauty: beautyProducts,
  sports: sportsProducts,
  books: booksProducts,
  pets: petsProducts,
  automotive: automotiveProducts,
  art: artProducts,
  jewelry: jewelryProducts,
  homeware: homewareProducts,
  market: marketProducts,
  wellness: wellnessProducts,
  stationery: stationeryProducts,
};

const allCategories: Record<IndustryTemplate, Category[]> = {
  fashion: fashionCategories,
  electronics: electronicsCategories,
  food: foodCategories,
  furniture: furnitureCategories,
  beauty: beautyCategories,
  sports: sportsCategories,
  books: booksCategories,
  pets: petsCategories,
  automotive: automotiveCategories,
  art: artCategories,
  jewelry: jewelryCategories,
  homeware: homewareCategories,
  market: marketCategories,
  wellness: wellnessCategories,
  stationery: stationeryCategories,
};

const allReviews: Record<IndustryTemplate, Review[]> = {
  fashion: fashionReviews,
  electronics: electronicsReviews,
  food: foodReviews,
  furniture: furnitureReviews,
  beauty: beautyReviews,
  sports: sportsReviews,
  books: booksReviews,
  pets: petsReviews,
  automotive: automotiveReviews,
  art: artReviews,
  jewelry: jewelryReviews,
  homeware: homewareReviews,
  market: marketReviews,
  wellness: wellnessReviews,
  stationery: stationeryReviews,
};

/**
 * Fifty themes ship, but fifteen bespoke catalogs do. Each remaining niche borrows the
 * closest existing catalog so its storefront is at least coherent — a bakery showing
 * food rather than the evening gowns it fell back to before. Authoring dedicated
 * catalogs for these is tracked as follow-up work.
 */
const CATALOG_FALLBACKS: Partial<Record<IndustryTemplate, IndustryTemplate>> = {
  // Bebidas & gastronomia
  winery: 'food',
  brewery: 'food',
  coffee: 'food',
  bakery: 'food',
  chocolates: 'food',
  spices: 'market',
  flowers: 'market',
  // Tecnologia & entretenimento
  gaming: 'electronics',
  geek: 'electronics',
  music: 'electronics',
  security: 'electronics',
  // Lazer & hobbies
  boardgames: 'books',
  toys: 'books',
  // Esporte & aventura
  cycling: 'sports',
  outdoors: 'sports',
  fishing: 'sports',
  fitness: 'sports',
  combat: 'sports',
  // Casa, obra & jardim
  lighting: 'homeware',
  gardening: 'homeware',
  party: 'homeware',
  hardware: 'automotive',
  office: 'stationery',
  // Veículos
  motorcycles: 'automotive',
  // Saúde & cuidados
  dental: 'wellness',
  medical: 'wellness',
  pharmacy: 'wellness',
  perfume: 'beauty',
  // Moda & acessórios
  optics: 'fashion',
  leather: 'fashion',
  baby: 'fashion',
  watchmakers: 'jewelry',
  // Arte & curadoria
  handcrafted: 'art',
  spiritual: 'art',
  vintage: 'art',
};

/** Resolve a theme to the catalog that backs it. */
const catalogFor = (industry: IndustryTemplate): IndustryTemplate =>
  allProducts[industry] ? industry : CATALOG_FALLBACKS[industry] || 'fashion';

const IMPORTED_KEY = 'ecom-imported-products';

const getImported = (industry: IndustryTemplate): Product[] => {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(IMPORTED_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<Record<IndustryTemplate, Product[]>>;
    return parsed[industry] || [];
  } catch {
    return [];
  }
};

export const setImportedProducts = (industry: IndustryTemplate, products: Product[]) => {
  try {
    const raw = localStorage.getItem(IMPORTED_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[industry] = products;
    localStorage.setItem(IMPORTED_KEY, JSON.stringify(parsed));
  } catch {}
};

export const getImportedProducts = getImported;
export const clearImportedProducts = (industry: IndustryTemplate) => setImportedProducts(industry, []);

export const getProducts = (industry: IndustryTemplate) => [...getImported(industry), ...allProducts[catalogFor(industry)]];
export const getCategories = (industry: IndustryTemplate) => allCategories[catalogFor(industry)];
export const getReviews = (industry: IndustryTemplate) => allReviews[catalogFor(industry)];
export const getFeaturedProducts = (industry: IndustryTemplate) => getProducts(industry).filter(p => p.featured);
export const getProductById = (industry: IndustryTemplate, id: string) => getProducts(industry).find(p => p.id === id);
export const getProductsByCategory = (industry: IndustryTemplate, category: string) => getProducts(industry).filter(p => p.category === category);
export const getReviewsByProduct = (industry: IndustryTemplate, productId: string) => allReviews[catalogFor(industry)].filter(r => r.productId === productId);
export const searchProducts = (industry: IndustryTemplate, query: string) => {
  const q = query.toLowerCase();
  return getProducts(industry).filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
};

