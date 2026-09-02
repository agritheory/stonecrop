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
	// Turn off every formatting rule the formatter owns (e.g. vue/html-self-closing), so eslint and
	// Oxfmt stop fighting over style. The package is named for Prettier but is just a list of rules
	// to disable, which Oxfmt needs disabled too. Must stay LAST so it overrides the presets above.
	.append(prettier)
