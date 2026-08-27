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
			build: {
				command:
					'rm -rf dist && tsc -b --force && api-extractor run --local -c config/api-extractor.json && vite build --logLevel warn && node --run docs',
				input: [{ auto: true }, '!dist/**'],
				output: ['dist/**'],
			},
		},
	},
	plugins: [vue()],
	build: {
		emptyOutDir: false,
		// Libraries ship unminified; the consumer's bundler minifies.
		minify: false,
		sourcemap: true,
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@stonecrop/code-editor',
			formats: ['es'],
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
	test: {
		globals: true,
		tags: [
			{ name: 'unit', description: 'Pure logic test — no DOM, network, or framework runtime.' },
			{ name: 'component', description: 'Vue component test using jsdom + @vue/test-utils.' },
		],
		environment: 'jsdom',
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
			exclude: [...coverageConfigDefaults.exclude, 'src/index.ts'],
		},
	},
})
