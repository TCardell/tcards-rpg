import { defineConfig } from 'vite';
export default defineConfig({
  base: process.env.TCARDS_BASE_PATH || '/',
  build: { rollupOptions: { input: { game: 'index.html', admin: 'apps/admin/index.html' } } },
  server: { host: '127.0.0.1', port: 3000, strictPort: true },
});
