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
			// The templates/ and fullstack/ resolver modules import bare `grafast`, which is what a
			// consumer server context provides. This package doesn't depend on it directly, so the
			// specifier does not resolve here — but `postgraphile` is a devDependency and re-exports
			// the same module, which is exactly what those consumers get.
			//
			// This used to point at a stub that threw on every call, on the grounds that plan
			// resolvers must not execute in unit tests. That left the shipped scaffold resolvers
			// verifiable only by reading them. Pointing at the real thing lets templates-host.test.ts
			// build a schema and execute documents against it, so the code the CLI writes into
			// consumer apps is covered by the same kind of test as everything else.
			grafast: 'postgraphile/grafast',
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
