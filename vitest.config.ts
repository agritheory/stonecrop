import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		projects: [
			'aform/*/vite.config.ts',
			'atable/*/vite.config.ts',
			'beam/*/vite.config.ts',
			'casl_middleware/*/vite.config.ts',
			'nuxt/*',
			'rockfoil/*/vite.config.ts',
			'stonecrop/*/vite.config.ts',
		],
	},
})
