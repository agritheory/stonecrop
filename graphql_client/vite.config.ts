import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'

const projectRootDir = resolve(__dirname)

export default defineConfig({
	plugins: [dts({ bundledPackages: ['stonecrop/*'] })],
	resolve: {
		alias: {
			'@': resolve(projectRootDir, 'src'),
		},
	},
	build: {
		sourcemap: true,
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@stonecrop/graphql-client',
		},
		rollupOptions: {},
	},
})
