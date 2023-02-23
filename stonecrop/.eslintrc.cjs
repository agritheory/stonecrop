module.exports = {
	// https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
	// This option interrupts the configuration hierarchy at this file
	// Remove this if you have a higher level ESLint config file (it usually happens into a monorepos)
	root: true,

	// https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
	// Must use parserOptions instead of "parser" to allow vue-eslint-parser to keep working
	// `parser: 'vue-eslint-parser'` is already included with any 'plugin:vue/**' config and should be omitted
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.json'],
		parser: require.resolve('@typescript-eslint/parser'),
		extraFileExtensions: ['.vue'],
	},

	// Rules order is important, please avoid shuffling them
	extends: [
		// Base ESLint recommended rules
		'eslint:recommended',

		// https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#usage
		// ESLint typescript rules
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',

		// Uncomment any of the lines below to choose desired strictness,
		// but leave only one uncommented!
		// See https://eslint.vuejs.org/rules/#available-rules
		'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)
		// 'plugin:vue/vue3-strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
		// 'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

		// https://github.com/prettier/eslint-config-prettier#installation
		// usage with Prettier, provided by 'eslint-config-prettier'.
		'prettier',
	],

	plugins: [
		// required to apply rules which need type information
		'@typescript-eslint',

		// https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-files
		// required to lint *.vue files
		'vue',

		// https://github.com/typescript-eslint/typescript-eslint/issues/389#issuecomment-509292674
		// Prettier has not been included as plugin to avoid performance impact
		// add it as an extension for your IDE
	],

	// add your custom rules here
	rules: {
		'no-console': 2,
		'prefer-promise-reject-errors': 'off',
		quotes: ['warn', 'single', { avoidEscape: true }],
		'vue/multi-word-component-names': 'off',
		'vue/no-deprecated-slot-attribute': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
	},

	ignorePatterns: ['.eslintrc.cjs', '*.config.ts', 'node_modules/', 'dist/'],
}
