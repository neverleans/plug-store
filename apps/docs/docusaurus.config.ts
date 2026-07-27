import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { themes as prismThemes } from 'prism-react-renderer';

// The demo (the 50-theme gallery) is a separate Vite SPA deployed alongside
// these docs under /demo/. `pathname://` tells Docusaurus to emit a plain
// anchor instead of a client-side route, so the browser really navigates out
// of the docs bundle and into the demo's own index.html.
const DEMO_URL = 'pathname:///demo/';

const config: Config = {
  title: 'PlugStore',
  tagline: 'Catálogos e lojas em React, prontos para vender',
  favicon: 'img/favicon.svg',

  url: 'https://neverleans.github.io',
  baseUrl: '/plug-store/',
  organizationName: 'neverleans',
  projectName: 'plug-store',
  trailingSlash: true,

  // A dead link in the docs is a broken promise to a reader, so fail the build.
  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-BR'],
    localeConfigs: {
      en: { label: 'English', htmlLang: 'en-US' },
      'pt-BR': { label: 'Português', htmlLang: 'pt-BR' },
    },
  },

  markdown: {
    mermaid: true,
    hooks: {
      // Same reasoning as onBrokenLinks: a link that resolves to nothing should
      // stop the build, not reach a reader.
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      // Local search: no Algolia account, no network call, works offline and on
      // a fork. Indexes both locales.
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en', 'pt'],
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  // Emits llms.txt and llms-full.txt per locale. See the plugin for why this is
  // generated rather than written by hand.
  plugins: ['./plugins/llms-txt.ts'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/neverleans/plug-store/tree/master/apps/docs/',
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'PlugStore',
      logo: {
        alt: 'PlugStore',
        src: 'img/logo.svg',
      },
      items: [
        { type: 'docSidebar', sidebarId: 'docs', position: 'left', label: 'Docs' },
        { to: '/docs/reference/exports', position: 'left', label: 'API' },
        { to: '/docs/themes/gallery', position: 'left', label: 'Themes' },
        { to: DEMO_URL, position: 'right', label: 'Live demo', className: 'navbar-demo-link' },
        { type: 'localeDropdown', position: 'right' },
        {
          href: 'https://github.com/neverleans/plug-store',
          position: 'right',
          className: 'navbar-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting started', to: '/docs/getting-started/cli' },
            { label: 'Built for Brazil', to: '/docs/brazil' },
            { label: 'Guides', to: '/docs/guides/configuration' },
            { label: 'API reference', to: '/docs/reference/exports' },
          ],
        },
        {
          title: 'Project',
          items: [
            { label: 'GitHub', href: 'https://github.com/neverleans/plug-store' },
            { label: 'How this is maintained', to: '/docs/maintenance' },
            { label: 'Changelog', href: 'https://github.com/neverleans/plug-store/blob/master/CHANGELOG.md' },
            { label: 'Contributing', href: 'https://github.com/neverleans/plug-store/blob/master/CONTRIBUTING.md' },
            // Generated at build time by ./plugins/llms-txt.ts.
            { label: 'llms.txt', to: 'pathname:///plug-store/llms.txt' },
          ],
        },
        {
          title: 'Packages',
          items: [
            { label: 'plug-store-core', href: 'https://www.npmjs.com/package/@neverleans-labs/plug-store-core' },
            { label: 'plug-store-themes', href: 'https://www.npmjs.com/package/@neverleans-labs/plug-store-themes' },
            { label: 'create-plug-store', href: 'https://www.npmjs.com/package/create-plug-store' },
          ],
        },
      ],
      copyright: `Apache-2.0 · Copyright © ${new Date().getFullYear()} neverleans`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'diff'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
