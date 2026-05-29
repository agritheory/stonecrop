import { defineConfig } from 'oxlint'

import root from '../oxlint.config.ts'

export default defineConfig({
	extends: [root],
	ignorePatterns: ['tests/**', 'eslint.config.js'],
	rules: {
		'typescript/no-unsafe-member-access': 'off',
		'typescript/no-unsafe-argument': 'off',
		'typescript/no-unsafe-call': 'off',
		'typescript/require-await': 'off',
		'typescript/no-redundant-type-constituents': 'off',
	},
})
