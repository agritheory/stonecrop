// @ts-check
import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig(
	{
		ignores: ['dist/**', 'node_modules/**', 'coverage/**', '*.config.ts', 'tests/**', 'eslint.config.js'],
	},

	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,

	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
			},
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'no-console': 'warn',
			'prefer-promise-reject-errors': 'off',
			quotes: ['warn', 'single', { avoidEscape: true }],
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			// CASL uses internal `any` typed values throughout its API
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			// These async methods satisfy interface contracts that require async signatures
			'@typescript-eslint/require-await': 'off',
			// `any` in resolver/middleware type unions is intentional API surface
			'@typescript-eslint/no-redundant-type-constituents': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
		},
	},

	eslintConfigPrettier
)
