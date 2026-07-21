import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Minus, Plus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { safeImage, onImgError } from '@/lib/productImage';
import { localizeCategory } from '@/i18n/dynamic';

interface Props {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickViewDialog = ({ product, open, onOpenChange }: Props) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [variants, setVariants] = useState<Record<string, string>>({});
  const wishlisted = isInWishlist(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const handleAdd = () => {
    addItem(product, qty, variants);
    toast.success(t.addedToCart, { description: product.name });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden p-0">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid gap-0 md:grid-cols-2">
          <div className="relative bg-muted">
            <div className="aspect-square overflow-hidden">
              <img src={safeImage(product.images[imgIdx])} onError={onImgError} alt={product.name} className="h-full w-full object-cover" />
            </div>
            {discount > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">-{discount}%</span>
            )}
            {product.images.length > 1 && (
              <div className="flex gap-2 p-3">
                {product.images.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`h-14 w-14 overflow-hidden rounded-md border-2 ${i === imgIdx ? 'border-primary' : 'border-transparent'}`}
                    aria-label={`Image ${i + 1}`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{localizeCategory(product.category, language)}</p>
            <h2 className="text-2xl font-bold leading-tight" style={{ fontFamily: theme.fonts.heading }}>{product.name}</h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted'}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{product.rating} ({product.reviewCount})</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>}
            </div>
            <p className="line-clamp-3 text-sm text-muted-foreground">{product.description}</p>

            {product.variants?.slice(0, 2).map((v) => (
              <div key={v.id}>
                <p className="mb-1 text-xs font-medium">{v.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {v.options.map((o) => (
                    <button
                      key={o}
                      onClick={() => setVariants((p) => ({ ...p, [v.name]: o }))}
                      className={`rounded-md border px-3 py-1 text-xs transition ${variants[v.name] === o ? 'border-primary bg-primary text-primary-foreground' : 'hover:border-primary'}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-2 flex items-center gap-3">
              <div className="inline-flex items-center rounded-md border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-2 py-1.5 hover:bg-muted" aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                <span className="min-w-[2.5rem] text-center text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-2 py-1.5 hover:bg-muted" aria-label="Increase"><Plus className="h-3 w-3" /></button>
              </div>
              <Button onClick={handleAdd} disabled={!product.inStock} className="flex-1 gap-2">
                <ShoppingCart className="h-4 w-4" /> {t.addToCart}
              </Button>
              <Button variant="outline" size="icon" onClick={() => toggleItem(product)} aria-label="Wishlist">
                <Heart className={`h-4 w-4 ${wishlisted ? 'fill-primary text-primary' : ''}`} />
              </Button>
            </div>

            <Link to={`/products/${product.id}`} onClick={() => onOpenChange(false)} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              {t.viewAll} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewDialog;
