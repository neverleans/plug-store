// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  IndustryTemplate,
  ThemeConfig,
  Product,
  ProductVariant,
  Review,
  Category,
  CartItem,
  User,
  ShippingInfo,
  Order,
} from './types';

// ─── Core Providers ──────────────────────────────────────────────────────────
export { CatalogProvider } from './CatalogProvider';
export type { CatalogConfig, CatalogProviderProps } from './CatalogProvider';

// ─── Full App Shell ───────────────────────────────────────────────────────────
export { CatalogApp } from './CatalogApp';
export type { CatalogAppProps } from './CatalogApp';

// ─── Individual Contexts & Hooks ─────────────────────────────────────────────
export { ThemeProvider, useTheme } from './contexts/ThemeContext';
export { CartProvider, useCart } from './contexts/CartContext';
export { WishlistProvider, useWishlist } from './contexts/WishlistContext';
export { CompareProvider, useCompare } from './contexts/CompareContext';
export { RecentlyViewedProvider, useRecentlyViewed } from './contexts/RecentlyViewedContext';
export { AuthProvider, useAuth } from './contexts/AuthContext';
export { AccountProvider, useAccount } from './contexts/AccountContext';
export type { MockOrder } from './contexts/AccountContext';
export { SiteConfigProvider, useSiteConfig } from './contexts/SiteConfigContext';
export type { SiteConfig, CurrencyCode, Coupon } from './contexts/SiteConfigContext';
export { DEFAULT_COUPONS } from './contexts/SiteConfigContext';
export { LanguageProvider, useLanguage } from './contexts/LanguageContext';
export { ColorModeProvider, useColorMode } from './contexts/ColorModeContext';

// ─── Layout Components ────────────────────────────────────────────────────────
export { default as Header } from './components/layout/Header';
export { default as Footer } from './components/layout/Footer';

// ─── Product Components ───────────────────────────────────────────────────────
export { default as ProductCard } from './components/product/ProductCard';
export { default as ProductCardSkeleton } from './components/product/ProductCardSkeleton';
export { default as QuickViewDialog } from './components/product/QuickViewDialog';
export { default as RecentlyViewedRow } from './components/product/RecentlyViewedRow';

// ─── Cart Components ──────────────────────────────────────────────────────────
export { default as MiniCart } from './components/cart/MiniCart';

// ─── Common Components ────────────────────────────────────────────────────────
export { default as SEOHead } from './components/common/SEOHead';
export { default as ThemeSwitcher } from './components/common/ThemeSwitcher';
export { default as CompareBar } from './components/common/CompareBar';
export { default as DarkModeToggle } from './components/common/DarkModeToggle';
export { default as WhatsAppOrderButton } from './components/common/WhatsAppOrderButton';
export { default as PageTransition } from './components/common/PageTransition';
export { default as AnalyticsInjector } from './components/common/AnalyticsInjector';
export { default as FaviconInjector } from './components/common/FaviconInjector';

// ─── Pages ────────────────────────────────────────────────────────────────────
export { default as HomePage } from './pages/HomePage';
export { default as ProductsPage } from './pages/ProductsPage';
export { default as ProductDetailPage } from './pages/ProductDetailPage';
export { default as CartPage } from './pages/CartPage';
export { default as WishlistPage } from './pages/WishlistPage';
export { default as CheckoutPage } from './pages/CheckoutPage';
export { default as OrderConfirmationPage } from './pages/OrderConfirmationPage';
export { default as LoginPage } from './pages/LoginPage';
export { default as SignupPage } from './pages/SignupPage';
export { default as AboutPage } from './pages/AboutPage';
export { default as ContactPage } from './pages/ContactPage';
export { default as ComparePage } from './pages/ComparePage';
export { default as AccountPage } from './pages/AccountPage';
export { default as AdminPage } from './pages/AdminPage';
export { default as PublicCatalogPage } from './pages/PublicCatalogPage';
export { default as NotFound } from './pages/NotFound';

// ─── Utilities ────────────────────────────────────────────────────────────────
export { panelClasses } from './lib/cardStyle';
export { productsToCsv, parseProductsCsv, downloadProductsCsv, openCatalogPrintable } from './lib/exportCatalog';
export { formatMoney, CURRENCIES, useMoney } from './lib/currency';
export { safeImage, safeCategoryImage } from './lib/productImage';
export { isLowStock } from './lib/stock';

// ─── Data Access ─────────────────────────────────────────────────────────────
export {
  getProducts,
  getCategories,
  getReviews,
  getFeaturedProducts,
  getProductById,
  getProductsByCategory,
  getReviewsByProduct,
  searchProducts,
  setImportedProducts,
  getImportedProducts,
  clearImportedProducts,
} from './data';

// ─── i18n ─────────────────────────────────────────────────────────────────────
export { localizeCategory, localizeTagline, localizeTemplate, templateLabels } from './i18n/dynamic';
export type { Language, Translations } from './i18n';
