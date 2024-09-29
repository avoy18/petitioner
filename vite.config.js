const { defineConfig } = require("vite");
const legacy = require("@vitejs/plugin-legacy");
const path = require("path");
const fs = require("fs-extra");

const deploy = () => {
  const targetDir = path.resolve(__dirname, "../petitioner-deployment");

  // Clean up the target directory before deploying
  if (fs.existsSync(targetDir)) {
    fs.removeSync(targetDir);  // Remove existing files
  }

  fs.mkdirSync(targetDir);  // Create the directory

  // Copy files and folders, excluding unwanted ones
  fs.copySync(path.resolve(__dirname), targetDir, {
    filter: (src) => {
      // Excludes
      return !src.includes(".git")
        && !src.includes(".DS_Store")
        && !src.includes("deployment")
        && !src.includes("node_modules")
        && !src.includes(".gitignore")
        && !src.includes("package-lock.json")
        && !src.includes("yarn.lock")
        && !src.includes("README.md")
        && !src.includes(".git");
    },
  });


  console.log("Deployment complete. Files copied to 'petitioner-deployment' folder.");
};

module.exports = defineConfig({
  optimizeDeps: {
    include: ['@ariakit/react-core', '@ariakit/core'],
  },
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"], // Specify legacy browser support
    }),
  ],
  build: {
    rollupOptions: {
      external: [
        '@ariakit/react-core',
        '@ariakit/core',
        '@wordpress/blocks',
        '@wordpress/element',
        '@wordpress/i18n',
        '@wordpress/editor'
      ],
      input: {
        main: path.resolve(__dirname, "src/js/main.js"),
        admin: path.resolve(__dirname, "src/js/admin.js"),
      },
      output: {
        globals: {
          '@wordpress/blocks': 'wp.blocks',
          '@wordpress/element': 'wp.element',
          '@wordpress/i18n': 'wp.i18n',
        },
        entryFileNames: (chunk) => {
          return chunk.name.includes("style") || chunk.name.includes("adminStyle")
            ? "[name].css"
            : "[name].js";
        },
        assetFileNames: "[name][extname]",
        dir: path.resolve(__dirname, "dist"),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
      },
    },
  },
  deploy
});
