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
      return !src.includes("src")
        && !src.includes(".git")
        && !src.includes(".DS_Store")
        && !src.includes("deployment")
        && !src.includes("node_modules")
        && !src.includes(".gitignore")
        && !src.includes("package.json")
        && !src.includes("package-lock.json")
        && !src.includes("vite.config.js")
        && !src.includes("yarn.lock")
        && !src.includes("yarn.lock")
        && !src.includes("README.md")
        && !src.includes(".git");
    },
  });


  console.log("Deployment complete. Files copied to 'petitioner-deployment' folder.");
};

module.exports = defineConfig({
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"], // Specify legacy browser support
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/js/main.js"),
        style: path.resolve(__dirname, "src/scss/style.scss"),
        admin: path.resolve(__dirname, "src/js/admin.js"),
        adminStyle: path.resolve(__dirname, "src/scss/admin.scss"),
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].css",
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
