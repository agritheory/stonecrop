// @ts-check
import eslint from '@eslint/js'
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
	features: { tooling: true },
	dirs: { src: [] },
})
	.prepend({ ignores: ['playground/**', 'test/**'] })
	.prepend(eslint.configs.recommended)
