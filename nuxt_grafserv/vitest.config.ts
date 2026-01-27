import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
	// defineVitestConfig automatically sets up the correct environment
	// Don't override environment here - it breaks the automatic Nuxt environment setup
	resolve: {
		alias: {
			// Mock virtual modules for testing
			'#internal/grafserv/resolvers': '/test/mocks/resolvers.ts',
			'#internal/grafserv/middleware': '/test/mocks/middleware.ts',
		},
	},
	test: {
		coverage: {
			provider: 'istanbul',
			reporter: ['text', 'json', 'html', 'lcov'],
			exclude: [
				'**/node_modules/**',
				'**/dist/**',
				'**/.nuxt/**',
				'**/coverage/**',
				'**/test/**',
				'**/playground/**',
				'**/templates/**',
				'**/*.config.*',
				'**/*.d.ts',
			],
			include: ['src/**/*.ts', 'src/**/*.js'],
			thresholds: {
				lines: 70,
				functions: 70,
				branches: 60, // file watcher branches in module.ts are difficult to test in unit tests
				statements: 70,
			},
		},
	},
})
