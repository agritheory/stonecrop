import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
	// defineVitestConfig automatically sets up the correct environment
	// Don't override environment here - it breaks the automatic Nuxt environment setup
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
