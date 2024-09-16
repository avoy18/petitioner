const babel = require('@rollup/plugin-babel').default;
const resolve = require('@rollup/plugin-node-resolve').default;
const path = require('path');

module.exports = {
  input: {
    main: path.resolve(__dirname, 'src/gutenberg/form/index.js'), // Multiple input files
    admin: path.resolve(__dirname, 'src/js/admin.js'), 
    frontend: path.resolve(__dirname, 'src/js/main.js'),
  },
  output: {
    dir: path.resolve(__dirname, 'dist'), // Output to dist folder
    format: 'iife', // Use IIFE for WordPress compatibility (for each file)
    entryFileNames: '[name].js', // Generate separate output files for each entry point
    globals: {
      '@wordpress/blocks': 'wp.blocks',
      '@wordpress/element': 'wp.element',
      '@wordpress/i18n': 'wp.i18n',
    },
  },
  plugins: [
    resolve({
      extensions: ['.js', '.jsx'], // Ensure Rollup processes both .js and .jsx files
    }),
    babel({
      exclude: 'node_modules/**', // Avoid transpiling dependencies
      presets: ['@babel/preset-react', '@babel/preset-env'], // JSX and modern JS transpilation
      babelHelpers: 'bundled', // Ensures Babel helpers are bundled with the code
      extensions: ['.js', '.jsx'], // Babel processes .js and .jsx files
    }),
  ],
  external: ['@wordpress/blocks', '@wordpress/element', '@wordpress/i18n'], // External WordPress dependencies
};