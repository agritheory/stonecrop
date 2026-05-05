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
		ignores: [
			'dist/**',
			'build/**',
			'node_modules/**',
			'coverage/**',
			'temp/**',
			'eslint.config.js',
			'*.config.ts',
			'tests/**',
		],
	},

	// Base recommended configurations
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...pluginVue.configs['flat/recommended'],

	// Global configuration for all files
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				NodeJS: true,
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: ['tests/*.ts', 'tests/desktop/*.ts'],
				},
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},

	// Vue-specific configuration
	{
		files: ['**/*.vue'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.vue'],
			},
		},
	},

	// Custom rules
	{
		rules: {
			'no-console': 2,
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

	// Prettier integration (must be last)
	eslintConfigPrettier
)
