import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces
    port: 5173  // Use a consistent port
  },
  optimizeDeps: {
    exclude: ['/wasm/options_pricing_wasm.js']
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          wasm: ['/wasm/options_pricing_wasm.js']
        }
      }
    }
  }
});
