import { Link } from 'react-router-dom';
import { Star, X, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useCompare } from '@/contexts/CompareContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/common/PageTransition';
import SEOHead from '@/components/common/SEOHead';
import { safeImage, onImgError } from '@/lib/productImage';

const ComparePage = () => {
  const { items, remove, clear } = useCompare();
  const { addItem } = useCart();
  const { theme } = useTheme();
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <PageTransition>
        <SEOHead title={`${t.comparison} — ${theme.name}`} description={t.noItemsToCompare} />
        <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-2 text-2xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.noItemsToCompare}</h1>
          <Link to="/products"><Button className="mt-4">{t.browseProducts}</Button></Link>
        </div>
      </PageTransition>
    );
  }

  // Build dynamic spec rows from product variants/tags
  const specRows: { label: string; value: (p: typeof items[0]) => string | number }[] = [
    { label: t.priceRange, value: (p) => `$${p.price.toFixed(2)}` },
    { label: t.minRating, value: (p) => `${p.rating} ★ (${p.reviewCount})` },
    { label: t.featured, value: (p) => (p.featured ? 'Yes' : '—') },
    { label: t.outOfStock, value: (p) => (p.inStock ? '—' : 'Yes') },
    { label: 'Tags', value: (p) => p.tags.slice(0, 4).join(', ') || '—' },
  ];

  return (
    <PageTransition>
      <SEOHead title={`${t.comparison} — ${theme.name}`} description="Compare products" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.comparison}</h1>
          <Button variant="outline" size="sm" onClick={clear}>{t.clearCart}</Button>
        </div>

        <div className="overflow-x-auto rounded-lg border bg-card">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="w-32 border-b p-3 text-left text-xs uppercase text-muted-foreground"></th>
                {items.map((p) => (
                  <th key={p.id} className="border-b p-3 align-top">
                    <div className="relative">
                      <button onClick={() => remove(p.id)} aria-label="Remove" className="absolute right-0 top-0 text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                      <Link to={`/products/${p.id}`} className="block">
                        <img src={safeImage(p.images[0])} onError={onImgError} alt={p.name} className="mb-2 aspect-square w-full rounded-md object-cover" />
                        <p className="line-clamp-2 text-sm font-medium hover:text-primary">{p.name}</p>
                      </Link>
                      <Button
                        size="sm"
                        className="mt-2 w-full gap-1"
                        onClick={() => { addItem(p); toast.success(t.addedToCart, { description: p.name }); }}
                      >
                        <ShoppingCart className="h-3 w-3" /> {t.addToCart}
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specRows.map((row) => (
                <tr key={row.label} className="border-b">
                  <td className="p-3 text-xs font-semibold uppercase text-muted-foreground">{row.label}</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-3 text-sm">{row.value(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageTransition>
  );
};

export default ComparePage;
