import { defineConfig } from 'oxlint'

import root from '../oxlint.config.ts'

export default defineConfig({
	extends: [root],
	ignorePatterns: ['tests/**'],
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
					// GraphQL conversion metadata fields — intentional API convention
					'_unmapped',
					'_graphqlType',
					'_graphqlTypeName',
					'_isLink',
				],
			},
		],
		'typescript/no-unsafe-type-assertion': 'error',
	},
})
