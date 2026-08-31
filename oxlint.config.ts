// don't use the defineConfig helper since the oxlint package doesn't exist at the root level (only in subpackages)
import type { OxlintConfig } from 'oxlint'

const config: OxlintConfig = {
	plugins: ['typescript', 'unicorn', 'oxc', 'import', 'promise', 'vitest'],

	categories: {
		correctness: 'error',
		suspicious: 'warn',
		perf: 'warn',
	},

	options: {
		reportUnusedDisableDirectives: 'warn',
		typeAware: true,
	},

	env: {
		browser: true,
		builtin: true,
		node: true,
		vitest: true,
		vue: true,
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
				// A fixture built beside its cases is clearer than one hoisted away from it, and a
				// test's collections are small enough that the lookup cost is not real.
				// `no-await-in-loop` is deliberately not here: the sequential sites each carry a
				// reason, and turning it off orphans those and stops the rule catching new ones.
				'unicorn/consistent-function-scoping': 'off',
				'unicorn/prefer-set-has': 'off',
				'no-console': 'off',
				'typescript/no-unsafe-type-assertion': 'off',
				'typescript/unbound-method': 'off',
				'vitest/expect-expect': 'warn',
				'vitest/no-conditional-expect': 'error',
				'vitest/no-disabled-tests': 'warn',
				'vitest/no-focused-tests': 'error',
				'vitest/require-mock-type-parameters': 'off',
				// The rule reads `expect(actual)` as the whole signature, but `@vitest/expect` declares
				// `<T>(actual: T, message?: string)`. That message is what makes an assertion explain
				// itself on failure, and every report here is against correct code.
				'vitest/valid-expect': 'off',
			},
		},
	],
}

export default config
