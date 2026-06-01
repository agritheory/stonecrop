import { defineConfig } from 'oxlint'

import root from '../oxlint.config.ts'

export default defineConfig({
	extends: [root],
	plugins: ['typescript', 'unicorn', 'oxc', 'import', 'promise', 'vitest', 'vue'],
	ignorePatterns: ['tests/**', 'eslint.config.js'],
	rules: {
		'no-console': ['error', { allow: ['warn', 'error', 'debug', 'info'] }],
		'no-underscore-dangle': [
			'error',
			{
				allow: [
					'__dirname',
					'__filename',
					'__v_isReactive',
					'__caslSubjectType__',
					'_root',
					'_ancestorIndex',
					'_ancestorIndexDirty',
					'_ensureAncestorIndex',
					'_client',
					'_operationLogConfig',
					'_operationLogStore',
				],
			},
		],
		'typescript/no-unsafe-type-assertion': 'error',
	},
})
