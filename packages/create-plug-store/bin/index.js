#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import { green, cyan, bold, red, yellow } from 'kolorist';
async function init() {
    console.log(`\n🚀 ${bold(cyan('PlugStore CLI'))} — Interactive Project Generator\n`);
    const defaultProjectName = 'meu-catalogo';
    let result;
    try {
        result = await prompts([
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
                ],
                initial: 0,
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
                initial: 0,
            },
            {
                type: 'text',
                name: 'whatsapp',
                message: 'Número do WhatsApp (opcional, ex: 5511999999999):',
                initial: '',
            },
        ], {
            onCancel: () => {
                throw new Error(red('✖') + ' Operação cancelada');
            },
        });
    }
    catch (err) {
        console.log(err.message);
        return;
    }
    const { projectName, companyName, theme, currency, whatsapp } = result;
    const targetDir = path.join(process.cwd(), projectName);
    if (fs.existsSync(targetDir)) {
        console.log(yellow(`\n⚠️  A pasta "${projectName}" já existe. Escolha outro nome ou apague a pasta.`));
        return;
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
            build: 'vite build',
            preview: 'vite preview',
        },
        dependencies: {
            '@neverleans/plug-store-core': '^0.1.0',
            '@neverleans/plug-store-themes': '^0.1.0',
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
    // 3. index.html
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
    // 4. src directory & App.tsx
    fs.mkdirSync(path.join(targetDir, 'src'), { recursive: true });
    const appTsx = `import React from 'react';
import { CatalogApp } from '@neverleans/plug-store-core';

export default function App() {
  return (
    <CatalogApp
      defaultTheme="${theme}"
      config={{
        companyName: "${companyName}",
        currency: "${currency}",
        whatsappPhone: "${whatsapp}",
      }}
    />
  );
}
`;
    fs.writeFileSync(path.join(targetDir, 'src', 'App.tsx'), appTsx);
    const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@neverleans/plug-store-core/dist/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
    fs.writeFileSync(path.join(targetDir, 'src', 'main.tsx'), mainTsx);
    console.log(green(`\n✨ Projeto ${bold(companyName)} criado com sucesso!\n`));
    console.log(`Para iniciar:` + green(`\n  cd ${projectName}\n  npm install\n  npm run dev\n`));
}
init();
