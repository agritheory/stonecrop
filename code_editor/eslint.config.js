// @ts-check
import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig(
	// Ignore patterns
	{
		ignores: ['eslint.config.js', 'dist/**', 'node_modules/**', '*.config.ts'],
	},

	// Base configurations
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...pluginVue.configs['flat/recommended'],

	// Configuration for all files
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: ['tests/*.ts'],
				},
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.vue'],
			},
		},
		rules: {
			'no-console': 'warn',
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

	// Vue file parser configuration
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
