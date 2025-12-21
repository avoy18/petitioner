/**
 * A platform-independent script to clean the dist folders
 * It uses fs-extra to ensure cross-platform compatibility
 */
const fs = require('fs-extra');
fs.removeSync('dist');
fs.removeSync('dist-gutenberg');
console.log('Cleaned dist folders');