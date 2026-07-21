import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '@/contexts/RecentlyViewedContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { safeImage, onImgError } from '@/lib/productImage';

interface Props {
  excludeId?: string;
}

const RecentlyViewedRow = ({ excludeId }: Props) => {
  const { items } = useRecentlyViewed();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const list = items.filter((p) => p.id !== excludeId).slice(0, 8);
  if (list.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold" style={{ fontFamily: theme.fonts.heading }}>
        {t.recentlyViewed}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {list.map((p) => (
          <Link key={p.id} to={`/products/${p.id}`} className="group block">
            <div className="aspect-square overflow-hidden rounded-md bg-muted">
              <img src={safeImage(p.images[0])} onError={onImgError} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            </div>
            <p className="mt-2 line-clamp-1 text-xs font-medium">{p.name}</p>
            <p className="text-xs text-muted-foreground">${p.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewedRow;
