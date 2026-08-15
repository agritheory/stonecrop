import { describe, it, expect } from 'vitest'

import {
	buildRouteToSlugMap,
	resolveDoctypeSlugFromSegments,
	resolvePublicUrlSegment,
	resolveRouteView,
	resolveSlugFromRouteMap,
	shouldRejectRecordRoute,
} from '../src/runtime/app/composables/useDoctypeRoutes'

const transactionalRouteMap = buildRouteToSlugMap([
	['transactional-doctype-list', { route: '/transactional-doctype' }],
	['transactional-doctype', {}],
])

const singletonRouteMap = buildRouteToSlugMap([['singleton-doctype', { route: '/singleton-doctype' }]])

describe('route pattern matrix', { tags: ['unit', 'nuxt'] }, () => {
	describe('standard doctype (no route key)', () => {
		const routeToSlugMap = buildRouteToSlugMap([['customer', {}]])

		it('uses slug fallback for list and record URLs', () => {
			expect(resolveDoctypeSlugFromSegments(['customer'], routeToSlugMap)).toBe('customer')
			expect(resolveDoctypeSlugFromSegments(['customer', 'CUST-001'], routeToSlugMap)).toBe('customer')
			expect(resolveRouteView(['customer'], routeToSlugMap)).toBe('records')
			expect(resolveRouteView(['customer', 'CUST-001'], routeToSlugMap)).toBe('record')
		})
	})

	describe('transactional list + form split', () => {
		it('maps list view to the list doctype slug', () => {
			expect(resolveDoctypeSlugFromSegments(['transactional-doctype'], transactionalRouteMap)).toBe(
				'transactional-doctype-list'
			)
			expect(resolveRouteView(['transactional-doctype'], transactionalRouteMap)).toBe('records')
		})

		it('maps record view to the form doctype slug', () => {
			expect(resolveDoctypeSlugFromSegments(['transactional-doctype', '1'], transactionalRouteMap)).toBe(
				'transactional-doctype'
			)
			expect(resolveRouteView(['transactional-doctype', '1'], transactionalRouteMap)).toBe('record')
		})

		it('treats /new as a record view on the form doctype', () => {
			expect(resolveDoctypeSlugFromSegments(['transactional-doctype', 'new'], transactionalRouteMap)).toBe(
				'transactional-doctype'
			)
			expect(resolveRouteView(['transactional-doctype', 'new'], transactionalRouteMap)).toBe('record')
		})

		it('navigates using the public URL segment, not the internal list slug', () => {
			expect(resolvePublicUrlSegment('transactional-doctype-list', transactionalRouteMap)).toBe('transactional-doctype')
			expect(resolvePublicUrlSegment('transactional-doctype', transactionalRouteMap)).toBe('transactional-doctype')
		})
	})

	describe('singleton route-only form', () => {
		it('renders record view at the base URL', () => {
			expect(resolveDoctypeSlugFromSegments(['singleton-doctype'], singletonRouteMap)).toBe('singleton-doctype')
			expect(resolveRouteView(['singleton-doctype'], singletonRouteMap)).toBe('record')
		})

		it('404s record URLs for singleton doctypes', () => {
			expect(resolveRouteView(['singleton-doctype', '1'], singletonRouteMap)).toBe('notFound')
			expect(shouldRejectRecordRoute(['singleton-doctype', '1'], singletonRouteMap)).toBe(true)
		})
	})
})

describe('doctype route key resolution', { tags: ['unit', 'nuxt'] }, () => {
	it('maps explicit routes to registry slugs', () => {
		const routeToSlugMap = buildRouteToSlugMap([
			['sales-order-list', { route: '/sales-order' }],
			['sales-order', {}],
		])

		expect(routeToSlugMap.get('/sales-order')).toBe('sales-order-list')
	})

	it('resolveSlugFromRouteMap returns mapped slug for explicit route', () => {
		const routeToSlugMap = buildRouteToSlugMap([['sales-order-list', { route: '/sales-order' }]])

		expect(resolveSlugFromRouteMap('/sales-order', routeToSlugMap)).toBe('sales-order-list')
	})

	it('resolveSlugFromRouteMap falls back to path without leading slash', () => {
		const routeToSlugMap = buildRouteToSlugMap([])

		expect(resolveSlugFromRouteMap('/sales-order', routeToSlugMap)).toBe('sales-order')
	})

	it('resolveDoctypeSlugFromSegments uses route map for list views', () => {
		const routeToSlugMap = buildRouteToSlugMap([['sales-order-list', { route: '/sales-order' }]])

		expect(resolveDoctypeSlugFromSegments(['sales-order'], routeToSlugMap)).toBe('sales-order-list')
	})

	it('resolveDoctypeSlugFromSegments uses slug fallback for record views', () => {
		const routeToSlugMap = buildRouteToSlugMap([['sales-order-list', { route: '/sales-order' }]])

		expect(resolveDoctypeSlugFromSegments(['sales-order', 'SO-001'], routeToSlugMap)).toBe('sales-order')
	})

	it('resolveDoctypeSlugFromSegments preserves slug fallback for doctypes without route', () => {
		const routeToSlugMap = buildRouteToSlugMap([])

		expect(resolveDoctypeSlugFromSegments(['customer'], routeToSlugMap)).toBe('customer')
		expect(resolveDoctypeSlugFromSegments(['customer', 'CUST-001'], routeToSlugMap)).toBe('customer')
	})

	it('throws when route context has no path segment', () => {
		const routeToSlugMap = buildRouteToSlugMap([])

		expect(() => resolveDoctypeSlugFromSegments([], routeToSlugMap)).toThrow(
			'Cannot resolve doctype from route context'
		)
		expect(() => resolveRouteView([], routeToSlugMap)).toThrow('Cannot resolve doctype from route context')
	})

	it('uses last-wins semantics for conflicting explicit routes', () => {
		const routeToSlugMap = new Map<string, string>([
			['/shared-route', 'first-list'],
			['/shared-route', 'second-list'],
		])

		expect(routeToSlugMap.get('/shared-route')).toBe('second-list')
	})
})

describe('default module routing with route key', { tags: ['unit', 'nuxt'] }, () => {
	it('prefers explicit route over slug when generating pages', () => {
		const doctypes = [
			{
				fileName: 'SalesOrderList',
				data: { name: 'SalesOrderList', slug: 'sales-order-list', route: '/sales-order' },
				fields: [{ fieldname: 'name' }],
			},
		]

		const pages = doctypes.map(({ fileName, data, fields }) => {
			const route = data.route as string | undefined
			const slug = (data.slug as string) || fileName.toLowerCase()
			const path = route || `/${slug}`
			return {
				name: `stonecrop-${fileName}`,
				path,
				meta: { schema: fields, doctype: data, slug },
			}
		})

		expect(pages[0]!.path).toBe('/sales-order')
		expect(pages[0]!.meta).toMatchObject({ slug: 'sales-order-list' })
	})

	it('falls back to slug-based path when route is absent', () => {
		const doctypes = [
			{
				fileName: 'SalesOrder',
				data: { name: 'SalesOrder', slug: 'sales-order' },
				fields: [{ fieldname: 'name' }],
			},
		]

		const pages = doctypes.map(({ fileName, data, fields }) => {
			const route = data.route as string | undefined
			const slug = (data.slug as string) || fileName.toLowerCase()
			const path = route || `/${slug}`
			return {
				name: `stonecrop-${fileName}`,
				path,
				meta: { schema: fields, doctype: data, slug },
			}
		})

		expect(pages[0]!.path).toBe('/sales-order')
	})
})
