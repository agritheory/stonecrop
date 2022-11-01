/// <reference types="histoire" />

import { HstVue } from '@histoire/plugin-vue'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

const projectRootDir = resolve(__dirname)

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': resolve(projectRootDir, 'src'),
		},
	},
	build: {
		minify: false,
		lib: {
			entry: resolve(projectRootDir, 'src/index.js'),
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
	histoire: {
		plugins: [HstVue()],
		storyIgnored: ['**/node_modules/**', '**/dist/**'],
	},
})
