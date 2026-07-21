import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye, GitCompare, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCompare } from '@/contexts/CompareContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import QuickViewDialog from './QuickViewDialog';
import { safeImage, onImgError } from '@/lib/productImage';
import { localizeCategory } from '@/i18n/dynamic';
import { useMoney } from '@/lib/currency';
import { getStock, isLowStock } from '@/lib/stock';


interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { theme } = useTheme();
  const { toggle: toggleCompare, has: inCompare, isFull } = useCompare();
  const { t, language } = useLanguage();
  const money = useMoney();
  const wishlisted = isInWishlist(product.id);
  const compared = inCompare(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const [imgLoaded, setImgLoaded] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const hasSecondImage = product.images.length > 1;
  const stock = getStock(product);
  const low = isLowStock(product);


  const cardClasses = (() => {
    switch (theme.cardStyle) {
      case 'elevated':
        return 'rounded-xl bg-card shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1';
      case 'bordered':
        return 'rounded-lg border-2 border-border bg-card transition-colors hover:border-primary';
      case 'minimal':
        return 'group bg-transparent';
      case 'rounded':
        return 'rounded-2xl bg-card shadow-md overflow-hidden transition-shadow hover:shadow-lg';
      case 'tilted':
        return 'rounded-md bg-card border-2 border-foreground shadow-[6px_6px_0_0_hsl(var(--primary))] transition-transform duration-200 hover:-translate-y-1 hover:-rotate-1 hover:shadow-[8px_8px_0_0_hsl(var(--primary))]';
      case 'paper':
        return 'rounded-sm bg-card border border-border shadow-sm transition-shadow hover:shadow-md relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary';
      case 'soft':
        return 'rounded-3xl bg-card shadow-[0_8px_30px_-10px_hsl(var(--primary)/0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_-10px_hsl(var(--primary)/0.5)]';
      case 'metal':
        return 'rounded-none bg-card border border-border shadow-[inset_0_1px_0_hsl(var(--accent)/0.2)] transition-all duration-200 hover:border-primary hover:shadow-[inset_0_1px_0_hsl(var(--accent)/0.4),0_0_20px_hsl(var(--primary)/0.3)]';
      case 'frame':
        return 'bg-card p-3 border-[6px] border-foreground/90 shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:scale-[1.02]';
      default:
        return 'rounded-none bg-card border transition-all duration-300 hover:-translate-y-1';
    }
  })();

  const imageClasses = (() => {
    switch (theme.cardStyle) {
      case 'elevated': return 'rounded-t-xl';
      case 'rounded': return 'rounded-t-2xl';
      case 'soft': return 'rounded-t-3xl';
      case 'minimal': return 'rounded-lg';
      case 'frame': return '';
      default: return '';
    }
  })();

  const handleAdd = () => {
    addItem(product);
    toast.success(t.addedToCart, { description: product.name });
  };

  const handleWishlist = () => {
    const wasIn = wishlisted;
    toggleItem(product);
    toast(wasIn ? t.removedFromWishlist : t.addedToWishlist, { description: product.name });
  };

  const handleCompare = () => {
    if (!compared && isFull) {
      toast.error(t.compareFull);
      return;
    }
    const added = toggleCompare(product);
    toast(added ? t.addedToCompare : t.removedFromCompare, { description: product.name });
  };

  return (
    <>
      <div className={`group relative ${cardClasses}`}>
        <div className={`relative aspect-square overflow-hidden ${imageClasses}`}>
          <Link to={`/products/${product.id}`} aria-label={product.name}>
            {!imgLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
            <img
              src={safeImage(product.images[0])}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              onError={onImgError}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'} ${hasSecondImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
              loading="lazy"
            />
            {hasSecondImage && (
              <img
                src={safeImage(product.images[1])}
                alt=""
                aria-hidden="true"
                onError={onImgError}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                loading="lazy"
              />
            )}
          </Link>

          {discount > 0 && (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
              -{discount}%
            </span>
          )}
          {!product.inStock ? (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-foreground/80 px-2 py-0.5 text-[10px] font-semibold uppercase text-background">
              {t.outOfStock}
            </span>
          ) : low ? (
            <span className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-orange-500/95 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow">
              <Flame className="h-2.5 w-2.5" /> {language === 'pt' ? `Só ${stock}` : `Only ${stock} left`}
            </span>
          ) : null}


          {/* Top-right action stack */}
          <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5">
            <button
              onClick={handleWishlist}
              aria-label={wishlisted ? t.removedFromWishlist : t.addedToWishlist}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
            >
              <Heart className={`h-4 w-4 ${wishlisted ? 'fill-primary text-primary' : ''}`} />
            </button>
            <button
              onClick={handleCompare}
              aria-label={t.compare}
              className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all hover:bg-background ${compared ? 'bg-primary text-primary-foreground' : 'bg-background/80 opacity-0 group-hover:opacity-100'}`}
            >
              <GitCompare className="h-4 w-4" />
            </button>
          </div>

          {/* Quick view bar */}
          <button
            onClick={() => setQuickOpen(true)}
            aria-label={t.quickView}
            className="absolute bottom-0 left-0 right-0 z-10 flex translate-y-full items-center justify-center gap-2 bg-foreground/90 py-2 text-xs font-medium uppercase tracking-wider text-background opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 backdrop-blur-sm"
          >
            <Eye className="h-3.5 w-3.5" /> {t.quickView}
          </button>
        </div>

        <div className={`p-4 ${theme.cardStyle === 'minimal' ? 'px-0' : ''}`}>
          <p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">{localizeCategory(product.category, language)}</p>
          <Link to={`/products/${product.id}`}>
            <h3 className="mb-1 text-sm font-semibold leading-tight hover:text-primary transition-colors" style={{ fontFamily: theme.fonts.heading }}>{product.name}</h3>
          </Link>
          <div className="mb-2 flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs text-muted-foreground">{product.rating} ({product.reviewCount})</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold">{money(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">{money(product.originalPrice)}</span>
              )}
            </div>

            <button
              onClick={handleAdd}
              aria-label={t.addToCart}
              disabled={!product.inStock}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110 disabled:opacity-40 disabled:hover:scale-100"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <QuickViewDialog product={product} open={quickOpen} onOpenChange={setQuickOpen} />
    </>
  );
};

export default ProductCard;
