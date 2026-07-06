// @ts-check
import eslint from '@eslint/js'
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import prettier from 'eslint-config-prettier/flat'

export default createConfigForNuxt({
	features: { tooling: true },
	dirs: { src: [] },
})
	.prepend({ ignores: ['playground/**', 'fullstack/**', 'test/fixtures/**'] })
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
	// Turn off every formatting rule that Prettier owns (e.g. vue/html-self-closing), so eslint
	// and Prettier stop fighting over style. Must stay LAST so it overrides the presets above.
	.append(prettier)
