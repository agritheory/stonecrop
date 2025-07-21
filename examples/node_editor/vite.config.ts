/// <reference types="histoire" />

import { HstVue } from '@histoire/plugin-vue'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
	server: {
		fs: {
			// Allow reading files from the Stonecrop root workspace
			allow: ['../..'],
		},
	},
	plugins: [vue()],
	histoire: {
		plugins: [HstVue()],
		storyIgnored: ['**/node_modules/**', '**/dist/**'],
	},
})
