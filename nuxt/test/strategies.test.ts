import { describe, it, expect } from 'vitest'

import { singleStrategy, resourceStrategy, resolveStrategy } from '../src/strategies'
import type { ParsedDoctype, PageResolver, RouteStrategyFn } from '../src/strategies'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeResolver: PageResolver = (pageName: string) => `/resolved/${pageName}`

function doctype(overrides: Partial<ParsedDoctype> & Pick<ParsedDoctype, 'fileName'>): ParsedDoctype {
	return {
		data: {},
		fields: [{ fieldname: 'name', fieldtype: 'Data' }],
		...overrides,
	}
}

// ---------------------------------------------------------------------------
// singleStrategy
// ---------------------------------------------------------------------------

describe('singleStrategy', () => {
	it('generates one route per doctype using slug', () => {
		const doctypes = [doctype({ fileName: 'User', data: { slug: 'user/:id' } })]
		const pages = singleStrategy(doctypes, makeResolver)

		expect(pages).toHaveLength(1)
		expect(pages[0]!.path).toBe('/user/:id')
		expect(pages[0]!.file).toBe('/resolved/StonecropPage.vue')
		expect(pages[0]!.name).toBe('stonecrop-User')
	})

	it('falls back to lowercase filename when no slug', () => {
		const doctypes = [doctype({ fileName: 'OrderItem' })]
		const pages = singleStrategy(doctypes, makeResolver)

		expect(pages[0]!.path).toBe('/orderitem')
	})

	it('passes schema and doctype as route meta', () => {
		const fields = [{ fieldname: 'email', fieldtype: 'Data' }]
		const data = { name: 'User', slug: 'user' }
		const doctypes = [doctype({ fileName: 'User', data, fields })]
		const pages = singleStrategy(doctypes, makeResolver)

		expect(pages[0]!.meta).toEqual({ schema: fields, doctype: data })
	})

	it('handles multiple doctypes', () => {
		const doctypes = [
			doctype({ fileName: 'user-table', data: { slug: 'user' } }),
			doctype({ fileName: 'User', data: { slug: 'user/:id' } }),
			doctype({ fileName: 'role', data: { slug: 'role' } }),
		]
		const pages = singleStrategy(doctypes, makeResolver)

		expect(pages).toHaveLength(3)
		expect(pages.map(p => p.path)).toEqual(['/user', '/user/:id', '/role'])
	})

	it('returns empty array for empty doctype list', () => {
		expect(singleStrategy([], makeResolver)).toEqual([])
	})
})

// ---------------------------------------------------------------------------
// resourceStrategy
// ---------------------------------------------------------------------------

describe('resourceStrategy', () => {
	it('generates list and detail routes per doctype', () => {
		const doctypes = [doctype({ fileName: 'User', data: { name: 'User', slug: 'user' } })]
		const pages = resourceStrategy(doctypes, makeResolver)

		expect(pages).toHaveLength(2)
		expect(pages[0]!.path).toBe('/user')
		expect(pages[0]!.name).toBe('stonecrop-User-list')
		expect(pages[0]!.file).toBe('/resolved/StonecropListPage.vue')
		expect(pages[0]!.meta).toMatchObject({ viewMode: 'list' })

		expect(pages[1]!.path).toBe('/user/:id')
		expect(pages[1]!.name).toBe('stonecrop-User-detail')
		expect(pages[1]!.file).toBe('/resolved/StonecropDetailPage.vue')
		expect(pages[1]!.meta).toMatchObject({ viewMode: 'detail' })
	})

	it('strips :id params from slug to derive base path', () => {
		const doctypes = [doctype({ fileName: 'User', data: { slug: 'user/:id' } })]
		const pages = resourceStrategy(doctypes, makeResolver)

		expect(pages[0]!.path).toBe('/user')
		expect(pages[1]!.path).toBe('/user/:id')
	})

	it('strips complex param suffixes from slug', () => {
		const doctypes = [doctype({ fileName: 'Kanban', data: { slug: 'kanban/:id/:scope?' } })]
		const pages = resourceStrategy(doctypes, makeResolver)

		expect(pages[0]!.path).toBe('/kanban')
		expect(pages[1]!.path).toBe('/kanban/:id')
	})

	it('skips doctypes with parentDoctype (child tables)', () => {
		const doctypes = [
			doctype({ fileName: 'Order', data: { name: 'Order', slug: 'order' } }),
			doctype({ fileName: 'OrderItem', data: { name: 'Order Item', parentDoctype: 'order' } }),
		]
		const pages = resourceStrategy(doctypes, makeResolver)

		expect(pages).toHaveLength(2) // only Order's list + detail
		expect(pages.map(p => p.name)).toEqual(['stonecrop-Order-list', 'stonecrop-Order-detail'])
	})

	it('falls back to lowercase filename when no slug', () => {
		const doctypes = [doctype({ fileName: 'Customer' })]
		const pages = resourceStrategy(doctypes, makeResolver)

		expect(pages[0]!.path).toBe('/customer')
		expect(pages[1]!.path).toBe('/customer/:id')
	})

	it('passes schema and doctype as route meta on both routes', () => {
		const fields = [{ fieldname: 'email', fieldtype: 'Data' }]
		const data = { name: 'User', slug: 'user' }
		const doctypes = [doctype({ fileName: 'User', data, fields })]
		const pages = resourceStrategy(doctypes, makeResolver)

		for (const page of pages) {
			expect(page.meta).toMatchObject({ schema: fields, doctype: data })
		}
	})

	it('handles multiple doctypes', () => {
		const doctypes = [
			doctype({ fileName: 'User', data: { name: 'User', slug: 'user' } }),
			doctype({ fileName: 'Order', data: { name: 'Order', slug: 'order' } }),
		]
		const pages = resourceStrategy(doctypes, makeResolver)

		expect(pages).toHaveLength(4)
		expect(pages.map(p => p.path)).toEqual(['/user', '/user/:id', '/order', '/order/:id'])
	})

	it('returns empty array for empty doctype list', () => {
		expect(resourceStrategy([], makeResolver)).toEqual([])
	})
})

// ---------------------------------------------------------------------------
// resolveStrategy
// ---------------------------------------------------------------------------

describe('resolveStrategy', () => {
	it('resolves "single" to singleStrategy', () => {
		expect(resolveStrategy('single')).toBe(singleStrategy)
	})

	it('resolves "resource" to resourceStrategy', () => {
		expect(resolveStrategy('resource')).toBe(resourceStrategy)
	})

	it('passes through a custom function', () => {
		const custom: RouteStrategyFn = () => []
		expect(resolveStrategy(custom)).toBe(custom)
	})

	it('defaults to singleStrategy for unknown strings', () => {
		// @ts-expect-error testing invalid input
		expect(resolveStrategy('nonexistent')).toBe(singleStrategy)
	})

	it('custom function receives doctypes and resolver', () => {
		const doctypes = [doctype({ fileName: 'Test' })]
		const custom: RouteStrategyFn = (dts, res) => {
			return dts.map(dt => ({
				name: `custom-${dt.fileName}`,
				path: `/custom/${dt.fileName.toLowerCase()}`,
				file: res('Custom.vue'),
			}))
		}

		const strategy = resolveStrategy(custom)
		const pages = strategy(doctypes, makeResolver)

		expect(pages).toHaveLength(1)
		expect(pages[0]!.name).toBe('custom-Test')
		expect(pages[0]!.path).toBe('/custom/test')
		expect(pages[0]!.file).toBe('/resolved/Custom.vue')
	})
})
