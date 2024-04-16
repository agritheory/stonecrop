import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

const resolveSCSSPath = () => {
	if (__dirname.endsWith('dev')) {
		return resolve(__dirname, 'variables.scss')
	} else if (__dirname.endsWith('src')) {
		return resolve(__dirname, './../dev/variables.scss')
	}
}

module.exports = {
	css: {
		preprocessorOptions: {
			scss: { additionalData: `@import "${resolveSCSSPath()}";` },
		},
	},
	build: {
		lib: {
			entry: resolve(__dirname, '../src/index.js'),
			name: '@stonecrop/beam',
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
