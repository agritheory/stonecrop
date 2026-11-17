import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { describe, it, expect } from 'vitest'

// Runs in the `node` vitest project (see vitest.config.ts). It must NOT run under the
// Nuxt-client environment: that pulls @vue/compiler-sfc into vitest's Vite instance and
// breaks setup()'s build with "MagicString is not a constructor" (nuxt/nuxt#34645).
describe('ssr', { tags: ['e2e', 'nuxt'] }, async () => {
	await setup({
		rootDir: resolve(__dirname, 'fixtures/basic'),
	})

	it('renders the index page', async () => {
		// Get response to a server-rendered page with `$fetch`.
		const html = await $fetch('/')
		expect(html).toContain('<div>basic</div>')
	})

	it('serves Monaco itself, so a code editor needs no CDN', async () => {
		// The files are cached for a year, so the path carries the version: an upgrade must not mix files.
		const { version } = createRequire(import.meta.url)('monaco-editor/package.json') as { version: string }
		const loader = await $fetch<string>(`/stonecrop-monaco/${version}/vs/loader.js`, { responseType: 'text' })
		expect(loader).toContain('AMDLoader')
	})
})
