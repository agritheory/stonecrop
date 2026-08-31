import { resolve } from 'path'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

import { buildTask } from '../common/vite/build-task.ts'
import { testTags } from '../common/vite/test-tags.ts'

const projectRootDir = resolve(import.meta.dirname)

export default defineConfig({
	run: { tasks: buildTask('tsc') },
	build: {
		emptyOutDir: true,
		// Libraries ship unminified; the consumer's bundler minifies.
		minify: false,
		sourcemap: true,
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@stonecrop/graphql-client',
			formats: ['es'],
		},
		rollupOptions: {
			// Externalize all bare imports so nothing is bundled into the library —
			// runtime dependencies (direct and transitive) are resolved by the host app.
			// Relative imports (local source files) are always kept in the bundle.
			external: (id: string) => !id.startsWith('.') && !id.startsWith('/'),
		},
	},
	test: {
		globals: true,
		tags: testTags,
		environment: 'jsdom',
		include: ['tests/**/*.{test,spec}.{ts,js}'],
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
				'src/types/**', // ignore types
			],
		},
	},
})
