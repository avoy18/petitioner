import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		globals: true,
		environment: 'happy-dom',
		setupFiles: './tests/setup.ts',
		include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
	},
	resolve: {
		alias: {
			'@admin': path.resolve(__dirname, 'src/js/admin/'),
			'@js': path.resolve(__dirname, 'src/js/'),
		},
	},
});
