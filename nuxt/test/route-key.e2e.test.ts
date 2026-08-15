import { resolve } from 'node:path'

import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { describe, it, expect } from 'vitest'

describe('route key e2e fixture', { tags: ['e2e', 'nuxt'] }, async () => {
	await setup({
		rootDir: resolve(__dirname, 'fixtures/route-key'),
	})

	it('renders transactional list fields at the public list URL', async () => {
		const html = await $fetch('/transactional-doctype')

		expect(html).toContain('data-route-view>records')
		expect(html).toContain('List Column')
		expect(html).not.toContain('Form Detail')
	})

	it('renders transactional form fields at the record URL', async () => {
		const html = await $fetch('/transactional-doctype/1')

		expect(html).toContain('data-route-view>record')
		expect(html).toContain('Form Detail')
		expect(html).not.toContain('List Column')
	})

	it('renders singleton form fields at the base URL', async () => {
		const html = await $fetch('/singleton-doctype')

		expect(html).toContain('data-route-view>record')
		expect(html).toContain('Singleton Setting')
	})

	it('returns 404 for singleton record URLs', async () => {
		await expect($fetch('/singleton-doctype/1')).rejects.toMatchObject({ statusCode: 404 })
	})

	it('renders standard list view for slug-based doctypes', async () => {
		const html = await $fetch('/customer')

		expect(html).toContain('data-route-view>records')
		expect(html).toContain('Customer Name')
	})
})
