import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { resolve } from 'path'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { configDefaults, coverageConfigDefaults, defineConfig } from 'vitest/config'

import { buildTask } from '../tools/vite/build-task.ts'
import { playwrightLaunchOptions } from '../tools/vite/playwright-launch-options.ts'
import { testTags } from '../tools/vite/test-tags.ts'

const projectRootDir = resolve(import.meta.dirname)

export default defineConfig({
	run: { tasks: buildTask('vue-tsc') },
	plugins: [vue(), libInjectCss()],
	build: {
		emptyOutDir: true,
		// Libraries ship unminified; the consumer's bundler minifies.
		minify: false,
		sourcemap: true,
		lib: {
			entry: resolve(projectRootDir, 'src/index.ts'),
			name: '@stonecrop/aform',
			formats: ['es'],
		},
		rollupOptions: {
			external: ['vue', 'pinia', /^@vueuse\//, /^@stonecrop\//, 'temporal-polyfill'],
			output: {
				chunkFileNames: 'chunks/[name].[hash].js',
				assetFileNames: 'assets/[name].[ext]',
				globals: {
					vue: 'Vue',
					pinia: 'pinia',
				},
			},
		},
	},
	test: {
		globals: true,
		tags: testTags,
		projects: [
			{
				extends: true,
				test: {
					name: 'jsdom',
					environment: 'jsdom',
					exclude: [...configDefaults.exclude, '**/*.browser.spec.ts'],
				},
			},
			// jsdom has no native date input: no calendar of its own, and no real focus or typing.
			{
				extends: true,
				test: {
					name: 'browser',
					include: ['tests/**/*.browser.spec.ts'],
					browser: {
						enabled: true,
						headless: true,
						// System Chrome when present (CI); otherwise Playwright's Chromium after
						// `pnpm exec playwright install chromium`. Locale fixes date-input segment order.
						provider: playwright({
							launchOptions: playwrightLaunchOptions(),
							contextOptions: { locale: 'en-US' },
						}),
						instances: [{ browser: 'chromium' }],
					},
				},
			},
		],
		coverage: {
			enabled: true,
			provider: 'istanbul',
			reporter: ['text', 'json-summary', 'json'], // required for Github Actions CI
			reportOnFailure: true,
			skipFull: true,
			thresholds: {
				lines: 70,
				branches: 70,
				functions: 70,
				statements: 70,
			},
			include: ['src/**/*.{ts,vue}'],
			exclude: [
				...coverageConfigDefaults.exclude,
				'src/index.ts', // ignore the entry file
				'types/**', // ignore types
			],
		},
	},
})
