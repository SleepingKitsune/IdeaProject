// CLIENT/vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This makes requests to '/api/users' go to 'http://localhost:3000/api/users'
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // <-- ТУТ УКАЖИ ПОРТ ТВОЕГО СЕРВЕРА
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [react()],
});