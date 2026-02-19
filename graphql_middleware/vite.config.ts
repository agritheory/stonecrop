import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	plugins: [],
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
				'postgraphile',
				'postgraphile/utils',
				'postgraphile/grafast',
				'postgraphile/graphile-build',
				'@stonecrop/schema',
				'zod',
			],
		},
	},
})
