import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	plugins: [
		dts({
			insertTypesEntry: true,
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'StonecropGraphQLMiddleware',
			formats: ['es', 'cjs'],
			fileName: format => `index.${format === 'es' ? 'js' : 'cjs'}`,
		},
		rollupOptions: {
			external: [
				'node:fs',
				'node:path',
				'graphql',
				'pgsql-ast-parser',
				'postgraphile',
				'postgraphile/utils',
				'postgraphile/grafast',
				'zod',
			],
		},
	},
})
