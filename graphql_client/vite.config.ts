import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'

const projectRootDir = resolve(__dirname)

export default defineConfig({
	plugins: [dts({ rollupTypes: true, bundledPackages: ['stonecrop/*'] })],
	resolve: {
		alias: {
			'@': resolve(projectRootDir, 'src'),
			types: resolve(projectRootDir, 'src/types'),
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
