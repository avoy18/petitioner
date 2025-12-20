import type { ConfigEnv } from 'vite';

type OutputChunk = { name: string };
type RollupWarning = { code?: string };
type WarningHandlerWithDefault = (warning: RollupWarning) => void;
const { defineConfig } = require('vite');
const legacy = require('@vitejs/plugin-legacy');
const path = require('path');
const fs = require('fs-extra');
const postcssNested = require('postcss-nested');
const autoprefixer = require('autoprefixer');

const deploy = () => {
	const targetDir = path.resolve(__dirname, '../petitioner-deployment');

	// Clean up the target directory before deploying
	if (fs.existsSync(targetDir)) {
		fs.removeSync(targetDir); // Remove existing files
	}

	fs.mkdirSync(targetDir); // Create the directory

	// Copy files and folders, excluding unwanted ones
	fs.copySync(path.resolve(__dirname), targetDir, {
		filter: (src: string) => {
			// Excludes
			return (
				!src.includes('.git') &&
				!src.includes('.DS_Store') &&
				!src.includes('deployment') &&
				!src.includes('node_modules') &&
				!src.includes('.github') &&
				!src.includes('.gitignore') &&
				!src.includes('package-lock.json') &&
				!src.includes('yarn.lock') &&
				!src.includes('README.md') &&
				!src.includes('.git')
			);
		},
	});

	console.log(
		"Deployment complete. Files copied to 'petitioner-deployment' folder."
	);
};

module.exports = defineConfig(({ mode }: ConfigEnv) => {
	return {
		optimizeDeps: {
			include: ['@ariakit/react-core', '@ariakit/core'],
		},
		plugins: [
			legacy({
				targets: ['defaults', 'not IE 11'], // Specify legacy browser support
			}),
		],
		build: {
			minify: mode !== 'development',
			rollupOptions: {
				external: ['@wordpress/hooks'],
				onwarn(warning: RollupWarning, warn: WarningHandlerWithDefault) {
					// Suppress "Module level directives cause errors when bundled" warnings
					if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
						return;
					}
					warn(warning);
				},
				input: {
					main: path.resolve(__dirname, 'src/js/main.ts'),
					admin: path.resolve(__dirname, 'src/js/admin.tsx'),
				},
				output: {
					globals: {
						'@wordpress/hooks': 'wp.hooks',
						'@wordpress/blocks': 'wp.blocks',
						'@wordpress/element': 'wp.element',
						'@wordpress/i18n': 'wp.i18n',
					},
					entryFileNames: (chunk: OutputChunk) => {
						return chunk.name.includes('style') ||
							chunk.name.includes('adminStyle')
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
		deploy,
		resolve: {
			alias: {
				'@admin': path.resolve(__dirname, 'src/js/admin/'),
				'@js': path.resolve(__dirname, 'src/js/'),
				// Add as many as needed
			},
		},
		test: {
			globals: true,
			environment: 'happy-dom',
			setupFiles: './tests/setup.ts',
			include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
		},
	};
});

if (require.main === module) {
	deploy();
}
