#!/usr/bin/env node

/**
 * Automated Version Update Script
 * 
 * Usage:
 *   node scripts/update-version.js 11
 * 
 * This will:
 * 1. Update version.js to v1.0.11
 * 2. Update version date to today
 * 3. Update build number to 11
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const prNumber = parseInt(args[0]);

if (!prNumber || isNaN(prNumber)) {
  console.error('❌ Error: Please provide a PR number');
  console.log('Usage: node scripts/update-version.js <PR_NUMBER>');
  process.exit(1);
}

const versionFilePath = path.join(__dirname, '../sandbox-frontend/src/config/version.js');
const version = `1.0.${prNumber}`;
const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

const versionFileContent = `/**
 * Application version
 * Automatically incremented with each Pull Request
 * 
 * Version format: MAJOR.MINOR.PATCH
 * - MAJOR: Breaking changes (1.x.x)
 * - MINOR: New features (x.1.x)
 * - PATCH: PR number (x.x.1)
 * 
 * For this project:
 * - MAJOR: 1 (stable)
 * - MINOR: 0 (feature releases)
 * - PATCH: PR number (1.0.1, 1.0.2, 1.0.3, etc.)
 */

export const VERSION = '${version}';
export const VERSION_DATE = '${date}';
export const BUILD_NUMBER = ${prNumber};

export const VERSION_INFO = {
  version: VERSION,
  buildNumber: BUILD_NUMBER,
  date: VERSION_DATE,
  name: 'Physical Security Sandbox',
  codename: 'Gallagher Guardian'
};

export default VERSION;
`;

try {
  fs.writeFileSync(versionFilePath, versionFileContent);
  console.log(`✅ Version updated to v${version}`);
  console.log(`📅 Date: ${date}`);
  console.log(`🔢 Build: #${prNumber}`);
  console.log('');
  console.log('Next steps:');
  console.log('1. Update CHANGELOG.md with changes');
  console.log('2. Commit changes: git add . && git commit -m "chore: bump version to v' + version + '"');
  console.log('3. Push and create PR');
} catch (error) {
  console.error('❌ Error updating version:', error.message);
  process.exit(1);
}
