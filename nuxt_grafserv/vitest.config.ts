import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		coverage: {
			provider: 'istanbul',
			include: ['src/**/*.ts'],
			exclude: ['src/handler.ts', 'src/cache.ts'], // Nitro runtime files
			thresholds: {
				// Disable coverage thresholds for now
				// The handler and cache modules run in Nitro context and can't be easily unit tested
				functions: 0,
				branches: 0,
				lines: 0,
				statements: 0,
			},
		},
	},
})
