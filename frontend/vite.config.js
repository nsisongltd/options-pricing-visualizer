import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces
    port: 5173,  // Use a consistent port
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  optimizeDeps: {
    exclude: ['**/*.wasm']
  },
  build: {
    target: 'esnext'
  },
  assetsInclude: ['**/*.wasm'],
  resolve: {
    alias: {
      '@wasm': '/src/wasm-pkg'
    }
  }
});
