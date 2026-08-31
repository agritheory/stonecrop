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
			name: '@stonecrop/rockfoil',
			formats: ['es'],
		},
		rollupOptions: {
			// Externalize all bare imports (Node.js built-ins, graphql, postgraphile) so nothing
			// is bundled into the library — bundling graphql would create a second graphql realm
			// and break instanceof checks in the host's postgraphile plugin chain.
			external: (id: string) => !id.startsWith('.') && !id.startsWith('/'),
		},
	},
	test: {
		globals: true,
		tags: testTags,
		environment: 'jsdom',
		coverage: {
			enabled: true,
			provider: 'istanbul',
			reporter: ['text', 'json-summary', 'json', 'html'], // required for Github Actions CI
			reportOnFailure: true,
			skipFull: true,
			thresholds: {
				lines: 30,
				branches: 30,
				functions: 30,
				statements: 30,
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
