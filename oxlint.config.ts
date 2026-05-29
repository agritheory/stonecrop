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
	],
	rules: {
		'no-console': 'warn',
		'prefer-promise-reject-errors': 'off',
		'typescript/no-explicit-any': 'off',
		'typescript/no-unsafe-assignment': 'off',
		'typescript/no-unsafe-return': 'off',
		'typescript/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			},
		],
		'import/no-cycle': ['error', { maxDepth: 3 }],
	},
	overrides: [
		{
			files: ['**/tests/**', '**/*.{test,spec}.{ts,tsx,js,mjs}'],
			rules: {
				'vitest/no-focused-tests': 'error',
				'vitest/no-disabled-tests': 'warn',
				'vitest/expect-expect': 'warn',
				'typescript/no-unsafe-assignment': 'off',
				'typescript/no-unsafe-member-access': 'off',
				'typescript/no-unsafe-call': 'off',
				'no-console': 'off',
			},
		},
	],
}

export default config
