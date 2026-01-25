import { defineConfig } from 'vite';
import path from 'path';
import postcssNested from 'postcss-nested';
import autoprefixer from 'autoprefixer';

export default defineConfig({
	resolve: {
		alias: {
			'@admin': path.resolve(__dirname, '../src/js/admin/'),
			'@js': path.resolve(__dirname, '../src/js/'),
		},
	},
	css: {
		postcss: {
			plugins: [postcssNested(), autoprefixer()],
		},
	},
});