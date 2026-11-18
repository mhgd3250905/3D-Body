import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: './',
  build: {
    outDir: '../assets/scene',
    emptyOutDir: true,
    target: 'es2020',
    rollupOptions: {
      input: ['index.html', 'v5.html'].map(file => fileURLToPath(new URL(file, import.meta.url))),
    },
    chunkSizeWarningLimit: 800,
  },
});
