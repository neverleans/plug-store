import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// GitHub Pages serves project sites from /<repo>/, so the CI build passes
// VITE_BASE=/plug-store/. A custom domain would leave this at the default "/".
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
