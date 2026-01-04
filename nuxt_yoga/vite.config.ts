/// <reference types="vitest" />

import { coverageConfigDefaults, defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		exclude: [
			'**/node_modules/**',
			'**/dist/**',
			'**/cypress/**',
			'**/.{idea,git,cache,output,temp}/**',
			'**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
			'**/playground/**',
			'**/.nuxt/**',
		],
		coverage: {
			enabled: true,
			provider: 'istanbul',
			reporter: ['text', 'json-summary', 'json', 'html'], // required for Github Actions CI
			reportOnFailure: true,
			skipFull: true,
			thresholds: {
				lines: 1,
				branches: 1,
				functions: 1,
				statements: 1,
			},
			exclude: [...coverageConfigDefaults.exclude, '**/playground/**'],
		},
	},
})
