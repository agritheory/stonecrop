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
	server: {
		fs: {
			allow: ['..'],
		},
	},
	build: {
		sourcemap: true,
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@agritheory/atable',
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
		setupFile: '/src/histoire.setup.ts',
		storyIgnored: ['**/node_modules/**', '**/dist/**'],
	},
})
