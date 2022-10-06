import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const projectRootDir = resolve(__dirname)

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': resolve(projectRootDir, 'src'),
		},
	},
	build: {
		sourcemap: true,
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@agritheory/aform',
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
})
