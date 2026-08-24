import { defineConfig } from 'oxlint'

import root from '../oxlint.config.ts'

export default defineConfig({
	extends: [root],
	plugins: ['typescript', 'unicorn', 'oxc', 'import', 'promise', 'vitest', 'vue'],
	rules: {
		'no-console': ['error', { allow: ['warn', 'error', 'debug', 'info'] }],
		'no-underscore-dangle': ['error', { allow: ['_root'] }],
	},
	overrides: [
		{
			// The playground is a demo app, not library code: it casts untyped JSON returned by its
			// own MirageJS mock server, imports the package stylesheet and its action registrations
			// for their side effects, and logs freely. Every other rule still applies to it.
			files: ['playground/**'],
			rules: {
				'no-console': 'off',
				'import/no-unassigned-import': 'off',
				'typescript/no-unsafe-type-assertion': 'off',
			},
		},
	],
})
