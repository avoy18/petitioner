import { defineConfig, type UserConfig, type ConfigEnv } from 'vite';
import path from 'path';
import postcssNested from 'postcss-nested';
import autoprefixer from 'autoprefixer';

type OutputChunk = { name: string };

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
	return {
		build: {
			emptyOutDir: false,
			minify: mode !== 'development',
			rollupOptions: {
				input: {
					main: path.resolve(__dirname, 'src/js/main.ts'),
				},
				output: {
					entryFileNames: (chunk: OutputChunk) => {
						return chunk.name.includes('style')
							? '[name].css'
							: '[name].js';
					},
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
				'@js': path.resolve(__dirname, 'src/js/'),
			},
		},
	};
});
