import { describe, it, expect } from 'vitest'

import { declaredRoutePages } from '../src/routes'
import type { ParsedDoctype } from '../src/types'

/**
 * Which doctypes the module registers a page for.
 *
 * A doctype declares its own URL or has none. Nothing is derived from the slug any more: a doctype
 * may exist only to be rendered inside another — a child table, a link target — and giving every
 * file in the directory a page put those at URLs nothing could navigate to, while registering the
 * entity and its aggregate at two paths that looked identical to the shell.
 */

const doctype = (fileName: string, data: Record<string, unknown>): ParsedDoctype => ({
	fileName,
	data,
	fields: [{ fieldname: 'name' }],
})

const COMPONENT = '/pages/Doctype.vue'

describe('declaredRoutePages', { tags: ['unit', 'nuxt'] }, () => {
	it('registers a page at the path the doctype declares', () => {
		const { pages } = declaredRoutePages([doctype('order', { slug: 'order', route: '/order/:id' })], COMPONENT)
		expect(pages.map(p => p.path)).toEqual(['/order/:id'])
	})

	it('registers the pair at one segment, the collection and the record', () => {
		const { pages } = declaredRoutePages(
			[
				doctype('order', { slug: 'order', route: '/order/:id' }),
				doctype('orders', { slug: 'orders', route: '/order' }),
			],
			COMPONENT
		)
		expect(pages.map(p => p.path).sort()).toEqual(['/order', '/order/:id'])
	})

	it('registers nothing for a doctype with no route, and reports it', () => {
		const { pages, skipped } = declaredRoutePages(
			[doctype('order-line', { slug: 'order-line' }), doctype('order', { slug: 'order', route: '/order/:id' })],
			COMPONENT
		)
		expect(pages.map(p => p.path)).toEqual(['/order/:id'])
		expect(skipped).toEqual(['order-line'])
	})

	it('does not fall back to the slug', () => {
		// The old default. A doctype without a route is not a doctype at `/its-slug`.
		const { pages } = declaredRoutePages([doctype('order-line', { slug: 'order-line' })], COMPONENT)
		expect(pages).toEqual([])
	})

	it('carries the doctype and its fields in meta, so the shell needs no lookup', () => {
		const data = { slug: 'order', route: '/order/:id' }
		const { pages } = declaredRoutePages([doctype('order', data)], COMPONENT)
		expect(pages[0]!.meta).toEqual({ schema: [{ fieldname: 'name' }], doctype: data })
		expect(pages[0]!.file).toBe(COMPONENT)
		expect(pages[0]!.name).toBe('stonecrop-order')
	})

	it('ignores a route that is not a path', () => {
		// The load gate refuses one, but the module reads files it never validated.
		const { pages, skipped } = declaredRoutePages([doctype('order', { slug: 'order', route: 'order' })], COMPONENT)
		expect(pages).toEqual([])
		expect(skipped).toEqual(['order'])
	})
})
