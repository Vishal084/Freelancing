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
        // ✅ manualChunks as a function (required in recent Vite/Rollup)
        manualChunks(id) {
          // React core
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom')) {
            return 'vendor';
          }
          // Redux + toolkit
          if (id.includes('node_modules/@reduxjs/toolkit') ||
              id.includes('node_modules/react-redux')) {
            return 'redux';
          }
          // Helmet
          if (id.includes('node_modules/react-helmet-async')) {
            return 'helmet';
          }
          // Any other node_modules – let Rollup decide
        },
      },
    },
  },

  server: {
    port: 3000,
    open: true,   // auto-open browser on dev start
  },
});