const vue =require('@vitejs/plugin-vue')
const path = require('path')

module.exports = {
	build: {
		minify: false,
		lib: {
			entry: path.resolve(__dirname, '../src/index.js'),
			name: '@sedum/aform'
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		},
		outDir: '../dist/'
	},
	plugins: [vue()]
}