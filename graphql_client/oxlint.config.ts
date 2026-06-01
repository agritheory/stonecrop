import { defineConfig } from 'oxlint'

import root from '../oxlint.config.ts'

export default defineConfig({
	extends: [root],
	ignorePatterns: ['tests/**', 'eslint.config.js'],
	plugins: ['typescript', 'unicorn', 'oxc', 'import', 'promise', 'vitest', 'vue'],
	rules: {
		'no-console': 'error',
		'no-underscore-dangle': 'error',
		'typescript/no-unsafe-type-assertion': 'error',
	},
})
