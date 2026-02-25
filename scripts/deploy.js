const path = require('path');
const fs = require('fs-extra');

const EXCLUDED_DIRS = [
	'.git',
	'.github',
	'node_modules',
	'scripts',
	'vendor',
	'wordpress',
	'.husky',
	'coverage',
];

// Files to exclude (matched against basename)
const EXCLUDED_FILES = [
	'.DS_Store',
	'.gitignore',
	'package-lock.json',
	'yarn.lock',
	'pnpm-lock.yaml',
];

const deploy = () => {
	const targetDir = path.resolve(__dirname, '../../petitioner-deployment');
	const sourceDir = path.resolve(__dirname, '..');

	if (fs.existsSync(targetDir)) {
		fs.removeSync(targetDir);
	}

	fs.mkdirSync(targetDir);

	fs.copySync(sourceDir, targetDir, {
		filter: (src) => {
			// Get path relative to source directory
			const relativePath = path.relative(sourceDir, src);

			// Always include the root directory
			if (relativePath === '') {
				return true;
			}

			// Split into path segments (cross-platform)
			const segments = relativePath.split(path.sep);
			const basename = path.basename(src);

			// Exclude if any segment matches an excluded directory
			const inExcludedDir = segments.some((segment) =>
				EXCLUDED_DIRS.includes(segment)
			);
			if (inExcludedDir) {
				return false;
			}

			// Exclude specific files by name
			if (EXCLUDED_FILES.includes(basename)) {
				return false;
			}

			return true;
		},
	});

	console.log('\n');
	console.log('\x1b[32m✓\x1b[0m Deployment complete!');
	console.log(
		'\x1b[90m  Files copied to\x1b[0m \x1b[36mpetitioner-deployment/\x1b[0m'
	);
	console.log('\n');
};

deploy();
