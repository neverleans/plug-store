import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/plug-store/search/',
    component: ComponentCreator('/plug-store/search/', '970'),
    exact: true
  },
  {
    path: '/plug-store/docs/',
    component: ComponentCreator('/plug-store/docs/', '381'),
    routes: [
      {
        path: '/plug-store/docs/',
        component: ComponentCreator('/plug-store/docs/', 'c44'),
        routes: [
          {
            path: '/plug-store/docs/',
            component: ComponentCreator('/plug-store/docs/', '9bd'),
            routes: [
              {
                path: '/plug-store/docs/architecture/',
                component: ComponentCreator('/plug-store/docs/architecture/', 'cf3'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/getting-started/cli/',
                component: ComponentCreator('/plug-store/docs/getting-started/cli/', '0c8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/getting-started/deploy/',
                component: ComponentCreator('/plug-store/docs/getting-started/deploy/', '6a2'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/getting-started/manual-install/',
                component: ComponentCreator('/plug-store/docs/getting-started/manual-install/', 'ace'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/getting-started/tailwind/',
                component: ComponentCreator('/plug-store/docs/getting-started/tailwind/', 'a51'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/guides/admin/',
                component: ComponentCreator('/plug-store/docs/guides/admin/', 'b68'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/guides/cart-wishlist/',
                component: ComponentCreator('/plug-store/docs/guides/cart-wishlist/', '082'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/guides/checkout/',
                component: ComponentCreator('/plug-store/docs/guides/checkout/', 'cc1'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/guides/configuration/',
                component: ComponentCreator('/plug-store/docs/guides/configuration/', '95f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/guides/data/',
                component: ComponentCreator('/plug-store/docs/guides/data/', '6f5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/guides/i18n-currency/',
                component: ComponentCreator('/plug-store/docs/guides/i18n-currency/', 'e7b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/guides/pix/',
                component: ComponentCreator('/plug-store/docs/guides/pix/', '9e3'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/guides/pwa/',
                component: ComponentCreator('/plug-store/docs/guides/pwa/', '75c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/guides/seo-analytics/',
                component: ComponentCreator('/plug-store/docs/guides/seo-analytics/', 'a14'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/guides/themes/',
                component: ComponentCreator('/plug-store/docs/guides/themes/', '0ca'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/intro/',
                component: ComponentCreator('/plug-store/docs/intro/', '71d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/recipes/brand-theme/',
                component: ComponentCreator('/plug-store/docs/recipes/brand-theme/', '184'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/recipes/custom-checkout/',
                component: ComponentCreator('/plug-store/docs/recipes/custom-checkout/', 'a44'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/recipes/rest-api/',
                component: ComponentCreator('/plug-store/docs/recipes/rest-api/', 'b30'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/recipes/supabase/',
                component: ComponentCreator('/plug-store/docs/recipes/supabase/', '63b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/reference/cli/',
                component: ComponentCreator('/plug-store/docs/reference/cli/', 'b58'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/reference/exports/',
                component: ComponentCreator('/plug-store/docs/reference/exports/', 'b2e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/reference/types/',
                component: ComponentCreator('/plug-store/docs/reference/types/', '957'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/plug-store/docs/themes/gallery/',
                component: ComponentCreator('/plug-store/docs/themes/gallery/', '8e3'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/plug-store/',
    component: ComponentCreator('/plug-store/', 'd6e'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
