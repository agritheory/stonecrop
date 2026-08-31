import { resolve } from 'node:path'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

import { buildTask } from '../common/vite/build-task'

export default defineConfig({
	plugins: [],
	run: { tasks: buildTask('tsc') },
	build: {
		emptyOutDir: true,
		// Libraries ship unminified; the consumer's bundler minifies.
		minify: false,
		sourcemap: true,
		lib: {
			entry: {
				index: resolve(import.meta.dirname, 'src/index.ts'),
				cli: resolve(import.meta.dirname, 'src/cli.ts'),
				// A third entry so rollup chunks by entry-reachability: `record.ts` and the field
				// descent it calls end up in chunks the Zod-bearing modules are not in. Consumers
				// still import from the package root — this only decides which file the code lands
				// in, and that decides whether pulling `unwrapInlineLinks` into a server bundle
				// drags Zod along with it. It does not, and must not: Zod in a Nitro SSR entry
				// collides with the `process` Nitro imports there and 500s every request.
				record: resolve(import.meta.dirname, 'src/record.ts'),
			},
			name: '@stonecrop/schema',
			formats: ['es'],
			fileName: (_format, entryName) => `${entryName}.js`,
		},
		rollupOptions: {
			external: ['zod', 'graphql', 'node:util', 'node:fs', 'node:path'],
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
		],
		environment: 'jsdom',
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
				'src/cli.ts', // ignore the CLI entry point
			],
		},
	},
})
