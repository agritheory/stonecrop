import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

const projectRootDir = resolve(import.meta.dirname)

export default defineConfig({
	plugins: [vue()],
	build: {
		emptyOutDir: false,
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
