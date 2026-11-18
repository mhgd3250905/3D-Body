import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: './',
  build: {
    outDir: '../assets/scene',
    emptyOutDir: true,
    target: 'es2020',
    rollupOptions: {
      input: fileURLToPath(new URL('index.html', import.meta.url)),
    },
    chunkSizeWarningLimit: 800,
  },
});
