import { defineConfig } from 'oxlint'

import root from '../oxlint.config.ts'

export default defineConfig({
	extends: [root],
	plugins: ['typescript', 'unicorn', 'oxc', 'import', 'promise', 'vitest', 'vue'],
	rules: {
		'no-console': 'error',
		'no-underscore-dangle': 'error',
		'typescript/no-unsafe-type-assertion': 'error',
	},
})
