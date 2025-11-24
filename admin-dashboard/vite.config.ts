import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: false,
    allowedHosts: [
      'lively-imagination-production.up.railway.app',
      '.up.railway.app', // Allow all Railway domains
      'localhost'
    ]
  }
});
