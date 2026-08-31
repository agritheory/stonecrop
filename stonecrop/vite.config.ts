import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

const projectRootDir = resolve(import.meta.dirname)

export default defineConfig({
	run: {
		tasks: {
			// A task rather than a package.json script so `input` can exclude dist. The steps write
			// into dist and later ones read it, so tracking it as an input self-invalidates the cache
			// on every run.
			//
			// Vite runs first so `emptyOutDir` clears dist. A leading `rm -rf dist` is its own cached
			// sub-task, and a cache hit replays a snapshot instead of deleting, so stale chunks shipped.
			build: {
				command:
					'vite build --logLevel warn && tsc -b --force && api-extractor run --local -c config/api-extractor.json && node --run docs',
				input: [{ auto: true }, '!dist/**'],
				output: ['dist/**'],
			},
		},
	},
	plugins: [vue()],
	optimizeDeps: { exclude: ['@stonecrop/atable', '@stonecrop/aform'] },
	build: {
		emptyOutDir: true,
		// Libraries ship unminified; the consumer's bundler minifies.
		minify: false,
		sourcemap: true,
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@stonecrop/stonecrop',
			formats: ['es'],
		},
		rollupOptions: {
			external: [
				'vue',
				'pinia',
				'vue-router',
				/^@vueuse\//,
				/^@stonecrop\//,
				'immutable',
				'pinia-shared-state',
				'xstate',
			],
			output: {
				globals: {
					vue: 'Vue',
					pinia: 'pinia',
					'vue-router': 'VueRouter',
				},
			},
			onwarn(warning, warn) {
				// Suppress the mixed exports warning since it's expected for Vue plugins
				if (warning.code === 'MIXED_EXPORTS') return
				warn(warning)
			},
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
		setupFiles: ['./tests/setup.ts'],
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
				'types/**', // ignore types
			],
		},
	},
})
