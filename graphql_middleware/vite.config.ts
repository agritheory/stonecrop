import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

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
			external: ['node:fs', 'node:path', 'graphql', 'postgraphile', 'postgraphile/utils', 'postgraphile/grafast'],
		},
	},
})
