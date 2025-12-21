const path = require('path');
const fs = require('fs-extra');

const deploy = () => {
	const targetDir = path.resolve(__dirname, '../../petitioner-deployment');

	if (fs.existsSync(targetDir)) {
		fs.removeSync(targetDir);
	}

	fs.mkdirSync(targetDir);

	const sourceDir = path.resolve(__dirname, '..');

	fs.copySync(sourceDir, targetDir, {
		filter: (src: string) => {
			return (
				!src.includes('.git') &&
				!src.includes('.DS_Store') &&
				!src.includes('deployment') &&
				!src.includes('node_modules') &&
				!src.includes('.github') &&
				!src.includes('.gitignore') &&
				!src.includes('package-lock.json') &&
				!src.includes('yarn.lock') &&
				!src.includes('pnpm-lock.yaml') &&
				!src.includes('README.md') &&
				!src.includes('/scripts/')
			);
		},
	});

	console.log(
		"Deployment complete. Files copied to 'petitioner-deployment' folder."
	);
};

deploy();
