import { useMemo, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
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
          Buy
        </div>
      </div>
    </div>
  );
}

function Gallery() {
  const [query, setQuery] = useState('');
  const demoBase = useBaseUrl('/demo/');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return themeConfigs;
    return themeConfigs.filter(
      (theme) =>
        theme.id.toLowerCase().includes(q) ||
        theme.name.toLowerCase().includes(q) ||
        theme.tagline.toLowerCase().includes(q) ||
        theme.heroStyle.toLowerCase().includes(q) ||
        theme.cardStyle.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div>
      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.search}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by name, id, hero style or card style…"
          aria-label="Filter themes"
        />
        <span className={styles.count}>
          {filtered.length} of {themeConfigs.length}
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
            title={`Open ${theme.name} as a full storefront`}
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

      {filtered.length === 0 && <p className={styles.empty}>No theme matches “{query}”.</p>}
    </div>
  );
}

/**
 * The gallery reads the theme registry from the published package, which is
 * browser-oriented — rendering it during the static build would pull that code
 * into Node for no benefit, since the page is interactive anyway.
 */
export default function ThemeGallery() {
  return <BrowserOnly fallback={<p>Loading themes…</p>}>{() => <Gallery />}</BrowserOnly>;
}
