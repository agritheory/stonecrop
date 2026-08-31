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
			// `vue-tsc`, not `tsc`: plain tsc resolves an SFC through the ambient `*.vue` shim and
			// emits no declaration for it, so every component shipped as `ComponentOptions` — `any`
			// to a consumer, with the rollup importing `.vue` paths absent from the tarball.
			//
			// Vite runs first so `emptyOutDir` clears dist. A leading `rm -rf dist` is its own cached
			// sub-task, and a cache hit replays a snapshot instead of deleting, so stale chunks shipped.
			build: {
				command:
					'vite build --logLevel warn && vue-tsc -b --force && api-extractor run --local -c config/api-extractor.json && node --run docs',
				input: [{ auto: true }, '!dist/**'],
				output: ['dist/**'],
			},
		},
	},
	plugins: [vue()],
	build: {
		emptyOutDir: true,
		// Libraries ship unminified; the consumer's bundler minifies.
		minify: false,
		sourcemap: true,
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@stonecrop/node-editor',
			formats: ['es'],
		},
		rollupOptions: {
			external: ['vue', 'vue-router', /^@stonecrop\//, /^@vue-flow\//, '@dagrejs/dagre'],
			output: {
				globals: {
					vue: 'Vue',
					'vue-router': 'VueRouter',
				},
			},
		},
	},
	test: {
		globals: true,
		tags: [{ name: 'unit', description: 'Pure logic test — no DOM, network, or framework runtime.' }],
		environment: 'node',
		coverage: {
			enabled: true,
			provider: 'istanbul',
			reporter: ['text', 'json-summary', 'json'],
			reportOnFailure: true,
			skipFull: true,
			thresholds: {
				lines: 70,
				branches: 70,
				functions: 70,
				statements: 70,
			},
			include: ['src/**/*.{ts,vue}'],
			exclude: [...coverageConfigDefaults.exclude, 'src/index.ts', 'src/components/**'],
		},
	},
})
