import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'], // Specify legacy browser support
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/js/main.js'),
        style: path.resolve(__dirname, 'src/scss/style.scss'),
      },
      output: {
        entryFileNames: 'petitioner.js',  // Output filename for JavaScript
        assetFileNames: 'petitioner.css', // Output filename for CSS
        dir: path.resolve(__dirname, 'dist'),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "./src/scss/style.scss";`, // Ensure all SCSS imports are included
      },
    },
  },
});
