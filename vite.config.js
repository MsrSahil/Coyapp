import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/feed': 'http://localhost:5000',
      '/swipe': 'http://localhost:5000',
      '/matches': 'http://localhost:5000',
      '/reset': 'http://localhost:5000',
      '/undo': 'http://localhost:5000',
      '/api': 'http://localhost:5000'
    }
  }
});
