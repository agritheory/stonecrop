// @ts-check
import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig(
	// Ignore patterns specific to this package
	{
		ignores: ['dist/**', 'node_modules/**', 'coverage/**', '*.config.ts', '**/*.spec.ts', 'eslint.config.js'],
	},

	// Base ESLint recommended rules
	eslint.configs.recommended,

	// TypeScript ESLint recommended + type-checked rules
	...tseslint.configs.recommendedTypeChecked,

	// Vue 3 recommended rules
	...pluginVue.configs['flat/recommended'],

	// Configuration for TypeScript and Vue files
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
			},
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.vue'],
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			vue: pluginVue,
		},
		rules: {
			'no-console': 'error',
			'prefer-promise-reject-errors': 'off',
			quotes: ['warn', 'single', { avoidEscape: true }],
			'vue/multi-word-component-names': 'off',
			'vue/no-deprecated-slot-attribute': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
		},
	},

	// Vue-specific parser configuration
	{
		files: ['**/*.vue'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
			},
		},
	},

	// Prettier integration (must be last)
	eslintConfigPrettier
)
