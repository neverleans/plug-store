import React from 'react';
import { BrowserRouter, Route, Routes, useLocation, matchPath } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { CatalogProvider, CatalogConfig } from './CatalogProvider';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ThemeSwitcher from './components/common/ThemeSwitcher';
import HeroImagePreloader from './components/common/HeroImagePreloader';
import CompareBar from './components/common/CompareBar';
import AnalyticsInjector from './components/common/AnalyticsInjector';
import FaviconInjector from './components/common/FaviconInjector';
import { useSiteConfig } from './contexts/SiteConfigContext';
import { IndustryTemplate } from './types';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ComparePage from './pages/ComparePage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';
import PublicCatalogPage from './pages/PublicCatalogPage';
import NotFound from './pages/NotFound';

export interface CatalogAppProps {
  /** Initial industry theme template */
  defaultTheme?: IndustryTemplate;
  /** Store configuration */
  config?: CatalogConfig;
  /** Custom logo URL or base64 */
  logoUrl?: string;
  /** Disable admin route /admin if desired */
  disableAdmin?: boolean;
}

const AnimatedRoutes = ({ disableAdmin }: { disableAdmin?: boolean }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/account" element={<AccountPage />} />
        {!disableAdmin && <Route path="/admin" element={<AdminPage />} />}
        <Route path="/c/:slug" element={<PublicCatalogPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const isPublicRoute = (pathname: string) => !!matchPath('/c/:slug', pathname);
const isAdminRoute = (pathname: string) => pathname.startsWith('/admin');

const Shell = ({ disableAdmin }: { disableAdmin?: boolean }) => {
  const { pathname } = useLocation();
  const { config } = useSiteConfig();
  const publicMode = isPublicRoute(pathname);
  const previewMode = config.previewAsCustomer && !isAdminRoute(pathname);
  const hideChrome = publicMode;

  return (
    <div className="flex min-h-screen flex-col">
      <AnalyticsInjector />
      <FaviconInjector />
      {!hideChrome && <Header />}
      <main className="flex-1">
        <AnimatedRoutes disableAdmin={disableAdmin} />
      </main>
      {!hideChrome && <Footer />}
      {!hideChrome && !previewMode && <ThemeSwitcher />}
      <HeroImagePreloader />
      {!hideChrome && !previewMode && <CompareBar />}
    </div>
  );
};

/**
 * CatalogApp
 * 
 * Complete out-of-the-box Catalog & E-Commerce Web Application.
 * Includes all routes, header/footer, admin panel, theme switcher, and UI interactions.
 */
export const CatalogApp: React.FC<CatalogAppProps> = ({
  defaultTheme = 'fashion',
  config,
  disableAdmin = false,
}) => {
  return (
    <CatalogProvider defaultTheme={defaultTheme} config={config}>
      <BrowserRouter>
        <Shell disableAdmin={disableAdmin} />
      </BrowserRouter>
    </CatalogProvider>
  );
};
