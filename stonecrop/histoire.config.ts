import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
	setupFile: '/stories/histoire.setup.ts',
	plugins: [HstVue()],
	storyIgnored: ['**/node_modules/**', '**/dist/**'],
})
