/// <reference types="vitest" />

import { coverageConfigDefaults, defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
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
			exclude: [...coverageConfigDefaults.exclude],
		},
	},
})
