import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

// This package's tests all run in a plain `node` environment — NOT under @nuxt/test-utils'
// `defineVitestConfig`. That wrapper installs the Nuxt-client machinery (including the Vue SFC
// compiler) into vitest's Vite instance for every test it governs, which then breaks the
// @nuxt/test-utils/e2e `setup()` build with "MagicString is not a constructor"
// (nuxt/nuxt#34645; @vue/compiler-sfc@3.5.x's bare `require('magic-string')` resolves to the
// ESM namespace, not the constructor). Per the Nuxt maintainers, `defineVitestConfig` is only
// for tests that need the Nuxt client runtime — and none here do (the composable tests mock
// `nuxt/app`; the rest are pure logic or the e2e harness). If a test is added that genuinely
// needs the Nuxt runtime (e.g. `mountSuspended`), split this into a projects-based config and
// put that test in a `defineVitestProject({ environment: 'nuxt' })` project (which pulls in
// `happy-dom`), leaving the node/e2e tests here untouched.
export default defineConfig({
	resolve: {
		alias: {
			// grafast is not a dependency of this package (it belongs to consumer server
			// contexts), but the templates/fullstack resolver modules import it at top level.
			// The stub throws on any call — tests may exercise only the pure formatting helpers
			// those modules export.
			grafast: fileURLToPath(new URL('./test/stubs/grafast.ts', import.meta.url)),
		},
	},
	test: {
		environment: 'node',
		include: ['test/**/*.test.ts'],
		exclude: ['**/node_modules/**', '**/fixtures/**'],
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
				'**/fullstack/**',
				'**/templates/**',
				'**/bin/**',
				'**/*.config.*',
				'**/*.d.ts',
				'**/runtime/**', // Exclude runtime files that need Nuxt context
				'**/cli/installers/**', // Exclude installers - they need live file system and npm
				'**/cli/index.ts', // Main CLI orchestrator - interactive, hard to unit test
				'**/cli/prompts.ts', // Interactive prompts - hard to unit test
				'**/cli/utils/plugin.ts', // Plugin generator - needs file system operations
				'**/module.ts', // Main Nuxt module - requires full Nuxt integration for testing
				'**/plugins/symlinking.ts', // Skipping dev-only symlinking plugin
			],
			include: ['src/**/*.ts', 'src/**/*.js'],
			thresholds: {
				lines: 70,
				functions: 70,
				branches: 70,
				statements: 70,
			},
		},
	},
})
