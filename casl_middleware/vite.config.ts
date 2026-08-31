import { resolve } from 'path'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

import { buildTask } from '../common/vite/build-task.ts'
import { testTags } from '../common/vite/test-tags.ts'

const projectRootDir = resolve(import.meta.dirname)

// https://vitejs.dev/config/
export default defineConfig({
	run: { tasks: buildTask('tsc') },
	build: {
		emptyOutDir: true,
		// Libraries ship unminified; the consumer's bundler minifies.
		minify: false,
		sourcemap: true,
		// Server-side library - only output ES modules
		target: 'node18',
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@stonecrop/casl-middleware',
			formats: ['es'],
		},
		rollupOptions: {
			// Externalize dependencies - they should not be bundled into the library
			external: [
				/^node:/,
				'assert',
				'util',
				'crypto',
				'grafast',
				'graphql',
				'graphql-tag',
				'jsonwebtoken',
				'@casl/ability',
				'postgraphile',
				/^postgraphile\//,
				'graphql-yoga',
			],
		},
	},
	test: {
		globals: true,
		tags: testTags,
		environment: 'jsdom',
		include: ['tests/**/*.test.ts'],
		exclude: ['node_modules', 'dist', 'tests/setup.ts', 'tests/helpers/**'],
		setupFiles: ['./tests/setup.ts'],
		coverage: {
			enabled: true,
			provider: 'istanbul',
			reporter: ['text', 'json-summary', 'json', 'html'], // required for Github Actions CI
			reportOnFailure: true,
			skipFull: true,
			thresholds: {
				lines: 70,
				branches: 70,
				functions: 70,
				statements: 70,
			},
			include: ['src/**/*.ts'],
			exclude: [
				...coverageConfigDefaults.exclude,
				'src/index.ts', // ignore the entry file
				'types/**', // ignore types
			],
		},
	},
})
