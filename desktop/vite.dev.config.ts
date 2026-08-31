import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

const packageRoot = resolve(__dirname)

export default defineConfig({
	plugins: [vue()],
	root: resolve(packageRoot, 'dev'),
	resolve: {
		alias: {
			'@stonecrop/desktop': resolve(packageRoot, 'src'),
		},
	},
	server: {
		port: 5174,
		open: true,
	},
})
