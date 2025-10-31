// @ts-check
import eslint from '@eslint/js'
import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt({
	// Nuxt ESLint options here
}).prepend(eslint.configs.recommended)
