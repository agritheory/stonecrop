import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

const projectRootDir = resolve(import.meta.dirname)

export default defineConfig({
	run: {
		tasks: {
			// A task rather than a package.json script so `input` can exclude dist. The steps write
			// into dist and later ones read it, so tracking it as an input self-invalidates the cache
			// on every run.
			//
			// `vue-tsc`, not `tsc`: plain tsc resolves an SFC through the ambient `*.vue` shim and
			// emits no declaration for it, so every component shipped as `ComponentOptions` — `any`
			// to a consumer, with the rollup importing `.vue` paths absent from the tarball.
			build: {
				command:
					'rm -rf dist && vue-tsc -b --force && api-extractor run --local -c config/api-extractor.json && vite build --logLevel warn && node --run docs',
				input: [{ auto: true }, '!dist/**'],
				output: ['dist/**'],
			},
		},
	},
	plugins: [vue(), libInjectCss()],
	build: {
		emptyOutDir: false,
		// Libraries ship unminified; the consumer's bundler minifies.
		minify: false,
		sourcemap: true,
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@stonecrop/aform',
			formats: ['es'],
		},
		rollupOptions: {
			external: ['vue', 'pinia', /^@vueuse\//, /^@stonecrop\//],
			output: {
				chunkFileNames: 'chunks/[name].[hash].js',
				assetFileNames: 'assets/[name].[ext]',
				globals: {
					vue: 'Vue',
					pinia: 'pinia',
				},
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
