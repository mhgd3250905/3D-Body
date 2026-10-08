import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: '../assets/scene',
    emptyOutDir: true,
    target: 'es2020',
    chunkSizeWarningLimit: 800,
  },
});
