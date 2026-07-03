import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      // Em dev, o frontend roda em :5174 e o backend em :3000.
      // Isso deixa o fetch('/api/...') funcionando igual em dev e produção,
      // sem precisar fixar host/porta no código do frontend.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
