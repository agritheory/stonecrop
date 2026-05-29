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
		'no-console': 'warn',
		'prefer-promise-reject-errors': 'off',
		// eslint built-in fires before TS sees `_`-prefix patterns; use the TS-aware variant below.
		'eslint/no-unused-vars': 'off',
		'typescript/no-explicit-any': 'off',
		'typescript/no-unsafe-assignment': 'off',
		'typescript/no-unsafe-return': 'off',
		'typescript/no-unsafe-type-assertion': 'warn',
		'typescript/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			},
		],
		// Type-aware rules: enabled but warn-only during migration; promote to error in a follow-up.
		'typescript/no-floating-promises': 'warn',
		'typescript/unbound-method': 'warn',
		'typescript/await-thenable': 'warn',
		// Unicorn correctness rules demoted to warn during migration.
		'unicorn/no-useless-spread': 'warn',
		'unicorn/no-useless-fallback-in-spread': 'warn',
		'unicorn/no-new-array': 'warn',
		// Vue plugin only lints <script>; demoted during migration.
		'vue/return-in-computed-property': 'warn',
		'import/no-cycle': ['error', { maxDepth: 3 }],
	},
	overrides: [
		{
			files: ['**/tests/**', '**/*.{test,spec}.{ts,tsx,js,mjs}'],
			rules: {
				'eslint/no-unused-vars': 'off',
				'vitest/no-focused-tests': 'error',
				'vitest/no-disabled-tests': 'warn',
				'vitest/expect-expect': 'warn',
				'vitest/no-conditional-expect': 'warn',
				'vitest/valid-expect': 'warn',
				'vitest/require-mock-type-parameters': 'off',
				'typescript/no-unsafe-assignment': 'off',
				'typescript/no-unsafe-member-access': 'off',
				'typescript/no-unsafe-call': 'off',
				'typescript/no-floating-promises': 'off',
				'typescript/unbound-method': 'off',
				'no-console': 'off',
			},
		},
	],
}

export default config
