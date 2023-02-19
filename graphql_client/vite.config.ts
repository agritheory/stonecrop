import { resolve } from 'path'
import { defineConfig } from 'vite'

const projectRootDir = resolve(__dirname)

export default defineConfig({
	plugins: [],
	resolve: {
		alias: {
			'@': resolve(projectRootDir, 'src'),
		},
	},
	build: {
		sourcemap: true,
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@agritheory/graphql-client',
		},
		rollupOptions: {},
	},
	histoire: {
		plugins: [],
		storyIgnored: ['**/node_modules/**', '**/dist/**'],
	},
})
