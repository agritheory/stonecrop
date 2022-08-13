import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

module.exports = {
	build: {
		lib: {
			entry: resolve(__dirname, '../src/index.js'),
			name: '@sedum/desktop',
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},
		outDir: '../dist/',
	},
	plugins: [vue()],
}
