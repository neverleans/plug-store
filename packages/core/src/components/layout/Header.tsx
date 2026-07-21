import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X, LogOut, Globe, LayoutDashboard } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategories, searchProducts } from '@/data';
import { Button } from '@/components/ui/button';
import MiniCart from '@/components/cart/MiniCart';
import DarkModeToggle from '@/components/common/DarkModeToggle';
import { localizeCategory } from '@/i18n/dynamic';

const Header = () => {
  const { theme, template } = useTheme();
  const { config } = useSiteConfig();
  const brandName = config.companyName || theme.name;
  const shippingBanner = config.shippingBanner;
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const categories = getCategories(template);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const results = searchProducts(template, searchQuery.trim());
      setSuggestions(results.slice(0, 5).map(p => p.name));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, template]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setSuggestions([]);
    }
  };

  const selectSuggestion = (name: string) => {
    navigate(`/products?search=${encodeURIComponent(name)}`);
    setSearchOpen(false);
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-primary px-4 py-1.5 text-center text-xs font-medium text-primary-foreground">
        {shippingBanner || t.freeShippingBanner}
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight" style={{ fontFamily: theme.fonts.heading }}>
          {config.logoDataUrl && <img src={config.logoDataUrl} alt="" className="h-8 w-8 rounded object-contain" />}
          <span>{brandName}</span>
        </Link>


        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">{t.home}</Link>
          <Link to="/products" className="text-sm font-medium transition-colors hover:text-primary">{t.allProducts}</Link>
          {categories.slice(0, 4).map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.slug}`} className="text-sm font-medium transition-colors hover:text-primary">
              {localizeCategory(cat.name, language)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
            aria-label={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
            className="flex items-center gap-1 rounded-md p-2 text-xs font-medium transition-colors hover:text-primary"
            title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{language === 'pt' ? 'EN' : 'PT'}</span>
          </button>

          <DarkModeToggle />

          <button onClick={() => setSearchOpen(!searchOpen)} aria-label={t.search} className="p-2 transition-colors hover:text-primary">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/wishlist" aria-label={t.wishlist} className="relative p-2 transition-colors hover:text-primary">
            <Heart className="h-5 w-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <MiniCart
            trigger={
              <button aria-label={t.shoppingCart} className="relative p-2 transition-colors hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </button>
            }
          />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/account" className="hidden text-sm hover:text-primary md:inline">{user?.name}</Link>
              <button onClick={logout} aria-label="Logout" className="p-2 transition-colors hover:text-primary">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="gap-1">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{t.signIn}</span>
              </Button>
            </Link>
          )}

          <Link to="/admin" aria-label={t.admin} title={t.admin} className="hidden p-2 transition-colors hover:text-primary md:inline-flex">
            <LayoutDashboard className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t bg-background px-4 py-3">
          <div className="container relative mx-auto">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchProducts}
                className="flex-1 rounded-md border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <Button type="submit" size="sm">{t.search}</Button>
            </form>
            {suggestions.length > 0 && (
              <div ref={suggestionsRef} className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border bg-card shadow-lg">
                {suggestions.map((name, i) => (
                  <button
                    key={i}
                    onClick={() => selectSuggestion(name)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">{t.home}</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">{t.allProducts}</Link>
            {categories.map(cat => (
              <Link key={cat.id} to={`/products?category=${cat.slug}`} onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                {localizeCategory(cat.name, language)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
