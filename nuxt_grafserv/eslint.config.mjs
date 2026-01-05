// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
	features: {
		// Rules for module authors
		tooling: true,
		// Rules for formatting
		stylistic: true,
	},
	dirs: {
		src: ['./playground'],
	},
})
	// your custom flat config here...
	.append({
		rules: {
			'no-console': 'off',
			'@stylistic/arrow-parens': 'off',
			'@stylistic/brace-style': 'off',
			'@stylistic/comma-dangle': 'off',
			'@stylistic/indent': 'off',
			'@stylistic/indent-binary-ops': 'off',
			'@stylistic/no-tabs': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
		},
	})
