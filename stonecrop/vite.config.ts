import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

import { buildTask } from '../common/vite/build-task.ts'
import { testTags } from '../common/vite/test-tags.ts'

const projectRootDir = resolve(import.meta.dirname)

export default defineConfig({
	run: { tasks: buildTask('tsc') },
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
		tags: testTags,
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
