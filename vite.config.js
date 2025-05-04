import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist', // Mudando de 'build' para 'dist' para corresponder ao padrão do Netlify
  },
  preview: {
    port: 5000,
  },
});