import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import fs from 'fs';
import dts from 'vite-plugin-dts';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src'],
      rollupTypes: true,
    }),
    // Vite 5 library mode ignores cssFileName and always emits 'style.css'.
    // This plugin renames it to 'index.css' after the bundle is written so
    // the output matches the exports map: "./dist/index.css": "./dist/index.css".
    {
      name: 'rename-style-to-index-css',
      closeBundle() {
        const outDir = path.resolve(__dirname, 'dist');
        const src = path.join(outDir, 'style.css');
        const dest = path.join(outDir, 'index.css');
        if (fs.existsSync(src)) {
          fs.renameSync(src, dest);
        }
      },
    },
  ],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'CatalogCore',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // Externalize all peer deps — don't bundle them
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-router-dom',
        '@tanstack/react-query',
        'framer-motion',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
          'react-router-dom': 'ReactRouterDOM',
          'framer-motion': 'FramerMotion',
        },
      },
    },
    sourcemap: true,
    minify: false, // ship readable source for library consumers
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
