import { resolve } from 'node:path'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [],
	run: {
		tasks: {
			// A task rather than a package.json script so `input` can exclude dist. The steps write
			// into dist and later ones read it, so tracking it as an input self-invalidates the cache
			// on every run.
			build: {
				command:
					'rm -rf dist && tsc -b --force && api-extractor run --local -c config/api-extractor.json && vite build --logLevel warn && node --run docs',
				input: [{ auto: true }, '!dist/**'],
				output: ['dist/**'],
			},
		},
	},
	build: {
		emptyOutDir: false,
		// Libraries ship unminified; the consumer's bundler minifies.
		minify: false,
		sourcemap: true,
		lib: {
			entry: {
				index: resolve(import.meta.dirname, 'src/index.ts'),
				cli: resolve(import.meta.dirname, 'src/cli.ts'),
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
