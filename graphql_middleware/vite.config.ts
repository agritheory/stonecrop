import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	build: {
		emptyOutDir: false,
		sourcemap: true,
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: '@stonecrop/graphql-middleware',
			formats: ['es', 'cjs'],
			fileName: format => `index.${format === 'es' ? 'js' : 'cjs'}`,
		},
		rollupOptions: {
			external: [
				'node:fs',
				'node:path',
				'graphql',
				'pluralize',
				'postgraphile',
				'postgraphile/utils',
				'postgraphile/grafast',
				'postgraphile/graphile-build',
				'@stonecrop/schema',
				'zod',
			],
		},
	},
	test: {
		globals: true,
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
