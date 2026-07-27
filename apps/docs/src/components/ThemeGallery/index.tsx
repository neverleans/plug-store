import { useMemo, useState } from 'react';
import { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { themeConfigs } from '@neverleans-labs/plug-store-themes';
import type { ThemeConfig } from '@neverleans-labs/plug-store-core';
import styles from './styles.module.css';

const hsl = (channels: string) => `hsl(${channels})`;

/**
 * A miniature storefront painted with the theme's own tokens, so the card shows
 * the design rather than describing it. Deliberately the same idea as the demo
 * app's preview — a reader comparing the two should see the same thing.
 */
function Preview({ theme }: { theme: ThemeConfig }) {
  const c = theme.colors;

  return (
    <div
      className={styles.preview}
      style={{ backgroundColor: hsl(c.background), fontFamily: theme.fonts.body }}
    >
      <div
        className={styles.previewHero}
        style={{
          backgroundImage: `linear-gradient(135deg, ${hsl(c.heroGradientFrom)}, ${hsl(c.heroGradientTo)})`,
        }}
      >
        <span
          className={styles.previewBrand}
          style={{ color: hsl(c.primaryForeground), fontFamily: theme.fonts.heading }}
        >
          {theme.name}
        </span>
        <span className={styles.previewTagline} style={{ color: hsl(c.primaryForeground) }}>
          {theme.tagline}
        </span>
      </div>

      <div className={styles.previewBody}>
        {[0, 1].map((i) => (
          <div
            key={i}
            className={styles.previewCard}
            style={{ backgroundColor: hsl(c.card), border: `1px solid ${hsl(c.border)}` }}
          >
            <div className={styles.previewImage} style={{ backgroundColor: hsl(c.muted) }} />
            <div
              className={styles.previewLine}
              style={{ backgroundColor: hsl(c.mutedForeground), opacity: 0.45 }}
            />
          </div>
        ))}
        <div
          className={styles.previewButton}
          style={{ backgroundColor: hsl(c.primary), color: hsl(c.primaryForeground) }}
        >
          {translate({ id: 'gallery.preview.buy', message: 'Buy' })}
        </div>
      </div>
    </div>
  );
}

/**
 * Reads the theme registry straight from the published package.
 *
 * Deliberately not wrapped in <BrowserOnly>: the registry is plain data that
 * imports fine under Node, and rendering all 50 previews server-side is the
 * whole value of this page. Behind BrowserOnly the served HTML said "Loading
 * themes…" and nothing else — the strongest proof the project has, absent from
 * the document that anything without JS actually reads.
 */
export default function ThemeGallery() {
  const [query, setQuery] = useState('');
  const demoBase = useBaseUrl('/demo/');

  // themeConfigs is a Record keyed by theme id, not an array.
  const allThemes = useMemo(() => Object.values(themeConfigs), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allThemes;
    return allThemes.filter(
      (theme) =>
        theme.id.toLowerCase().includes(q) ||
        theme.name.toLowerCase().includes(q) ||
        theme.tagline.toLowerCase().includes(q) ||
        theme.heroStyle.toLowerCase().includes(q) ||
        theme.cardStyle.toLowerCase().includes(q),
    );
  }, [allThemes, query]);

  return (
    <div>
      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.search}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={translate({ id: 'gallery.filter', message: 'Filter by name, id, hero style or card style…' })}
          aria-label={translate({ id: 'gallery.filterAria', message: 'Filter themes' })}
        />
        <span className={styles.count}>
          {translate({ id: 'gallery.count', message: '{shown} of {total}' }, { shown: filtered.length, total: allThemes.length })}
        </span>
      </div>

      <div className="ps-grid">
        {filtered.map((theme) => (
          <a
            key={theme.id}
            className={`ps-card ${styles.card}`}
            href={`${demoBase}?theme=${theme.id}`}
            target="_blank"
            rel="noreferrer"
            title={translate(
              { id: 'gallery.card.title', message: 'Open {name} as a full storefront' },
              { name: theme.name },
            )}
          >
            <Preview theme={theme} />
            <div className={styles.meta}>
              <code className={styles.id}>{theme.id}</code>
              <span className={styles.styles}>
                {theme.heroStyle} · {theme.cardStyle}
              </span>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && <p className={styles.empty}>{translate({ id: 'gallery.empty', message: 'No theme matches “{query}”.' }, { query })}</p>}
    </div>
  );
}

