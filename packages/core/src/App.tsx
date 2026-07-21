import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, matchPath } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ColorModeProvider } from "@/contexts/ColorModeContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { AccountProvider } from "@/contexts/AccountContext";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import HeroImagePreloader from "@/components/common/HeroImagePreloader";
import CompareBar from "@/components/common/CompareBar";
import AnalyticsInjector from "@/components/common/AnalyticsInjector";
import FaviconInjector from "@/components/common/FaviconInjector";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ComparePage from "./pages/ComparePage";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import PublicCatalogPage from "./pages/PublicCatalogPage";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
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
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/c/:slug" element={<PublicCatalogPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const isPublicRoute = (pathname: string) => !!matchPath('/c/:slug', pathname);
const isAdminRoute = (pathname: string) => pathname.startsWith('/admin');

const Chrome = () => {
  const { pathname } = useLocation();
  const { config } = useSiteConfig();
  const publicMode = isPublicRoute(pathname);
  // "Preview as customer" hides admin chrome on non-admin routes.
  const previewMode = config.previewAsCustomer && !isAdminRoute(pathname);
  const hideChrome = publicMode;
  return (
    <div className="flex min-h-screen flex-col">
      <AnalyticsInjector />
      <FaviconInjector />
      {!hideChrome && <Header />}
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      {!hideChrome && <Footer />}
      {!hideChrome && !previewMode && <ThemeSwitcher />}
      <HeroImagePreloader />
      {!hideChrome && !previewMode && <CompareBar />}
    </div>
  );
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <LanguageProvider>
        <ColorModeProvider>
          <SiteConfigProvider>
          <ThemeProvider>
            <CartProvider>
              <AuthProvider>
                <AccountProvider>
                  <WishlistProvider>
                    <CompareProvider>
                      <RecentlyViewedProvider>
                        <TooltipProvider>
                          <Toaster />
                          <Sonner />
                          <BrowserRouter>
                            <Chrome />
                          </BrowserRouter>
                        </TooltipProvider>
                      </RecentlyViewedProvider>
                    </CompareProvider>
                  </WishlistProvider>
                </AccountProvider>
              </AuthProvider>
            </CartProvider>
          </ThemeProvider>
          </SiteConfigProvider>
        </ColorModeProvider>
      </LanguageProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
