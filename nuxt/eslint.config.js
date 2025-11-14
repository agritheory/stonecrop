// @ts-check
import eslint from '@eslint/js'
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
	features: {
		tooling: true,
		stylistic: true,
	},
	dirs: {
		src: ['./playground'],
	},
})
	.prepend(eslint.configs.recommended)
	.append({
		rules: {
			'@stylistic/no-tabs': 'off',
			'@stylistic/indent': 'off',
		},
	})
