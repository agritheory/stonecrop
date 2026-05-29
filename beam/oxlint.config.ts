import { defineConfig } from 'oxlint'

import root from '../oxlint.config.ts'

export default defineConfig({
	extends: [root],
	plugins: ['typescript', 'unicorn', 'oxc', 'import', 'promise', 'vitest', 'vue'],
	rules: {
		'no-console': ['error', { allow: ['warn', 'error'] }],
		'no-underscore-dangle': ['error', { allow: ['__dirname', '__filename', '__v_isReactive', '__caslSubjectType__'] }],
		'typescript/no-unsafe-type-assertion': 'error',
		'typescript/consistent-return': 'error',
	},
})
