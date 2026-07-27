import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * One sidebar, ordered the way someone actually learns the framework:
 * why it exists → get it running → understand each subsystem → copy a recipe →
 * look something up.
 */
const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Start here',
      collapsed: false,
      items: ['intro', 'brazil', 'architecture', 'maintenance'],
    },
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: [
        'getting-started/cli',
        'getting-started/manual-install',
        'getting-started/tailwind',
        'getting-started/deploy',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/configuration',
        'guides/themes',
        'guides/data',
        'guides/checkout',
        'guides/pix',
        'guides/cart-wishlist',
        'guides/i18n-currency',
        'guides/pwa',
        'guides/seo-analytics',
        'guides/admin',
      ],
    },
    {
      type: 'category',
      label: 'Recipes',
      items: [
        'recipes/rest-api',
        'recipes/supabase',
        'recipes/custom-checkout',
        'recipes/brand-theme',
      ],
    },
    {
      type: 'category',
      label: 'Themes',
      items: ['themes/gallery'],
    },
    {
      type: 'category',
      label: 'Reference',
      items: ['reference/exports', 'reference/types', 'reference/cli'],
    },
  ],
};

export default sidebars;
