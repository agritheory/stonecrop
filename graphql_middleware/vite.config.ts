import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	build: {
		emptyOutDir: false,
		sourcemap: true,
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: '@stonecrop/graphql-middleware',
			formats: ['es'],
			fileName: () => 'index.js',
		},
		rollupOptions: {
			// Externalize every package import — this is a server-only library and all
			// runtime dependencies (direct and transitive) are resolved by the host app.
			// Relative imports (local source files) are always kept in the bundle.
			external: (id: string) => !id.startsWith('.') && !id.startsWith('/'),
		},
	},
	test: {
		globals: true,
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
			{
				name: 'integration',
				timeout: 60_000,
				description: 'Requires a live PostgreSQL database. Skipped in CI environments without a database.',
			},
		],
		environment: 'jsdom',
		include: ['tests/**/*.{test,spec}.{ts,js}'],
		coverage: {
			enabled: true,
			provider: 'istanbul',
			reporter: ['text', 'json-summary', 'json'], // required for Github Actions CI
			reportOnFailure: true,
			skipFull: true,
			thresholds: {
				lines: 70,
				branches: 70,
				functions: 70,
				statements: 70,
			},
			include: ['src/**/*.{ts,vue}'],
			exclude: [
				...coverageConfigDefaults.exclude,
				'src/index.ts', // ignore the entry file
				'src/types/**', // ignore types
				'src/typeDefs.ts', // ignore gql type definitions
			],
		},
	},
})
