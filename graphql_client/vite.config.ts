import { resolve } from 'path'
import { defineConfig } from 'vite'

const projectRootDir = resolve(__dirname)

export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(projectRootDir, 'src'),
			types: resolve(projectRootDir, 'src/types'),
		},
	},
	build: {
		emptyOutDir: false,
		sourcemap: true,
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@stonecrop/graphql-client',
		},
		rollupOptions: {},
	},
})
