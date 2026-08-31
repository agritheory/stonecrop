import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

import { buildTask } from '../common/vite/build-task.ts'
import { testTags } from '../common/vite/test-tags.ts'

const projectRootDir = resolve(import.meta.dirname)

export default defineConfig({
	run: { tasks: buildTask('vue-tsc') },
	plugins: [vue()],
	build: {
		emptyOutDir: true,
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
		tags: testTags,
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
