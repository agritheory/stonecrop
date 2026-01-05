/// <reference types="vitest" />
import { coverageConfigDefaults, defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'CaslMiddleware',
			fileName: format => `index.${format === 'es' ? 'js' : 'cjs'}`,
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			external: [
				// Core dependencies
				'graphql',
				'graphql-tag',
				'@casl/ability',
				'@casl/prisma',

				// PostGraphile and related packages
				'postgraphile',
				'postgraphile/utils',
				'postgraphile/grafast',
				'postgraphile/presets/amber',
				'postgraphile/presets/v4',
				'postgraphile/adaptors/pg',
				'graphile-utils',
				'graphile-build',
				'graphile-config',
				'grafast',
				'@dataplan/pg',
				'pg-sql2',

				// GraphQL tools
				'@graphql-tools/schema',
				'@graphql-tools/utils',
				'@graphql-tools/merge',
				'graphql-middleware',
				'graphql-yoga',

				// Node.js built-ins
				/^node:/,
				'crypto',
				'util',
				'assert',
				'fs',
				'path',
			],
		},
		target: 'node18', // Change from 'esnext' to 'node18' since this is a Node.js library
		sourcemap: true,
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
			exclude: [...coverageConfigDefaults.exclude],
		},
	},
})
