import { useMemo, useState } from 'react';
import type { ThemeConfig } from '@neverleans/plug-store-core';
import { themeConfigs } from '@neverleans/plug-store-themes';

const hsl = (channels: string) => `hsl(${channels})`;

const themeUrl = (id: string) => `${import.meta.env.BASE_URL}?theme=${id}`;

/**
 * A miniature storefront rendered with the theme's own colors and fonts, so the card
 * shows the actual design rather than a description of it.
 */
const ThemePreview = ({ theme }: { theme: ThemeConfig }) => {
  const c = theme.colors;

  return (
    <div
      className="flex h-44 flex-col overflow-hidden"
      style={{ backgroundColor: hsl(c.background), fontFamily: theme.fonts.body }}
    >
      <div
        className="flex flex-1 flex-col items-center justify-center px-3 text-center"
        style={{
          backgroundImage: `linear-gradient(135deg, ${hsl(c.heroGradientFrom)}, ${hsl(c.heroGradientTo)})`,
        }}
      >
        <span
          className="text-base font-semibold leading-tight tracking-wide"
          style={{ color: hsl(c.primaryForeground), fontFamily: theme.fonts.heading }}
        >
          {theme.name}
        </span>
        <span className="mt-1 text-[10px] opacity-80" style={{ color: hsl(c.primaryForeground) }}>
          {theme.tagline}
        </span>
      </div>

      <div className="flex items-end gap-2 p-2.5">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex-1 rounded p-1.5"
            style={{
              backgroundColor: hsl(c.card),
              border: `1px solid ${hsl(c.border)}`,
            }}
          >
            <div
              className="mb-1.5 h-6 w-full rounded-sm"
              style={{ backgroundColor: hsl(c.muted) }}
            />
            <div
              className="h-1.5 w-3/4 rounded-full"
              style={{ backgroundColor: hsl(c.mutedForeground), opacity: 0.45 }}
            />
          </div>
        ))}
        <div
          className="rounded px-2.5 py-1.5 text-[10px] font-semibold"
          style={{ backgroundColor: hsl(c.primary), color: hsl(c.primaryForeground) }}
        >
          Comprar
        </div>
      </div>
    </div>
  );
};

const ThemeCard = ({ id, theme }: { id: string; theme: ThemeConfig }) => (
  <a
    href={themeUrl(id)}
    className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
  >
    <ThemePreview theme={theme} />
    <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2.5 dark:border-slate-800">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
          {theme.name}
        </p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{id}</p>
      </div>
      <span className="shrink-0 text-xs font-medium text-indigo-600 opacity-0 transition group-hover:opacity-100 dark:text-indigo-400">
        Abrir →
      </span>
    </div>
  </a>
);

export default function ThemeGallery() {
  const [query, setQuery] = useState('');

  const entries = useMemo(() => Object.entries(themeConfigs), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      ([id, theme]) =>
        id.includes(q) ||
        theme.name.toLowerCase().includes(q) ||
        theme.tagline.toLowerCase().includes(q),
    );
  }, [entries, query]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
            PlugStore Framework
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl">
            {entries.length} temas. Uma linha de código.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            Cada tema abaixo abre como uma <strong>loja completa e navegável</strong> — carrinho,
            busca, wishlist, comparador e checkout por WhatsApp ou Pix. Não são capturas de tela.
          </p>

          <div className="mx-auto mt-8 max-w-md">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar tema — moda, padaria, pet, games…"
              aria-label="Buscar tema"
              className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <pre className="mx-auto mt-6 w-fit max-w-full overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 text-left text-xs text-slate-100 dark:bg-slate-800">
            <code>{'<CatalogApp defaultTheme="bakery" />'}</code>
          </pre>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-sm text-slate-500 dark:text-slate-400">
            Nenhum tema encontrado para “{query}”.
          </p>
        ) : (
          <>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
              {filtered.length === entries.length
                ? `Mostrando todos os ${entries.length} temas`
                : `${filtered.length} de ${entries.length} temas`}
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(([id, theme]) => (
                <ThemeCard key={id} id={id} theme={theme} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 px-4 py-10 text-center dark:border-slate-800">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Open source sob Apache-2.0 ·{' '}
          <a
            href="https://github.com/neverleans/plug-store"
            className="font-medium text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400"
          >
            GitHub
          </a>{' '}
          ·{' '}
          <a
            href="https://www.npmjs.com/package/@neverleans/plug-store-core"
            className="font-medium text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400"
          >
            npm
          </a>
        </p>
        <pre className="mx-auto mt-4 w-fit rounded-lg bg-slate-900 px-4 py-2.5 text-xs text-slate-100 dark:bg-slate-800">
          <code>npx create-plug-store minha-loja</code>
        </pre>
      </footer>
    </div>
  );
}
