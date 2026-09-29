import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

import { playwrightLaunchOptions } from '../tools/vite/playwright-launch-options.ts'

// Two projects: `node` for everything but layout, and `browser` for `*.browser.test.ts`, which mounts
// runtime components in real Chrome. Neither runs under @nuxt/test-utils' `defineVitestConfig`.
// That wrapper installs the Nuxt-client machinery (including the Vue SFC compiler) into vitest's
// Vite instance for every test it governs, which then breaks the @nuxt/test-utils/e2e `setup()`
// build with "MagicString is not a constructor" (nuxt/nuxt#34645; @vue/compiler-sfc@3.5.x's bare
// `require('magic-string')` resolves to the ESM namespace, not the constructor). The Vue plugin
// therefore sits on the browser project alone, which has its own Vite instance. If a test is added
// that genuinely needs the Nuxt runtime (e.g. `mountSuspended`), put it in a
// `defineVitestProject({ environment: 'nuxt' })` project (which pulls in `happy-dom`), leaving the
// node/e2e tests untouched.
export default defineConfig({
	resolve: {
		alias: {
			// The templates/ and fixtures/fullstack/ resolver modules import bare `grafast`, which is what a
			// consumer server context provides. This package doesn't depend on it directly, so the
			// specifier does not resolve here — but `postgraphile` is a devDependency and re-exports
			// the same module, which is exactly what those consumers get.
			//
			// This used to point at a stub that threw on every call, on the grounds that plan
			// resolvers must not execute in unit tests. That left the shipped scaffold resolvers
			// verifiable only by reading them. Pointing at the real thing lets templates-host.test.ts
			// build a schema and execute documents against it, so the code the CLI writes into
			// consumer apps is covered by the same kind of test as everything else.
			grafast: 'postgraphile/grafast',
		},
	},
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: 'node',
					environment: 'node',
					include: ['test/**/*.test.ts'],
					exclude: ['**/node_modules/**', '**/fixtures/**', '**/*.browser.test.ts'],
				},
			},
			// A width is only computed by a real browser: node has no layout at all.
			{
				extends: true,
				plugins: [vue()],
				test: {
					name: 'browser',
					include: ['test/**/*.browser.test.ts'],
					browser: {
						enabled: true,
						headless: true,
						// System Chrome when present (CI); otherwise Playwright's Chromium after
						// `pnpm exec playwright install chromium`.
						provider: playwright({ launchOptions: playwrightLaunchOptions() }),
						instances: [{ browser: 'chromium' }],
					},
				},
			},
		],
		tags: [
			{ name: 'unit', description: 'Pure logic test — no DOM, network, or framework runtime.' },
			{ name: 'component', description: 'Vue component test using jsdom + @vue/test-utils.' },
			{
				name: 'e2e',
				timeout: 30_000,
				description: 'Spins up a real server or Nuxt runtime. Run in integration gate only.',
			},
			{
				name: 'nuxt',
				timeout: 30_000,
				description: 'Involves the Nuxt module, plugin, composables, or @nuxt/test-utils.',
			},
			{ name: 'graphql', description: 'Involves GraphQL schema, queries, resolvers, or PostGraphile.' },
		],
		coverage: {
			enabled: true,
			provider: 'istanbul',
			reporter: ['text', 'json', 'html', 'lcov'],
			exclude: [
				'**/node_modules/**',
				'**/dist/**',
				'**/.nuxt/**',
				'**/coverage/**',
				'**/test/**',
				'**/playground/**',
				'**/documentation/**',
				'**/templates/**',
				'**/bin/**',
				'**/*.config.*',
				'**/*.d.ts',
				'**/runtime/**', // Exclude runtime files that need Nuxt context
				'**/cli/installers/**', // Exclude installers - they need live file system and npm
				'**/cli/index.ts', // Main CLI orchestrator - interactive, hard to unit test
				'**/cli/prompts.ts', // Interactive prompts - hard to unit test
				'**/cli/utils/plugin.ts', // Plugin generator - needs file system operations
				'**/module.ts', // Main Nuxt module - requires full Nuxt integration for testing
			],
			include: ['src/**/*.ts', 'src/**/*.js'],
			thresholds: {
				lines: 70,
				functions: 70,
				branches: 70,
				statements: 70,
			},
		},
	},
})
