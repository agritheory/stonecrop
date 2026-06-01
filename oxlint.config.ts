// don't use the defineConfig helper since the oxlint package doesn't exist at the root level (only in subpackages)
import type { OxlintConfig } from 'oxlint'

const config: OxlintConfig = {
	plugins: ['typescript', 'unicorn', 'oxc', 'import', 'promise', 'vitest'],

	categories: {
		correctness: 'error',
		suspicious: 'warn',
	},

	options: {
		typeAware: true,
		reportUnusedDisableDirectives: 'warn',
	},

	env: {
		browser: true,
		node: true,
		es2022: true,
	},

	ignorePatterns: [
		'**/dist/**',
		'**/build/**',
		'**/coverage/**',
		'**/temp/**',
		'**/node_modules/**',
		'**/*.config.ts',
		'**/*.config.js',
		// Nuxt packages still use ESLint (depend on @nuxt/eslint-config).
		'nuxt/**',
		'nuxt_grafserv/**',
	],

	rules: {
		// eslint built-in fires before TS sees `_`-prefix patterns; use the TS-aware variant below.
		'eslint/no-unused-vars': 'off',
		'import/no-cycle': ['error', { maxDepth: 3 }],
		// CSS/asset side-effect imports are legitimate.
		'import/no-unassigned-import': ['error', { allow: ['**/*.css', '**/*.scss', '**/*.sass'] }],
		'no-console': ['error', { allow: ['warn', 'error', 'debug', 'info'] }],
		'no-underscore-dangle': [
			'error',
			{ allow: ['__dirname', '__filename', '__v_isReactive', '__caslSubjectType__', '_root'] },
		],
		'prefer-promise-reject-errors': 'off',
		'typescript/no-unsafe-type-assertion': 'error',
		'typescript/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			},
		],
	},

	overrides: [
		{
			files: ['**/tests/**', '**/*.{test,spec}.{ts,tsx,js,mjs}'],
			rules: {
				'no-console': 'off',
				'typescript/no-floating-promises': 'off',
				'typescript/no-unsafe-assignment': 'off',
				'typescript/no-unsafe-call': 'off',
				'typescript/no-unsafe-member-access': 'off',
				'typescript/no-unsafe-type-assertion': 'off',
				'typescript/unbound-method': 'off',
				'vitest/expect-expect': 'warn',
				'vitest/no-conditional-expect': 'warn',
				'vitest/no-disabled-tests': 'warn',
				'vitest/no-focused-tests': 'error',
				'vitest/require-mock-type-parameters': 'off',
				'vitest/valid-expect': 'warn',
			},
		},
	],
}

export default config
