import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import * as path from 'path';

export default defineConfig({
  plugins: [
    react(),
    // input https://www.npmjs.com/package/html-minifier-terser options
    ViteMinifyPlugin({}),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5175, // Default = 5173
    host: true,
    /** @DOCS : https://vitejs.dev/config/server-options.html#server-strictport */
    // strictPort: true, // Default = false
  },
  build: {
    minify: 'terser',
  },
});
