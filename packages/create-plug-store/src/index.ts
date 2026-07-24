#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import { green, cyan, bold, red, yellow } from 'kolorist';

// ─── CLI Flag Parsing ─────────────────────────────────────────────────────────
// Supports non-interactive mode for CI/CD environments:
//   npx create-plug-store my-catalog --theme fashion --currency BRL --yes
//   npx create-plug-store my-catalog --theme electronics --whatsapp 5511999999999
//   npx create-plug-store my-catalog --theme food --currency BRL --pix-key me@email.com --pix-city "Sao Paulo" --yes

function parseArgs(): {
  positional: string | undefined;
  flags: Record<string, string | boolean>;
} {
  const args = process.argv.slice(2);
  const flags: Record<string, string | boolean> = {};
  let positional: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (!next || next.startsWith('--')) {
        flags[key] = true;
      } else {
        flags[key] = next;
        i++;
      }
    } else if (!positional) {
      positional = arg;
    }
  }

  return { positional, flags };
}

// ─── Theme choices (kept in sync with prompts list) ───────────────────────────
const THEME_VALUES = [
  'fashion', 'electronics', 'food', 'furniture', 'beauty', 'sports', 'books',
  'pets', 'automotive', 'art', 'jewelry', 'homeware', 'market', 'wellness',
  'stationery', 'winery', 'brewery', 'coffee', 'bakery', 'spices', 'chocolates',
  'gaming', 'geek', 'music', 'boardgames', 'toys', 'hardware', 'lighting',
  'gardening', 'office', 'security', 'cycling', 'outdoors', 'fishing', 'fitness',
  'combat', 'motorcycles', 'optics', 'dental', 'medical', 'pharmacy',
  'watchmakers', 'perfume', 'handcrafted', 'party', 'flowers', 'leather',
  'baby', 'spiritual', 'vintage',
];

const CURRENCY_VALUES = ['BRL', 'USD', 'EUR'];

async function init() {
  console.log(`\n🚀 ${bold(cyan('PlugStore CLI'))} — Interactive Project Generator\n`);

  const { positional, flags } = parseArgs();
  const isYes = flags['yes'] === true || flags['y'] === true;

  // Validate theme flag if provided
  const themeFlag = typeof flags['theme'] === 'string' ? flags['theme'] : undefined;
  if (themeFlag && !THEME_VALUES.includes(themeFlag)) {
    console.log(red(`✖ Tema inválido: "${themeFlag}". Valores aceitos: ${THEME_VALUES.join(', ')}`));
    process.exit(1);
  }

  // Validate currency flag if provided
  const currencyFlag = typeof flags['currency'] === 'string' ? flags['currency'].toUpperCase() : undefined;
  if (currencyFlag && !CURRENCY_VALUES.includes(currencyFlag)) {
    console.log(red(`✖ Moeda inválida: "${currencyFlag}". Valores aceitos: ${CURRENCY_VALUES.join(', ')}`));
    process.exit(1);
  }

  const defaultProjectName = positional || 'meu-catalogo';

  // ── If --yes is set, skip all prompts and use defaults / flags ──────────────
  if (isYes) {
    const projectName = defaultProjectName;
    const companyName = typeof flags['company'] === 'string' ? flags['company'] : 'Minha Loja Plug';
    const theme = themeFlag ?? 'fashion';
    const currency = currencyFlag ?? 'BRL';
    const whatsapp = typeof flags['whatsapp'] === 'string' ? flags['whatsapp'] : '';
    const pixKey = typeof flags['pix-key'] === 'string' ? flags['pix-key'] : '';
    const pixMerchantCity = typeof flags['pix-city'] === 'string' ? flags['pix-city'] : '';

    await scaffold({ projectName, companyName, theme, currency, whatsapp, pixKey, pixMerchantCity });
    return;
  }

  // ── Interactive mode ────────────────────────────────────────────────────────
  let result: prompts.Answers<
    'projectName' | 'companyName' | 'theme' | 'currency' | 'whatsapp' | 'pixKey' | 'pixMerchantCity'
  >;

  try {
    result = await prompts(
      [
        {
          type: 'text',
          name: 'projectName',
          message: 'Nome da pasta do projeto:',
          initial: defaultProjectName,
        },
        {
          type: 'text',
          name: 'companyName',
          message: 'Nome da Loja / Empresa:',
          initial: 'Minha Loja Plug',
        },
        {
          type: 'select',
          name: 'theme',
          message: 'Escolha o Nicho / Tema inicial:',
          choices: [
            { title: 'LUXE (Moda & Vestuário)', value: 'fashion' },
            { title: 'TechVault (Eletrônicos & Tech)', value: 'electronics' },
            { title: 'FreshMarket (Alimentos & Mercado)', value: 'food' },
            { title: 'Artisan Home (Móveis & Decoração)', value: 'furniture' },
            { title: 'Bloom (Beleza & Cosméticos)', value: 'beauty' },
            { title: 'VELOCITY (Esportes & Fitness)', value: 'sports' },
            { title: 'Folio & Quill (Livraria & Papelaria)', value: 'books' },
            { title: 'Pawsome (Pet Shop)', value: 'pets' },
            { title: 'APEX MOTORS (Automotivo)', value: 'automotive' },
            { title: 'Atelier (Arte & Design)', value: 'art' },
            { title: 'Maison Solenne (Joias & Luxo)', value: 'jewelry' },
            { title: 'Maison & Table (Utilidades domésticas)', value: 'homeware' },
            { title: 'Maison Marché (Mercado Geral)', value: 'market' },
            { title: 'Maison Calme (Bem-estar & Spa)', value: 'wellness' },
            { title: 'Papier & Encre (Papelaria Fina)', value: 'stationery' },
            { title: 'Château Reserve (Vinhos & Espumantes)', value: 'winery' },
            { title: 'Craft & Hop (Cervejas Artesanais)', value: 'brewery' },
            { title: 'Roast & Beans (Cafés Especiais)', value: 'coffee' },
            { title: 'Patisserie Sucre (Doces & Confeitaria)', value: 'bakery' },
            { title: 'Aroma & Especiarias (Temperos & Ervas)', value: 'spices' },
            { title: 'Cacao Noir (Chocolates Gourmet)', value: 'chocolates' },
            { title: 'CyberZone Gaming (Games & Periféricos)', value: 'gaming' },
            { title: 'Geekverse (Cultura Pop & Action Figures)', value: 'geek' },
            { title: 'Symphony (Instrumentos Musicais)', value: 'music' },
            { title: 'Taverna dos Jogos (Board Games & RPG)', value: 'boardgames' },
            { title: 'Mundo do Brinquedo (Brinquedos Educativos)', value: 'toys' },
            { title: 'Titan Ferramentas (Construção & Indústria)', value: 'hardware' },
            { title: 'Lumina (Lustres & Iluminação Design)', value: 'lighting' },
            { title: 'Verde Vida (Jardinagem & Plantas)', value: 'gardening' },
            { title: 'ErgoWork (Escritório & Corporativo)', value: 'office' },
            { title: 'Shield (Segurança & Câmeras IP)', value: 'security' },
            { title: 'AeroBike (Ciclismo & MTB)', value: 'cycling' },
            { title: 'Summit Adventure (Camping & Trilha)', value: 'outdoors' },
            { title: 'Nautilus (Pesca & Náutica)', value: 'fishing' },
            { title: 'IronNutri (Suplementos & Whey)', value: 'fitness' },
            { title: 'Octagon Fight (Artes Marciais & Boxe)', value: 'combat' },
            { title: 'Rider Motors (Motos & Capacetes)', value: 'motorcycles' },
            { title: 'Visione (Óptica & Armações)', value: 'optics' },
            { title: 'Odonto Care (Higiene Bucal & Odonto)', value: 'dental' },
            { title: 'MedEquip (Médico & Ortopedia)', value: 'medical' },
            { title: 'PharmaPlus (Farmácia & Vitaminas)', value: 'pharmacy' },
            { title: 'Horlogerie Royale (Relógios de Luxo)', value: 'watchmakers' },
            { title: 'Elixir Parfums (Perfumes Importados)', value: 'perfume' },
            { title: 'Feito à Mão (Artesanato & Velas)', value: 'handcrafted' },
            { title: 'Festa & Alegria (Artigos de Festa)', value: 'party' },
            { title: 'Jardim das Flores (Floricultura & Buquês)', value: 'flowers' },
            { title: 'Couro & Tradição (Bolsas & Calçados)', value: 'leather' },
            { title: 'Nuvem de Bebê (Enxoval & Maternidade)', value: 'baby' },
            { title: 'Astral & Cristais (Esotérico & Cristais)', value: 'spiritual' },
            { title: 'Retro Vinyl (Discos & Antiguidades)', value: 'vintage' },
          ],
          initial: themeFlag ? THEME_VALUES.indexOf(themeFlag) : 0,
        },
        {
          type: 'select',
          name: 'currency',
          message: 'Moeda principal:',
          choices: [
            { title: 'BRL (R$ - Real Brasileiro)', value: 'BRL' },
            { title: 'USD ($ - Dólar Americano)', value: 'USD' },
            { title: 'EUR (€ - Euro)', value: 'EUR' },
          ],
          initial: currencyFlag ? CURRENCY_VALUES.indexOf(currencyFlag) : 0,
        },
        {
          type: 'text',
          name: 'whatsapp',
          message: 'Número do WhatsApp (opcional, ex: 5511999999999):',
          initial: typeof flags['whatsapp'] === 'string' ? flags['whatsapp'] : '',
        },
        {
          type: (_prev, values) => (values.currency === 'BRL' ? 'text' : null),
          name: 'pixKey',
          message: 'Chave Pix (opcional — CPF, e-mail, telefone ou chave aleatória):',
          initial: typeof flags['pix-key'] === 'string' ? flags['pix-key'] : '',
        },
        {
          type: (_prev, values) => (values.pixKey ? 'text' : null),
          name: 'pixMerchantCity',
          message: 'Cidade do recebedor para o Pix (ex: Sao Paulo):',
          initial: typeof flags['pix-city'] === 'string' ? flags['pix-city'] : '',
        },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operação cancelada');
        },
      }
    );
  } catch (err: any) {
    console.log(err.message);
    return;
  }

  await scaffold(result);
}

// ─── Project Scaffolding ──────────────────────────────────────────────────────

interface ScaffoldOptions {
  projectName: string;
  companyName: string;
  theme: string;
  currency: string;
  whatsapp: string;
  pixKey: string;
  pixMerchantCity: string;
}

async function scaffold({
  projectName,
  companyName,
  theme,
  currency,
  whatsapp,
  pixKey,
  pixMerchantCity,
}: ScaffoldOptions) {
  const targetDir = path.join(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.log(yellow(`\n⚠️  A pasta "${projectName}" já existe. Escolha outro nome ou apague a pasta.`));
    process.exit(1);
  }

  console.log(`\n⏳ Criando projeto PlugStore em ${cyan(targetDir)}...\n`);
  fs.mkdirSync(targetDir, { recursive: true });

  // 1. package.json
  const packageJson = {
    name: projectName,
    private: true,
    version: '0.1.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
    },
    dependencies: {
      '@neverleans-labs/plug-store-core': '^0.1.0',
      '@neverleans-labs/plug-store-themes': '^0.1.0',
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      'react-router-dom': '^6.30.1',
    },
    devDependencies: {
      '@types/react': '^18.3.23',
      '@types/react-dom': '^18.3.7',
      '@vitejs/plugin-react-swc': '^3.11.0',
      autoprefixer: '^10.4.21',
      postcss: '^8.5.6',
      tailwindcss: '^3.4.17',
      typescript: '^5.8.3',
      vite: '^5.4.19',
    },
  };

  fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(packageJson, null, 2));

  // 2. vite.config.ts
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
`;
  fs.writeFileSync(path.join(targetDir, 'vite.config.ts'), viteConfig);

  // 3. tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      paths: {
        '@/*': ['./src/*'],
      },
    },
    include: ['src'],
    references: [{ path: './tsconfig.node.json' }],
  };
  fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));

  const tsConfigNode = {
    compilerOptions: {
      composite: true,
      skipLibCheck: true,
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowSyntheticDefaultImports: true,
      strict: true,
    },
    include: ['vite.config.ts'],
  };
  fs.writeFileSync(path.join(targetDir, 'tsconfig.node.json'), JSON.stringify(tsConfigNode, null, 2));

  // 4. tailwind.config.js
  // Points content at both the project source AND the compiled core package
  // so Tailwind doesn't purge the utility classes used inside the library.
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Include compiled core output so Tailwind does not purge library classes
    './node_modules/@neverleans-labs/plug-store-core/dist/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
`;
  fs.writeFileSync(path.join(targetDir, 'tailwind.config.js'), tailwindConfig);

  // 5. postcss.config.js
  const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
  fs.writeFileSync(path.join(targetDir, 'postcss.config.js'), postcssConfig);

  // 6. index.html
  const indexHtml = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${companyName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  fs.writeFileSync(path.join(targetDir, 'index.html'), indexHtml);

  // 7. .gitignore
  const gitignore = `node_modules
dist
.env
.env.local
.DS_Store
`;
  fs.writeFileSync(path.join(targetDir, '.gitignore'), gitignore);

  // 8. src directory
  fs.mkdirSync(path.join(targetDir, 'src'), { recursive: true });

  // 9. src/index.css
  // This is the consumer's own CSS file. It imports the Tailwind directives
  // and the compiled library styles (dist/index.css) via the package export.
  const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─── PlugStore CSS Design Tokens ─────────────────────────────────────────────
   These variables are already defined inside the imported library stylesheet
   above. You can override individual tokens here to customise the base theme.
   All color values must be HSL without the hsl() wrapper (e.g. "222 84% 5%").
   ─────────────────────────────────────────────────────────────────────────── */

/* Example override — uncomment and edit to customise:
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --radius: 0.5rem;
}
*/
`;
  fs.writeFileSync(path.join(targetDir, 'src', 'index.css'), indexCss);

  // 10. src/App.tsx
  const pixConfigLines = pixKey
    ? `        pixKey: "${pixKey}",\n        pixMerchantCity: "${pixMerchantCity || ''}",\n`
    : '';

  const appTsx = `import React from 'react';
import { CatalogApp } from '@neverleans-labs/plug-store-core';

export default function App() {
  return (
    <CatalogApp
      defaultTheme="${theme}"
      config={{
        companyName: "${companyName}",
        currency: "${currency}",
        whatsappPhone: "${whatsapp}",
${pixConfigLines}      }}
    />
  );
}
`;
  fs.writeFileSync(path.join(targetDir, 'src', 'App.tsx'), appTsx);

  // 11. src/main.tsx
  // Import the local src/index.css (which pulls in the Tailwind directives).
  // The dist/index.css from the core package is included via the package's
  // sideEffects declaration — no manual import needed.
  const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
  fs.writeFileSync(path.join(targetDir, 'src', 'main.tsx'), mainTsx);

  console.log(green(`\n✨ Projeto ${bold(companyName)} criado com sucesso!\n`));
  console.log(`  📁 Pasta:    ${cyan(projectName)}`);
  console.log(`  🎨 Tema:     ${cyan(theme)}`);
  console.log(`  💰 Moeda:    ${cyan(currency)}`);
  if (whatsapp) console.log(`  💬 WhatsApp: ${cyan(whatsapp)}`);
  if (pixKey)   console.log(`  💳 Chave Pix: ${cyan(pixKey)}`);
  console.log(
    `\nPara iniciar:` +
    green(`\n  cd ${projectName}\n  npm install\n  npm run dev\n`)
  );
}

init();
