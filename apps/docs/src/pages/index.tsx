import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './index.module.css';

type Feature = {
  icon: string;
  title: string;
  text: string;
  to: string;
};

const features: Feature[] = [
  {
    icon: '🇧🇷',
    title: translate({ id: 'home.feature.brazil.title', message: 'Built for Brazil' }),
    text: translate({
      id: 'home.feature.brazil.text',
      message:
        'Pix, WhatsApp and Mercado Pago are checkout adapters that ship in the box, not plugins you go find. The page also says plainly where that knowledge stops.',
    }),
    to: '/docs/brazil',
  },
  {
    icon: '🎨',
    title: translate({ id: 'home.feature.themes.title', message: '50 industry themes' }),
    text: translate({
      id: 'home.feature.themes.text',
      message:
        'Each theme brings its own palette, typography, hero layout and copy — not one template in fifty colors. Switch with a single prop.',
    }),
    to: '/docs/themes/gallery',
  },
  {
    icon: '💳',
    title: translate({ id: 'home.feature.pix.title', message: 'Pix that actually scans' }),
    text: translate({
      id: 'home.feature.pix.text',
      message:
        'Checkout emits a spec-compliant EMV/BCB BR Code with the mandated CRC-16, so a Brazilian banking app resolves it to your key. Not a placeholder string.',
    }),
    to: '/docs/guides/pix',
  },
  {
    icon: '🔌',
    title: translate({ id: 'home.feature.headless.title', message: 'Bring your own backend' }),
    text: translate({
      id: 'home.feature.headless.text',
      message:
        'Implement five functions and the whole storefront reads from your REST API, Supabase, Firebase or GraphQL layer instead of the bundled demo data.',
    }),
    to: '/docs/guides/data',
  },
  {
    icon: '📱',
    title: translate({ id: 'home.feature.pwa.title', message: 'Installable and offline' }),
    text: translate({
      id: 'home.feature.pwa.text',
      message:
        'A service worker caches the catalog network-first, and the install prompt is wired up. Customers keep browsing on a dropped connection.',
    }),
    to: '/docs/guides/pwa',
  },
  {
    icon: '🔍',
    title: translate({ id: 'home.feature.seo.title', message: 'SEO out of the box' }),
    text: translate({
      id: 'home.feature.seo.text',
      message:
        'Schema.org/Product JSON-LD, OpenGraph and Twitter cards are generated per product, with GA4 and Meta Pixel events already wired.',
    }),
    to: '/docs/guides/seo-analytics',
  },
  {
    icon: '⚖️',
    title: translate({ id: 'home.feature.license.title', message: 'Apache-2.0, all of it' }),
    text: translate({
      id: 'home.feature.license.text',
      message:
        'Every feature documented on this site is free and open source. Nothing on these pages is gated behind a paid tier.',
    }),
    to: '/docs/intro',
  },
  {
    icon: '🛠️',
    title: translate({ id: 'home.feature.maintained.title', message: 'Maintained, with receipts' }),
    text: translate({
      id: 'home.feature.maintained.text',
      message:
        'Three packages on one version number, and a CI job that installs them the way you will — outside the workspace, on two operating systems and two React majors.',
    }),
    to: '/docs/maintenance',
  },
];

function Hero() {
  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.heroInner}>
          <div>
            <span className={styles.eyebrow}>
              <Translate id="home.hero.eyebrow">React · Tailwind · Apache-2.0</Translate>
            </span>
            <h1 className={styles.title}>
              <Translate id="home.hero.title.a">A storefront your client can</Translate>{' '}
              <span className={styles.titleAccent}>
                <Translate id="home.hero.title.b">sell from today</Translate>
              </span>
            </h1>
            <p className={styles.subtitle}>
              <Translate id="home.hero.subtitle">
                PlugStore is a turnkey catalog and e-commerce framework for React. One
                command scaffolds a complete store — routing, cart, wishlist, search,
                checkout, PWA and SEO included — that you then shape into the brand you
                need.
              </Translate>
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/docs/getting-started/cli">
                <Translate id="home.hero.cta.start">Get started</Translate>
              </Link>
              <Link className="button button--secondary button--lg" to="pathname:///demo/">
                <Translate id="home.hero.cta.demo">Browse the 50 themes</Translate>
              </Link>
            </div>
          </div>

          <div className={styles.terminal}>
            <div className={styles.terminalBar} aria-hidden="true">
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <pre className={styles.terminalBody}>
              <code>
                <span className={styles.prompt}>$ </span>npm create plug-store my-store
                {'\n'}
                {'\n'}
                <span className={styles.comment}>? Store / company name:</span> Bloom Cosmetics
                {'\n'}
                <span className={styles.comment}>? Industry theme:</span> Bloom (Beauty)
                {'\n'}
                <span className={styles.comment}>? Currency:</span> BRL
                {'\n'}
                <span className={styles.comment}>? Pix key:</span> bloom@example.com
                {'\n'}
                {'\n'}
                <span className={styles.prompt}>$ </span>cd my-store && npm install && npm run dev
                {'\n'}
                <span className={styles.comment}>  ready at http://localhost:5173</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      title={translate({ id: 'home.meta.title', message: 'Catalog & e-commerce framework for React' })}
      description={translate({
        id: 'home.meta.description',
        message:
          'PlugStore is an open-source React and Tailwind framework for product catalogs and online stores, with 50 industry themes, headless data providers, WhatsApp and Pix checkout, PWA and SEO built in.',
      })}
    >
      <Hero />

      <main>
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>
              <Translate id="home.features.title">What you get</Translate>
            </h2>
            <p className={styles.sectionLead}>
              <Translate id="home.features.lead">
                Every item below ships in the open-source packages. Follow the link to
                the guide that explains how it works and how to change it.
              </Translate>
            </p>

            <div className="ps-grid">
              {features.map((feature) => (
                <Link key={feature.title} to={feature.to} className={`ps-card ${styles.feature}`}>
                  <div className={styles.featureIcon} aria-hidden="true">
                    {feature.icon}
                  </div>
                  <div className={styles.featureTitle}>{feature.title}</div>
                  <p className={styles.featureText}>{feature.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.closing}>
          <div className="container">
            <h2 className={styles.sectionTitle}>
              <Translate id="home.closing.title">Ten seconds to a running store</Translate>
            </h2>
            <p className={styles.sectionLead} style={{ margin: '0 auto 2rem' }}>
              <Translate id="home.closing.lead">
                Start from the CLI, or read how the pieces fit together before you commit
                to anything.
              </Translate>
            </p>
            <div className={styles.actions} style={{ justifyContent: 'center' }}>
              <Link className="button button--primary button--lg" to="/docs/getting-started/cli">
                <Translate id="home.closing.cta.start">Install PlugStore</Translate>
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/architecture">
                <Translate id="home.closing.cta.arch">How it works</Translate>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
