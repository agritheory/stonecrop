import { defineConfig } from 'vitest/config'

export default defineConfig({
	// This package's tests run in a plain `node` environment, NOT under @nuxt/test-utils'
	// `defineVitestConfig`. That wrapper installs the Nuxt environment into vitest's Vite
	// instance, which under vite 7.3.6 / rolldown 1.2.0 fails every file at collection with
	// `Missing field moduleType` from the `builtin:replace` transform — the whole suite, before
	// a single test runs. Nothing here needs the Nuxt runtime: the only test that did
	// (test/e2e/basic.test.ts) is already `describe.skip`ped pending Vue 3.6.
	//
	// Losing that environment also loses Nitro's virtual modules, so `nitropack/runtime` is
	// aliased to a mock below alongside the pre-existing `#internal/grafserv/*` mocks.
	//
	// If a test is added that genuinely needs the Nuxt runtime, split this into a projects-based
	// config and give that test its own `defineVitestProject({ environment: 'nuxt' })`, leaving
	// these node tests untouched.
	resolve: {
		alias: {
			'#internal/grafserv/resolvers': new URL('./test/mocks/resolvers.ts', import.meta.url).pathname,
			'#internal/grafserv/middleware': new URL('./test/mocks/middleware.ts', import.meta.url).pathname,
			'#internal/grafserv/pgl': new URL('./test/mocks/pgl.ts', import.meta.url).pathname,
			'#build/grafserv-preset': new URL('./test/mocks/preset.ts', import.meta.url).pathname,
			'nitropack/runtime': new URL('./test/mocks/nitropack-runtime.ts', import.meta.url).pathname,
		},
	},
	test: {
		environment: 'node',
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
