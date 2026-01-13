/// <reference types="vitest" />

import { resolve } from 'path'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

const projectRootDir = resolve(__dirname)

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		emptyOutDir: false,
		sourcemap: true,
		// Server-side library - only output ES modules
		target: 'node18',
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@stonecrop/casl-middleware',
			formats: ['es'],
		},
		rollupOptions: {
			// Externalize Node.js built-ins for server-side library
			external: [/^node:/, 'assert', 'util', 'crypto'],
		},
	},
	test: {
		globals: true,
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
