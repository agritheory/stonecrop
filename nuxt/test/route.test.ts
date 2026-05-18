import { describe, it, expect } from 'vitest'

import type { ParsedDoctype, RouteStrategyFn } from '../src/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function doctype(overrides: Partial<ParsedDoctype> & Pick<ParsedDoctype, 'fileName'>): ParsedDoctype {
	return {
		data: {},
		fields: [{ fieldname: 'name', fieldtype: 'Data' }],
		...overrides,
	}
}

// ---------------------------------------------------------------------------
// RouteStrategyFn — type contract & common usage patterns
// ---------------------------------------------------------------------------

describe('RouteStrategyFn', () => {
	it('accepts a function that maps doctypes to pages', () => {
		const strategy: RouteStrategyFn = doctypes =>
			doctypes.map(({ fileName, data, fields }) => ({
				name: `stonecrop-${fileName}`,
				path: `/${(data.slug as string) || fileName.toLowerCase()}`,
				file: '/pages/MyPage.vue',
				meta: { schema: fields, doctype: data },
			}))

		const pages = strategy([
			doctype({ fileName: 'User', data: { slug: 'user' } }),
			doctype({ fileName: 'Order', data: { slug: 'order' } }),
		])

		expect(pages).toHaveLength(2)
		expect(pages[0]!.path).toBe('/user')
		expect(pages[0]!.name).toBe('stonecrop-User')
		expect(pages[0]!.file).toBe('/pages/MyPage.vue')
		expect(pages[1]!.path).toBe('/order')
	})

	it('can generate list + detail routes (resource pattern)', () => {
		const strategy: RouteStrategyFn = doctypes =>
			doctypes.flatMap(({ fileName, data, fields }) => {
				const slug = (data.slug as string) || fileName.toLowerCase()
				return [
					{
						name: `${fileName}-list`,
						path: `/${slug}`,
						file: '/pages/ListPage.vue',
						meta: { schema: fields, doctype: data, viewMode: 'list' },
					},
					{
						name: `${fileName}-detail`,
						path: `/${slug}/:id`,
						file: '/pages/DetailPage.vue',
						meta: { schema: fields, doctype: data, viewMode: 'detail' },
					},
				]
			})

		const pages = strategy([doctype({ fileName: 'User', data: { slug: 'user' } })])

		expect(pages).toHaveLength(2)
		expect(pages[0]!.path).toBe('/user')
		expect(pages[0]!.meta).toMatchObject({ viewMode: 'list' })
		expect(pages[1]!.path).toBe('/user/:id')
		expect(pages[1]!.meta).toMatchObject({ viewMode: 'detail' })
	})

	it('can filter doctypes (e.g., skip certain types)', () => {
		const strategy: RouteStrategyFn = doctypes =>
			doctypes
				.filter(({ data }) => data.tableName !== 'order_items')
				.map(({ fileName, data, fields }) => ({
					name: `stonecrop-${fileName}`,
					path: `/${(data.slug as string) || fileName.toLowerCase()}`,
					file: '/pages/Page.vue',
					meta: { schema: fields, doctype: data },
				}))

		const pages = strategy([
			doctype({ fileName: 'Order', data: { name: 'Order', slug: 'order' } }),
			doctype({ fileName: 'OrderItem', data: { name: 'Order Item', tableName: 'order_items' } }),
		])

		expect(pages).toHaveLength(1)
		expect(pages[0]!.name).toBe('stonecrop-Order')
	})

	it('returns empty array for empty doctype list', () => {
		const strategy: RouteStrategyFn = doctypes =>
			doctypes.map(({ fileName }) => ({
				name: fileName,
				path: `/${fileName}`,
				file: '/pages/Page.vue',
			}))

		expect(strategy([])).toEqual([])
	})

	it('passes schema fields and doctype data in meta', () => {
		const fields = [{ fieldname: 'email', fieldtype: 'Data' }]
		const data = { name: 'User', slug: 'user', tableName: 'tabUser' }

		const strategy: RouteStrategyFn = doctypes =>
			doctypes.map(({ fileName, data, fields }) => ({
				name: fileName,
				path: `/${(data.slug as string) || fileName}`,
				file: '/pages/Page.vue',
				meta: { schema: fields, doctype: data },
			}))

		const pages = strategy([doctype({ fileName: 'User', data, fields })])

		expect(pages[0]!.meta).toEqual({ schema: fields, doctype: data })
	})

	it('falls back to lowercase filename when no slug', () => {
		const strategy: RouteStrategyFn = doctypes =>
			doctypes.map(({ fileName, data }) => ({
				name: `stonecrop-${fileName}`,
				path: `/${(data.slug as string) || fileName.toLowerCase()}`,
				file: '/pages/Page.vue',
			}))

		const pages = strategy([doctype({ fileName: 'OrderItem' })])

		expect(pages[0]!.path).toBe('/orderitem')
	})
})

// ---------------------------------------------------------------------------
// ParsedDoctype — shape validation
// ---------------------------------------------------------------------------

describe('ParsedDoctype', () => {
	it('requires fileName, data, and fields', () => {
		const dt: ParsedDoctype = {
			fileName: 'User',
			data: { name: 'User', slug: 'user' },
			fields: [{ fieldname: 'email', fieldtype: 'Data' }],
		}

		expect(dt.fileName).toBe('User')
		expect(dt.data).toHaveProperty('slug', 'user')
		expect(dt.fields).toHaveLength(1)
	})

	it('supports arbitrary data properties', () => {
		const dt: ParsedDoctype = {
			fileName: 'Task',
			data: { name: 'Task', slug: 'task', tableName: 'tabTask' },
			fields: [],
		}

		expect(dt.data.tableName).toBe('tabTask')
	})
})
