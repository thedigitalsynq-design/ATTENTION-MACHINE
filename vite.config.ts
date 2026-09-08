import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    cssMinify: true,
    target: 'es2020',
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 4173,
  },
  optimizeDeps: {
    include: ['lenis'],
  },
});
