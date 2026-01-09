import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [HstVue()],
	setupFile: './histoire.setup.ts',
	storyMatch: ['**/*.story.vue'],
	// CSS isolation for sandbox previews
	sandboxDarkClass: 'dark',
	tree: {
		groups: [
			{
				id: 'aform',
				title: 'AForm',
				include: file => file.path.includes('aform/'),
			},
			{
				id: 'atable',
				title: 'ATable',
				include: file => file.path.includes('atable/'),
			},
			{
				id: 'beam',
				title: 'Beam',
				include: file => file.path.includes('beam/'),
			},
			{
				id: 'code_editor',
				title: 'Code Editor',
				include: file => file.path.includes('code_editor/'),
			},
			{
				id: 'node_editor',
				title: 'Node Editor',
				include: file => file.path.includes('node_editor/'),
			},
		],
	},
	theme: {
		title: 'Stonecrop',
		logo: {
			square: '/logo.svg',
			light: '/logo.svg',
			dark: '/logo.svg',
		},
		logoHref: '/',
		colors: {
			primary: {
				50: '#f0f9f0',
				100: '#dcf1dc',
				200: '#bce3bc',
				300: '#8fce8f',
				400: '#6b9f6b',
				500: '#5a8a5a',
				600: '#4a7a4a',
				700: '#3a6a3a',
				800: '#2d5a2d',
				900: '#244a24',
			},
		},
	},
	vite: {
		plugins: [vue()],
		base: '/stories/',
	},
	// For static deployment within docs
	routerMode: 'hash',
	outDir: '../docs/public/stories',
})
