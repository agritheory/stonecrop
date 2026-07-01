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
	.append({
		// templates/ contains Nuxt page scaffolding — file names like index.vue are routing
		// conventions, not registered component names, so multi-word is not applicable here.
		files: ['templates/**/*.vue'],
		rules: { 'vue/multi-word-component-names': 'off' },
	})
