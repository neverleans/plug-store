import { useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Search, Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { getProducts, getCategories } from '@/data';
import ProductCard from '@/components/product/ProductCard';
import PageTransition from '@/components/common/PageTransition';
import SEOHead from '@/components/common/SEOHead';
import { localizeCategory, localizeTagline } from '@/i18n/dynamic';
import { Button } from '@/components/ui/button';

const PublicCatalogPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { theme, template } = useTheme();
  const { t, language } = useLanguage();
  const { config } = useSiteConfig();
  const isPt = language === 'pt';

  const expectedSlug = (config.publicSlug || 'catalog').toLowerCase();
  if (slug && slug.toLowerCase() !== expectedSlug) {
    return <Navigate to={`/c/${expectedSlug}`} replace />;
  }

  const brand = config.companyName || theme.name;
  const tagline = config.tagline || localizeTagline(template, theme.tagline, language);
  const products = getProducts(template);
  const categories = getCategories(template);

  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (activeCat !== 'all' && p.category !== activeCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [products, query, activeCat]);

  return (
    <PageTransition>
      <SEOHead
        title={`${brand} — ${isPt ? 'Catálogo' : 'Catalog'}`}
        description={tagline}
      />

      {/* Public hero — clean, brand-forward, no admin chrome */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {isPt ? 'Catálogo oficial' : 'Official catalog'}
          </p>
          <h1
            className="mb-4 text-4xl font-bold tracking-tight md:text-6xl"
            style={{ fontFamily: theme.fonts.heading }}
          >
            {brand}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            {tagline}
          </p>

          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isPt ? 'Buscar produtos...' : 'Search products...'}
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      </section>

      {/* Category chips */}
      <section className="border-b bg-card/40">
        <div className="container mx-auto flex flex-wrap gap-2 px-4 py-4">
          <button
            onClick={() => setActiveCat('all')}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
              activeCat === 'all'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            {isPt ? 'Todos' : 'All'} ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.slug).length;
            if (!count) return null;
            const active = activeCat === c.slug;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.slug)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {localizeCategory(c.name, language)} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 py-10">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold" style={{ fontFamily: theme.fonts.heading }}>
            {isPt ? 'Produtos' : 'Products'}
          </h2>
          <span className="text-xs text-muted-foreground">
            {filtered.length} {isPt ? 'itens' : 'items'}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
            {isPt ? 'Nenhum produto encontrado.' : 'No products found.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Contact strip */}
      {(config.contactEmail || config.contactPhone || config.address) && (
        <section className="border-t bg-card">
          <div className="container mx-auto grid gap-6 px-4 py-10 md:grid-cols-3">
            {config.contactEmail && (
              <a href={`mailto:${config.contactEmail}`} className="flex items-center gap-3 text-sm hover:text-primary">
                <Mail className="h-4 w-4 text-primary" />
                <span>{config.contactEmail}</span>
              </a>
            )}
            {config.contactPhone && (
              <a href={`tel:${config.contactPhone}`} className="flex items-center gap-3 text-sm hover:text-primary">
                <Phone className="h-4 w-4 text-primary" />
                <span>{config.contactPhone}</span>
              </a>
            )}
            {config.address && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{config.address}</span>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          {isPt ? '← Ir para a loja completa' : '← Go to full store'}
        </Link>
      </div>
    </PageTransition>
  );
};

export default PublicCatalogPage;
