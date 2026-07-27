#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import { green, cyan, bold, red, yellow, dim } from 'kolorist';
import { THEMES, THEME_VALUES, CURRENCY_VALUES } from './themes.js';
import { MESSAGES, resolveLang, type Lang, type Messages } from './messages.js';

// ─── Version pinning ──────────────────────────────────────────────────────────
// The scaffolded project must depend on the packages that were released
// alongside *this* CLI. All three are versioned in lockstep (scripts/version.mjs),
// so the CLI's own version is the correct range for core and themes — a
// hardcoded range here would silently rot one release after it was written.
const CLI_DIR = path.dirname(fileURLToPath(import.meta.url));
const CLI_VERSION: string = JSON.parse(
  fs.readFileSync(path.join(CLI_DIR, '..', 'package.json'), 'utf8'),
).version;
const PLUGSTORE_RANGE = `^${CLI_VERSION}`;

// ─── CLI Flag Parsing ─────────────────────────────────────────────────────────
// Supports non-interactive mode for CI/CD environments:
//   npx create-plug-store my-catalog --theme fashion --currency BRL --yes
//   npx create-plug-store my-catalog --theme electronics --whatsapp 5511999999999
//   npx create-plug-store my-catalog --theme food --currency BRL --pix-key me@email.com --pix-city "Sao Paulo" --yes
//   npx create-plug-store my-catalog --lang en

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

/** Resolved once in init() and threaded through to scaffold(). */
let m: Messages = MESSAGES.pt;
let lang: Lang = 'pt';

async function init() {
  const { positional, flags } = parseArgs();

  const resolvedLang = resolveLang(flags['lang']);
  if (resolvedLang === null) {
    console.log(red(MESSAGES.en.invalidLang(String(flags['lang']))));
    process.exit(1);
  }
  lang = resolvedLang;
  m = MESSAGES[lang];

  console.log(`\n🚀 ${bold(cyan('PlugStore CLI'))} — ${m.tagline}\n`);

  const isYes = flags['yes'] === true || flags['y'] === true;

  // Validate theme flag if provided
  const themeFlag = typeof flags['theme'] === 'string' ? flags['theme'] : undefined;
  if (themeFlag && !THEME_VALUES.includes(themeFlag)) {
    console.log(red(m.invalidTheme(themeFlag, THEME_VALUES.join(', '))));
    process.exit(1);
  }

  // Validate currency flag if provided
  const currencyFlag = typeof flags['currency'] === 'string' ? flags['currency'].toUpperCase() : undefined;
  if (currencyFlag && !CURRENCY_VALUES.includes(currencyFlag as (typeof CURRENCY_VALUES)[number])) {
    console.log(red(m.invalidCurrency(currencyFlag, CURRENCY_VALUES.join(', '))));
    process.exit(1);
  }

  const defaultProjectName = positional || (lang === 'pt' ? 'meu-catalogo' : 'my-catalog');

  // ── If --yes is set, skip all prompts and use defaults / flags ──────────────
  if (isYes) {
    const projectName = defaultProjectName;
    const companyName = typeof flags['company'] === 'string' ? flags['company'] : m.defaultCompanyName;
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
          message: m.askProjectName,
          initial: defaultProjectName,
        },
        {
          type: 'text',
          name: 'companyName',
          message: m.askCompanyName,
          initial: m.defaultCompanyName,
        },
        {
          type: 'select',
          name: 'theme',
          message: m.askTheme,
          // Titles are built from the shared THEMES catalog so the select list
          // can never drift from the --theme flag's accepted values.
          choices: THEMES.map((t) => ({ title: `${t.brand} (${t[lang]})`, value: t.value })),
          initial: themeFlag ? THEME_VALUES.indexOf(themeFlag) : 0,
        },
        {
          type: 'select',
          name: 'currency',
          message: m.askCurrency,
          choices: CURRENCY_VALUES.map((c) => ({ title: m.currencyChoices[c], value: c })),
          initial: currencyFlag
            ? CURRENCY_VALUES.indexOf(currencyFlag as (typeof CURRENCY_VALUES)[number])
            : 0,
        },
        {
          type: 'text',
          name: 'whatsapp',
          message: m.askWhatsapp,
          initial: typeof flags['whatsapp'] === 'string' ? flags['whatsapp'] : '',
        },
        {
          type: (_prev, values) => (values.currency === 'BRL' ? 'text' : null),
          name: 'pixKey',
          message: m.askPixKey,
          initial: typeof flags['pix-key'] === 'string' ? flags['pix-key'] : '',
        },
        {
          type: (_prev, values) => (values.pixKey ? 'text' : null),
          name: 'pixMerchantCity',
          message: m.askPixCity,
          initial: typeof flags['pix-city'] === 'string' ? flags['pix-city'] : '',
        },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' ' + m.cancelled);
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
    console.log(yellow(`\n${m.dirExists(projectName)}`));
    process.exit(1);
  }

  console.log(`\n${m.creating(cyan(targetDir))}\n`);
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
      '@neverleans-labs/plug-store-core': PLUGSTORE_RANGE,
      '@neverleans-labs/plug-store-themes': PLUGSTORE_RANGE,
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
  // The project's own stylesheet: Tailwind directives plus any token overrides.
  // The library stylesheet itself is imported from src/main.tsx, ahead of this
  // file, so anything written here wins.
  const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─── PlugStore CSS Design Tokens ─────────────────────────────────────────────
   Every token is defined in @neverleans-labs/plug-store-core/dist/index.css,
   which src/main.tsx imports before this file. Redefine any of them here to
   customise the base theme.
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

  // No `import React` here: the template sets jsx: "react-jsx" (automatic
  // runtime) together with noUnusedLocals, so an unused React import makes
  // `npm run build` fail with TS6133 on a freshly generated project.
  const appTsx = `import { CatalogApp } from '@neverleans-labs/plug-store-core';

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
  // The core package is built in Vite library mode, which emits dist/index.css
  // as a standalone file — dist/index.js does NOT import it. `sideEffects` only
  // stops a bundler from tree-shaking that CSS once something imports it; it
  // does not create the import. So the consumer has to pull it in explicitly,
  // or the app renders with none of the PlugStore design tokens.
  // Order matters: library styles first, the project's own index.css second, so
  // that any token the developer overrides there wins.
  const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@neverleans-labs/plug-store-core/dist/index.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
  fs.writeFileSync(path.join(targetDir, 'src', 'main.tsx'), mainTsx);

  console.log(green(`\n✨ ${m.created(bold(companyName))}\n`));

  // Labels differ in length between languages, so the value column is aligned
  // at runtime instead of with hardcoded spaces.
  const rows: Array<[string, string]> = [
    [m.labelFolder, projectName],
    [m.labelTheme, theme],
    [m.labelCurrency, currency],
  ];
  if (whatsapp) rows.push([m.labelWhatsapp, whatsapp]);
  if (pixKey) rows.push([m.labelPix, pixKey]);

  const width = Math.max(...rows.map(([label]) => label.length));
  for (const [label, value] of rows) {
    console.log(`  ${label.padEnd(width)}  ${cyan(value)}`);
  }
  console.log(
    `\n${m.nextSteps}` +
    green(`\n  cd ${projectName}\n  npm install\n  npm run dev\n`)
  );
  console.log(dim(`${m.docsHint}\n`));
}

init();
