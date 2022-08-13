import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
	plugins: [HstVue()],
	storyIgnored: ['**/node_modules/**', '**/dist/**'],
})
