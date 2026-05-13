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
			name: '@stonecrop/rockfoil',
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
