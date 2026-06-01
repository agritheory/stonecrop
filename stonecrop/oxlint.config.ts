import { defineConfig } from 'oxlint'

import root from '../oxlint.config.ts'

export default defineConfig({
	extends: [root],
	plugins: ['typescript', 'unicorn', 'oxc', 'import', 'promise', 'vitest', 'vue'],
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
					'_context',
					'_stonecrop',
					'_mockComponent',
					'_secondReload',
					'_hstStore',
					'_batchId',
					'_store',
					'_redo',
				],
			},
		],
	},
})
