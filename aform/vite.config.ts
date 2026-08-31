import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

import { buildTask } from '../common/vite/build-task.ts'
import { testTags } from '../common/vite/test-tags.ts'

const projectRootDir = resolve(import.meta.dirname)

export default defineConfig({
	run: { tasks: buildTask('vue-tsc') },
	plugins: [vue(), libInjectCss()],
	build: {
		emptyOutDir: true,
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
		tags: testTags,
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
