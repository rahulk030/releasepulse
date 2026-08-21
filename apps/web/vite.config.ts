import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [vue()],
  server: {
    port: 5174,
    proxy: { '/api': 'http://localhost:5090', '/health': 'http://localhost:5090' }
  }
});
