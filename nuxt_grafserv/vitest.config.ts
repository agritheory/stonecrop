import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
	// defineVitestConfig automatically sets up the correct environment
	// Don't override environment here - it breaks the automatic Nuxt environment setup
	resolve: {
		alias: {
			'#internal/grafserv/resolvers': new URL('./test/mocks/resolvers.ts', import.meta.url).pathname,
			'#internal/grafserv/middleware': new URL('./test/mocks/middleware.ts', import.meta.url).pathname,
			'#internal/grafserv/pgl': new URL('./test/mocks/pgl.ts', import.meta.url).pathname,
			'#build/grafserv-preset': new URL('./test/mocks/preset.ts', import.meta.url).pathname,
		},
	},
	test: {
		setupFiles: ['./test/setup.ts'],
		coverage: {
			enabled: true,
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
			include: ['src/**/*.ts'],
			thresholds: {
				lines: 70,
				functions: 70,
				branches: 60, // file watcher branches in module.ts are difficult to test in unit tests
				statements: 70,
			},
		},
	},
})
