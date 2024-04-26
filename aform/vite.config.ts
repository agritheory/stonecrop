/// <reference types="histoire" />
/// <reference types="vitest" />

import { HstVue } from '@histoire/plugin-vue'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

const projectRootDir = resolve(__dirname)

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': resolve(projectRootDir, 'src'),
		},
	},
	build: {
		sourcemap: true,
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@stonecrop/aform',
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
	test: {
		globals: true,
		environment: 'jsdom',
		coverage: {
			provider: 'istanbul',
			reporter: ['text', 'json-summary', 'json'], // required for Github Actions CI
			reportOnFailure: true,
			skipFull: true,
			thresholds: {
				lines: 70,
				branches: 70,
				functions: 70,
				statements: 70,
				autoUpdate: true,
			},
			exclude: [
				...coverageConfigDefaults.exclude,
				'**/*.setup.ts', // ignore histoire setup files
				'src/index.ts', // ignore the entry file
				'src/components/form/AComboBox.vue', // ignore AComboBox template coverage
				'stories/**', // ignore histoire storybook files
				'types/**', // ignore types
			],
		},
	},
})
