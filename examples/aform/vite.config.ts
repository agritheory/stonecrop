/// <reference types="histoire" />

import { HstVue } from '@histoire/plugin-vue'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [vue()],
	histoire: {
		plugins: [HstVue()],
		setupFile: 'histoire.setup.ts',
		storyIgnored: ['**/node_modules/**', '**/dist/**'],
	},
})
