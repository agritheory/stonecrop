import { resolve } from 'node:path'

import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { describe, it, expect } from 'vitest'

describe('route key e2e fixture', { tags: ['e2e', 'nuxt'] }, async () => {
	await setup({
		rootDir: resolve(__dirname, 'fixtures/route-key'),
	})

	it('renders the curated list schema at the projected list URL', async () => {
		const html = await $fetch('/transactional-doctype')

		expect(html).toContain('data-route-view>records<')
		expect(html).toContain('List Column')
		expect(html).not.toContain('Form Detail')
	})

	it('renders the full form schema at the record URL of the same path', async () => {
		const html = await $fetch('/transactional-doctype/1')

		expect(html).toContain('data-route-view>record<')
		expect(html).toContain('Form Detail')
		expect(html).not.toContain('List Column')
	})

	it('renders singleton form fields at the base URL', async () => {
		const html = await $fetch('/singleton-doctype')

		expect(html).toContain('data-route-view>record<')
		expect(html).toContain('Singleton Setting')
	})

	it('returns 404 for singleton record URLs', async () => {
		await expect($fetch('/singleton-doctype/1')).rejects.toMatchObject({ statusCode: 404 })
	})

	// A `route` with no `view` is a plain alias: it moves both the collection and its records.
	it('renders both views of an aliased doctype under its alias', async () => {
		const list = await $fetch('/aliased')
		expect(list).toContain('data-route-view>records<')
		expect(list).toContain('Aliased Value')

		const record = await $fetch('/aliased/A-1')
		expect(record).toContain('data-route-view>record<')
		expect(record).toContain('data-record-id>A-1')
		expect(record).toContain('Aliased Value')
	})

	it('returns 404 at the slug path an alias replaced', async () => {
		await expect($fetch('/aliased-doctype')).rejects.toMatchObject({ statusCode: 404 })
	})

	it('renders standard list view for slug-based doctypes', async () => {
		const html = await $fetch('/customer')

		expect(html).toContain('data-route-view>records<')
		expect(html).toContain('Customer Name')
	})
})
