import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		projects: ['aform/*/vite.config.ts', 'atable/*/vite.config.ts', 'beam/*/vite.config.ts'],
	},
})
