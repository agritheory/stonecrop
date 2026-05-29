import { defineConfig } from 'oxlint'

import root from '../oxlint.config.ts'

export default defineConfig({
	extends: [root],
	ignorePatterns: ['tests/**', 'eslint.config.js'],
	rules: {
		'no-console': 'error',
	},
})
