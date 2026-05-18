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
		tags: [
			{ name: 'unit', description: 'Pure logic test — no DOM, network, or framework runtime.' },
			{ name: 'component', description: 'Vue component test using jsdom + @vue/test-utils.' },
			{
				name: 'e2e',
				timeout: 30_000,
				description: 'Spins up a real server or Nuxt runtime. Run in integration gate only.',
			},
			{
				name: 'nuxt',
				timeout: 30_000,
				description: 'Involves the Nuxt module, plugin, composables, or @nuxt/test-utils.',
			},
			{ name: 'graphql', description: 'Involves GraphQL schema, queries, resolvers, or PostGraphile.' },
		],
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
				// e2e tests skipped pending Vue 3.6+ (MagicString vite-node interop);
				// thresholds reflect unit-test-only coverage of module.ts / handler.ts
				lines: 60,
				functions: 70,
				branches: 45,
				statements: 60,
			},
		},
	},
})
