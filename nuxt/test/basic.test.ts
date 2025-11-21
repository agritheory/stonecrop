import { resolve } from 'node:path'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { describe, it, expect } from 'vitest'

describe('ssr', async () => {
	await setup({
		rootDir: resolve(__dirname, 'fixtures/basic'),
	})

	it('renders the index page', async () => {
		// Get response to a server-rendered page with `$fetch`.
		const html = await $fetch('/')
		expect(html).toContain('<div>basic</div>')
	})
})
