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

// ─── PWA & Offline Support ───────────────────────────────────────────────────
export { usePWA } from './hooks/usePWA';
export type { PWAInstallPromptEvent } from './hooks/usePWA';
export { default as PWAOfflineBanner } from './components/common/PWAOfflineBanner';

// ─── Payment Gateways & Checkout ──────────────────────────────────────────────
export type {
  PaymentMethod,
  CheckoutPayload,
  PaymentResult,
  PaymentGatewayAdapter,
} from './lib/checkoutTypes';
export {
  whatsappGateway,
  pixGateway,
  stripeGateway,
  mercadopagoGateway,
} from './lib/checkoutAdapters';
export type { PixGatewayOptions } from './lib/checkoutAdapters';
export { buildPixPayload, pixCrc16 } from './lib/pix';
export type { PixStaticParams } from './lib/pix';
export { useCheckout } from './hooks/useCheckout';
export type { UseCheckoutOptions } from './hooks/useCheckout';

// ─── Headless Data Providers ──────────────────────────────────────────────────
export type { CatalogDataProvider, DataProviderQueryParams } from './data/provider';
export { dummyDataProvider, restDataProvider, customDataProvider } from './data/adapters';
export { DataProviderWrapper, useCatalogData } from './contexts/DataContext';

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

// ─── Productivity Hooks ────────────────────────────────────────────────────────
export { useCatalogLink } from './hooks/useCatalogLink';
export { useCatalogAnalytics, trackEvent } from './hooks/useCatalogAnalytics';

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
export { default as CatalogSEO } from './components/common/CatalogSEO';
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

// ─── Themes ───────────────────────────────────────────────────────────────────
// The built-in theme registry lives here because the ThemeProvider consumes it.
// @neverleans/plug-store-themes re-exports this as the single source of truth.
export { themeConfigs } from './themes/configs';

// ─── i18n ─────────────────────────────────────────────────────────────────────
export { localizeCategory, localizeTagline, localizeTemplate, templateLabels } from './i18n/dynamic';
export type { Language, Translations } from './i18n';
