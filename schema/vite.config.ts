import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [
		dts({
			include: ['src/**/*'],
			rollupTypes: true,
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'StonecropSchema',
			formats: ['es', 'cjs'],
			fileName: format => `index.${format === 'es' ? 'js' : 'cjs'}`,
		},
		rollupOptions: {
			external: ['zod'],
		},
	},
})
