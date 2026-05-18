// @ts-check
import eslint from '@eslint/js'
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
	features: { tooling: true },
	dirs: { src: [] },
})
	.prepend({ ignores: ['playground/**', 'fullstack/**'] })
	.prepend(eslint.configs.recommended)
	.append({
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
		},
	})
