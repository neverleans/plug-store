import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';

const WishlistPage = () => {
  const { items } = useWishlist();
  const { theme } = useTheme();
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-20">
        <Heart className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <h1 className="mb-2 text-2xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.yourWishlistEmpty}</h1>
        <p className="mb-6 text-muted-foreground">{t.saveItemsForLater}</p>
        <Link to="/products"><Button>{t.exploreProducts}</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.wishlist} ({items.length})</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
};

export default WishlistPage;
