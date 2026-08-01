
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Disable sourcemaps in production (security + smaller bundles)
    sourcemap: false,

    // Use terser for better minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,    // remove console.log in production
        drop_debugger: true,   // remove debugger statements
      },
    },

    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Core React libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // State management
          redux: ['@reduxjs/toolkit', 'react-redux'],
          // Other UI utilities
          helmet: ['react-helmet-async'],
        },
      },
    },
  },

  server: {
    port: 3000,
    open: true,   // auto-open browser on dev start
  },
});