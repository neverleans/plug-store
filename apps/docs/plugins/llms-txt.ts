import fs from 'node:fs/promises';
import path from 'node:path';
import type { LoadContext, Plugin } from '@docusaurus/types';

/**
 * Emits llms.txt and llms-full.txt at the site root after each build.
 *
 * The discovery funnel for a library is no longer `search → docs → install`; a
 * lot of it is now `someone asks an assistant → the assistant reads whatever it
 * can fetch`. llms.txt (llmstxt.org) is the convention for handing that reader a
 * clean map instead of making it scrape rendered HTML.
 *
 * Generated, never hand-written. A hand-maintained index describes the docs as
 * they were the day someone remembered to edit it; this one is rebuilt from the
 * actual pages on every build, so it cannot drift.
 *
 * Runs per locale, reading whichever tree that locale actually renders from.
 */

interface Page {
  /** Doc id, e.g. `guides/pix`. */
  id: string;
  title: string;
  description: string;
  /** Absolute URL of the rendered page. */
  url: string;
  /** Raw markdown, frontmatter stripped. */
  body: string;
  /** Frontmatter sidebar_position, so the index reads in the sidebar's order. */
  position: number;
}

/**
 * The blurb at the top, per locale. Not taken from siteConfig.tagline: that
 * field is Portuguese, is not translated by Docusaurus, and this theme never
 * renders it — so reusing it would put Portuguese at the top of the English
 * file for no reason.
 */
const BLURB: Record<string, string[]> = {
  en: [
    'A turnkey React and Tailwind CSS framework for product catalogs and online',
    'stores, built around Brazilian commerce: real Pix BR Codes to the Banco',
    'Central spec, WhatsApp orders, Mercado Pago. 50 industry themes, headless',
    'data providers, PWA and SEO included. Apache-2.0.',
    '',
    'Install: npm create plug-store',
  ],
  'pt-BR': [
    'Um framework turnkey em React e Tailwind CSS para catálogos e lojas online,',
    'construído em torno do comércio brasileiro: BR Codes Pix de verdade, na',
    'especificação do Banco Central, pedidos por WhatsApp e Mercado Pago. 50 temas',
    'por setor, data providers headless, PWA e SEO inclusos. Apache-2.0.',
    '',
    'Instalação: npm create plug-store',
  ],
};

const STRINGS: Record<string, { fullTextAt: string; everyPage: string }> = {
  en: {
    fullTextAt: 'Full text of every page below',
    everyPage: 'Every documentation page, in full. Canonical HTML',
  },
  'pt-BR': {
    fullTextAt: 'Texto completo de todas as páginas abaixo',
    everyPage: 'Todas as páginas da documentação, na íntegra. HTML canônico',
  },
};

/** Sections in reading order; a page matching no prefix lands in the first. */
const SECTIONS: Array<{ key: string; prefix: string; label: Record<string, string> }> = [
  { key: 'root', prefix: '', label: { en: 'Start here', 'pt-BR': 'Comece por aqui' } },
  {
    key: 'getting-started',
    prefix: 'getting-started/',
    label: { en: 'Getting started', 'pt-BR': 'Primeiros passos' },
  },
  { key: 'guides', prefix: 'guides/', label: { en: 'Guides', 'pt-BR': 'Guias' } },
  { key: 'recipes', prefix: 'recipes/', label: { en: 'Recipes', 'pt-BR': 'Receitas' } },
  { key: 'themes', prefix: 'themes/', label: { en: 'Themes', 'pt-BR': 'Temas' } },
  { key: 'reference', prefix: 'reference/', label: { en: 'Reference', 'pt-BR': 'Referência' } },
];

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return /\.mdx?$/.test(entry.name) ? [full] : [];
    }),
  );
  return files.flat();
}

/**
 * Pull the frontmatter fields we need without adding a YAML dependency: the
 * block is ours, so it is flat `key: value` pairs and nothing more exotic.
 */
function parse(raw: string): { frontmatter: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { frontmatter: {}, body: raw };

  const frontmatter: Record<string, string> = {};
  let key: string | null = null;

  for (const line of match[1].split(/\r?\n/)) {
    const pair = /^([a-zA-Z_]+):\s*(.*)$/.exec(line);
    if (pair) {
      key = pair[1];
      frontmatter[key] = pair[2].trim().replace(/^["']|["']$/g, '');
    } else if (key && line.trim()) {
      // A folded description continues on the following indented lines.
      frontmatter[key] = `${frontmatter[key]} ${line.trim()}`.trim();
    }
  }

  return { frontmatter, body: raw.slice(match[0].length) };
}

export default function llmsTxtPlugin(context: LoadContext): Plugin<void> {
  const { siteConfig, i18n, siteDir } = context;
  const locale = i18n.currentLocale;
  const isDefault = locale === i18n.defaultLocale;

  // Translated docs live in the i18n tree; the default locale renders from docs/.
  const docsDir = isDefault
    ? path.join(siteDir, 'docs')
    : path.join(siteDir, 'i18n', locale, 'docusaurus-plugin-content-docs', 'current');

  // siteConfig.baseUrl already carries the locale segment for non-default locales.
  const origin = siteConfig.url.replace(/\/$/, '');
  const base = siteConfig.baseUrl.replace(/\/$/, '');
  const strings = STRINGS[locale] ?? STRINGS.en;

  return {
    name: 'plug-store-llms-txt',

    async postBuild({ outDir }) {
      const files = await walk(docsDir);
      const pages: Page[] = [];

      for (const file of files) {
        const raw = await fs.readFile(file, 'utf8');
        const { frontmatter, body } = parse(raw);
        const id = path
          .relative(docsDir, file)
          .replace(/\\/g, '/')
          .replace(/\.mdx?$/, '');

        pages.push({
          id,
          title: frontmatter.title ?? id,
          description: frontmatter.description ?? '',
          url: `${origin}${base}/docs/${id}/`,
          body: body.trim(),
          position: Number(frontmatter.sidebar_position ?? Number.MAX_SAFE_INTEGER),
        });
      }

      const bucket = (id: string) => {
        const match = SECTIONS.filter((s) => s.prefix && id.startsWith(s.prefix)).pop();
        return match ? match.key : SECTIONS[0].key;
      };

      // Sidebar order first, so the file reads the way the site reads; the id is
      // only a tiebreak for pages that declare no position.
      const order = new Map(SECTIONS.map((s, i) => [s.key, i]));
      pages.sort((a, b) => {
        const byBucket = (order.get(bucket(a.id)) ?? 99) - (order.get(bucket(b.id)) ?? 99);
        if (byBucket !== 0) return byBucket;
        if (a.position !== b.position) return a.position - b.position;
        return a.id.localeCompare(b.id);
      });

      const index = [
        `# ${siteConfig.title}`,
        '',
        ...(BLURB[locale] ?? BLURB.en),
        '',
        `${strings.fullTextAt}: ${origin}${base}/llms-full.txt`,
        '',
      ];

      for (const section of SECTIONS) {
        const inSection = pages.filter((p) => bucket(p.id) === section.key);
        if (inSection.length === 0) continue;
        index.push(`## ${section.label[locale] ?? section.label.en}`, '');
        for (const page of inSection) {
          const summary = page.description ? `: ${page.description}` : '';
          index.push(`- [${page.title}](${page.url})${summary}`);
        }
        index.push('');
      }

      const full = [
        `# ${siteConfig.title}`,
        '',
        ...(BLURB[locale] ?? BLURB.en),
        '',
        `${strings.everyPage}: ${origin}${base}/`,
        '',
        '---',
        '',
        ...pages.flatMap((page) => [`# ${page.title}`, '', `Source: ${page.url}`, '', page.body, '', '---', '']),
      ];

      await fs.writeFile(path.join(outDir, 'llms.txt'), `${index.join('\n')}\n`, 'utf8');
      await fs.writeFile(path.join(outDir, 'llms-full.txt'), `${full.join('\n')}\n`, 'utf8');

      console.log(`[llms-txt] ${locale}: indexed ${pages.length} pages`);
    },
  };
}
