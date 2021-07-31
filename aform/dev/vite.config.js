const vue =require('@vitejs/plugin-vue')
const path = require('path')

module.exports = {
	build: {
		lib: {
			entry: path.resolve(__dirname, '../src/index.js'),
			name: 'AForm'
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		}
	},
	plugins: [vue()]
}