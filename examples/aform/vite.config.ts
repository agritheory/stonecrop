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
			'@': resolve(projectRootDir, 'aform'),
		},
	},
	histoire: {
		plugins: [HstVue()],
		setupFile: 'histoire.setup.ts',
		storyIgnored: ['**/node_modules/**', '**/dist/**'],
	},
})
