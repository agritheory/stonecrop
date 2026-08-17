import { describe, it, expect } from 'vitest'

import { buildDoctypeRoutes } from '../src/runtime/app/composables/useDoctypeRoutes'

describe('doctype route resolution', { tags: ['unit', 'nuxt'] }, () => {
	// The regression gate: a doctype declaring neither key routes exactly as it did before
	// `route`/`view` existed. Every other case in this file is opt-in.
	describe('doctype declaring neither route nor view', () => {
		const routes = buildDoctypeRoutes([['customer', {}]])

		it('serves its collection at /{slug} and its records below', () => {
			expect(routes.resolve(['customer'])).toEqual({ view: 'records', slug: 'customer', recordId: '' })
			expect(routes.resolve(['customer', 'CUST-001'])).toEqual({
				view: 'record',
				slug: 'customer',
				recordId: 'CUST-001',
			})
		})

		it('links to itself at its slug', () => {
			expect(routes.pathFor('customer')).toBe('customer')
		})
	})

	// The case the `-list` suffix broke: a doctype that only wants a different URL.
	describe('route as a plain alias', () => {
		const routes = buildDoctypeRoutes([['sales-order', { route: '/orders' }]])

		it('serves both the collection and its records under the alias', () => {
			expect(routes.resolve(['orders'])).toEqual({ view: 'records', slug: 'sales-order', recordId: '' })
			expect(routes.resolve(['orders', 'SO-001'])).toEqual({
				view: 'record',
				slug: 'sales-order',
				recordId: 'SO-001',
			})
		})

		it('stops serving the default slug path', () => {
			expect(routes.resolve(['sales-order']).view).toBe('notFound')
		})

		it('links through the alias', () => {
			expect(routes.pathFor('sales-order')).toBe('orders')
		})
	})

	// The worked example in the ticket: only the list projection is edited. `sales-order` declares
	// nothing and keeps reaching its records through its own slug path, as it did before.
	describe('adding a list projection over an existing doctype', () => {
		const routes = buildDoctypeRoutes([
			['sales-order-list', { route: '/sales-order', view: 'list' }],
			['sales-order', {}],
		])

		it('serves the curated list at the URL the projection claims', () => {
			expect(routes.resolve(['sales-order'])).toEqual({
				view: 'records',
				slug: 'sales-order-list',
				recordId: '',
			})
		})

		it('leaves the untouched doctype serving its own records', () => {
			expect(routes.resolve(['sales-order', 'SO-001'])).toEqual({
				view: 'record',
				slug: 'sales-order',
				recordId: 'SO-001',
			})
		})

		it('resolves the same either order the doctypes are read in', () => {
			const reversed = buildDoctypeRoutes([
				['sales-order', {}],
				['sales-order-list', { route: '/sales-order', view: 'list' }],
			])

			expect(reversed.resolve(['sales-order'])).toEqual(routes.resolve(['sales-order']))
			expect(reversed.resolve(['sales-order', 'SO-001'])).toEqual(routes.resolve(['sales-order', 'SO-001']))
		})
	})

	describe('list and form split across one route', () => {
		const routes = buildDoctypeRoutes([
			['sales-order-list', { route: '/orders', view: 'list' }],
			['sales-order', { route: '/orders', view: 'form' }],
		])

		it('serves the curated list doctype at the collection URL', () => {
			expect(routes.resolve(['orders'])).toEqual({ view: 'records', slug: 'sales-order-list', recordId: '' })
		})

		it('serves the full form doctype at the record URL', () => {
			expect(routes.resolve(['orders', 'SO-001'])).toEqual({
				view: 'record',
				slug: 'sales-order',
				recordId: 'SO-001',
			})
		})

		it('treats /new as a record on the form doctype', () => {
			expect(routes.resolve(['orders', 'new'])).toEqual({ view: 'record', slug: 'sales-order', recordId: 'new' })
		})

		it('links both doctypes to the shared path, so a list row opens the form URL', () => {
			expect(routes.pathFor('sales-order-list')).toBe('orders')
			expect(routes.pathFor('sales-order')).toBe('orders')
		})
	})

	describe('singleton', () => {
		const routes = buildDoctypeRoutes([['settings', { view: 'singleton' }]])

		it('serves its one record at the base path, without a route key', () => {
			expect(routes.resolve(['settings'])).toEqual({ view: 'record', slug: 'settings', recordId: '' })
		})

		it('has no addressable records below it', () => {
			expect(routes.resolve(['settings', '1']).view).toBe('notFound')
		})
	})

	// Invariant: no routing decision reads the shape of a name. `Price List` is a real doctype in
	// this domain and is not a list view of anything.
	describe('a doctype whose name ends in "List"', () => {
		const routes = buildDoctypeRoutes([['price-list', {}]])

		it('routes like any other doctype', () => {
			expect(routes.resolve(['price-list'])).toEqual({ view: 'records', slug: 'price-list', recordId: '' })
			expect(routes.resolve(['price-list', 'PL-001'])).toEqual({
				view: 'record',
				slug: 'price-list',
				recordId: 'PL-001',
			})
		})

		it('links to its own slug rather than a truncation of it', () => {
			expect(routes.pathFor('price-list')).toBe('price-list')
		})
	})

	describe('URLs nothing declares', () => {
		const routes = buildDoctypeRoutes([['customer', {}]])

		it('resolves the site root to the doctype list', () => {
			expect(routes.resolve([])).toEqual({ view: 'doctypes', slug: '', recordId: '' })
		})

		it('404s an unknown first segment', () => {
			expect(routes.resolve(['nope']).view).toBe('notFound')
			expect(routes.resolve(['nope', '1']).view).toBe('notFound')
		})

		it('404s a URL deeper than a record', () => {
			expect(routes.resolve(['customer', 'CUST-001', 'extra']).view).toBe('notFound')
		})

		it('404s a route that only declares a form', () => {
			const formOnly = buildDoctypeRoutes([['sales-order', { route: '/orders', view: 'form' }]])
			expect(formOnly.resolve(['orders']).view).toBe('notFound')
			expect(formOnly.resolve(['orders', 'SO-001']).view).toBe('record')
		})
	})

	describe('conflicting claims', () => {
		it('refuses two doctypes serving the same role at one path', () => {
			expect(() =>
				buildDoctypeRoutes([
					['first-list', { route: '/orders', view: 'list' }],
					['second-list', { route: '/orders', view: 'list' }],
				])
			).toThrow(/both serve the list view at '\/orders'/)
		})

		it('refuses a route that collides with another doctype default path', () => {
			expect(() =>
				buildDoctypeRoutes([
					['orders', {}],
					['sales-order', { route: '/orders' }],
				])
			).toThrow(/both serve the list view at '\/orders'/)
		})

		it('refuses a singleton sharing its path, in either order', () => {
			expect(() =>
				buildDoctypeRoutes([
					['settings', { view: 'singleton' }],
					['settings-list', { route: '/settings', view: 'list' }],
				])
			).toThrow(/shares\s+that path with nothing/)

			expect(() =>
				buildDoctypeRoutes([
					['settings-list', { route: '/settings', view: 'list' }],
					['settings', { view: 'singleton' }],
				])
			).toThrow(/shares\s+that path with nothing/)
		})

		// A neighbour that merely defaulted onto the path is refused too. Dropping it quietly in
		// the singleton's favour would take a doctype off the site with nothing said.
		it('refuses a singleton sharing its path with an undeclared neighbour', () => {
			expect(() =>
				buildDoctypeRoutes([
					['settings', { view: 'singleton' }],
					['legacy-settings', { route: '/settings' }],
				])
			).toThrow(/shares\s+that path with nothing/)
		})
	})
})
