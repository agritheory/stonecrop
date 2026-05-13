import { resolve } from 'node:path'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [],
	build: {
		emptyOutDir: false,
		sourcemap: true,
		lib: {
			entry: {
				index: resolve(__dirname, 'src/index.ts'),
				cli: resolve(__dirname, 'src/cli.ts'),
			},
			name: '@stonecrop/schema',
			formats: ['es'],
			fileName: (_format, entryName) => `${entryName}.js`,
		},
		rollupOptions: {
			external: ['zod', 'graphql', 'node:util', 'node:fs', 'node:path'],
		},
	},
	test: {
		globals: true,
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
				'src/cli.ts', // ignore the CLI entry point
			],
		},
	},
})

// ci: baseline measurement
