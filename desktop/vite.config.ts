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
			name: '@stonecrop/desktop',
			formats: ['es'],
		},
		rollupOptions: {
			// Pinia must stay external so this package shares the host app's single Pinia instance
			// (bundling it gave Desktop its own never-activated Pinia — the field-validation bug).
			// vue-router is listed pre-emptively and is inert today: nothing under src/ imports it,
			// because Desktop routes through the `routeAdapter` prop instead. If that ever changes,
			// this is what makes the mistake loud (an unresolved import) rather than silent (a
			// second copy of the router bundled in, injecting against its own keys — the Pinia bug
			// again). It is not a peerDependency, because this package genuinely does not need one.
			external: ['vue', 'pinia', 'vue-router', /^@stonecrop\//],
			output: {
				globals: {
					vue: 'Vue',
					pinia: 'Pinia',
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
