import { defineConfig, type UserConfig, type ConfigEnv } from 'vite';
import path from 'path';
import postcssNested from 'postcss-nested';
import autoprefixer from 'autoprefixer';

const wpExternals = [
	'@wordpress/block-editor',
	'@wordpress/blocks',
	'@wordpress/components',
	'@wordpress/data',
	'@wordpress/element',
	'@wordpress/hooks',
	'@wordpress/i18n',
	'react',
	'react-dom',
];

const wpGlobals: Record<string, string> = {
	'@wordpress/block-editor': 'wp.blockEditor',
	'@wordpress/blocks': 'wp.blocks',
	'@wordpress/components': 'wp.components',
	'@wordpress/data': 'wp.data',
	'@wordpress/element': 'wp.element',
	'@wordpress/hooks': 'wp.hooks',
	'@wordpress/i18n': 'wp.i18n',
	react: 'React',
	'react-dom': 'ReactDOM',
};

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
	return {
		build: {
			emptyOutDir: false,
			minify: mode !== 'development',
			rollupOptions: {
				external: wpExternals,
				input: {
					admin: path.resolve(__dirname, 'src/js/admin.tsx'),
				},
				output: {
					format: 'iife',
					name: 'petitionerAdmin',
					globals: wpGlobals,
					entryFileNames: '[name].js',
					assetFileNames: '[name][extname]',
					dir: path.resolve(__dirname, 'dist'),
				},
			},
		},
		css: {
			postcss: {
				plugins: [postcssNested(), autoprefixer()],
			},
		},
		resolve: {
			alias: {
				'@admin': path.resolve(__dirname, 'src/js/admin/'),
				'@js': path.resolve(__dirname, 'src/js/'),
			},
		},
	};
});
