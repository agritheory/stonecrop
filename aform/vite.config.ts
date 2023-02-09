/// <reference types="histoire" />
/// <reference types="vitest" />

import { HstVue } from '@histoire/plugin-vue'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

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
		setupFile: '/src/histoire.setup.ts',
		storyIgnored: ['**/node_modules/**', '**/dist/**'],
	},
	test: {
		environment: 'jsdom',
		coverage: {
			lines: 5,
			branches: 5,
			functions: 5,
			statements: 5,
			// required for Github Actions CI
			reporter: ['text', 'json-summary', 'json'],
			reportsDirectory: './coverage',
			all: true,
			skipFull: true,
		},
	},
})
