import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { StonecropClient } from '../src/client'
import type { DoctypeMeta, DoctypeRef } from '@stonecrop/schema'

interface GraphQLRequestBody {
	query: string
	variables?: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// Fetch mock helpers
// ---------------------------------------------------------------------------

function makeFetchResponse(data: unknown, errors?: Array<{ message: string }>) {
	return Promise.resolve({
		json: () => Promise.resolve({ data, errors }),
	} as Response)
}

const mockFetch = vi.fn()

beforeEach(() => {
	vi.stubGlobal('fetch', mockFetch)
	mockFetch.mockReset()
})

afterEach(() => {
	vi.unstubAllGlobals()
})

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const ENDPOINT = 'http://localhost/graphql'

const taskRef: DoctypeRef = { name: 'Task' }

const taskMeta: DoctypeMeta = {
	name: 'Task',
	fields: [
		{ fieldname: 'id', component: 'ATextInput', label: 'ID' },
		{ fieldname: 'title', component: 'ATextInput', label: 'Title' },
	],
}

const partyMeta: DoctypeMeta = {
	name: 'Party',
	slug: 'party',
	displayField: 'partyName',
	fields: [
		{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true },
		{ kind: 'field', fieldname: 'partyName', component: 'ATextInput' },
	],
}

const salesOrderMeta: DoctypeMeta = {
	name: 'SalesOrder',
	slug: 'sales-order',
	fields: [
		{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true },
		{ kind: 'field', fieldname: 'customerId', component: 'AFormLink', doctype: 'party' },
	],
}

const salesOrderRef: DoctypeRef = { name: 'SalesOrder' }

const allMetaFixture = [partyMeta, salesOrderMeta, taskMeta]

// ===========================================================================
// Constructor
// ===========================================================================

describe('StonecropClient constructor', { tags: ['unit', 'graphql'] }, () => {
	it('creates a client with the given endpoint', () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		expect(client).toBeInstanceOf(StonecropClient)
	})

	it('accepts custom headers', async () => {
		const client = new StonecropClient({
			endpoint: ENDPOINT,
			headers: { Authorization: 'Bearer token123' },
		})
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropMeta: null }))
		await client.getMeta({ doctype: 'Task' })

		const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
		const headers = options.headers as Record<string, string>
		expect(headers['Authorization']).toBe('Bearer token123')
		expect(headers['Content-Type']).toBe('application/json')
	})
})

// ===========================================================================
// query / mutate
// ===========================================================================

describe('StonecropClient.query', { tags: ['unit', 'graphql'] }, () => {
	it('sends a POST request with the query and variables', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ result: 42 }))

		const result = await client.query('query { foo }', { bar: 1 })

		expect(mockFetch).toHaveBeenCalledOnce()
		const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit]
		expect(url).toBe(ENDPOINT)
		expect(options.method).toBe('POST')
		const body = JSON.parse(options.body as string) as GraphQLRequestBody
		expect(body.query).toBe('query { foo }')
		expect(body.variables).toEqual({ bar: 1 })
		expect(result).toEqual({ result: 42 })
	})

	it('sends a POST without variables when not provided', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ x: 1 }))
		await client.query('query { x }')

		const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
		const body = JSON.parse(options.body as string) as GraphQLRequestBody
		expect(body.variables).toBeUndefined()
	})

	it('throws when the response contains GraphQL errors', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse(null, [{ message: 'Something went wrong' }]))
		await expect(client.query('query { fail }')).rejects.toThrow('Something went wrong')
	})
})

describe('StonecropClient.mutate', { tags: ['unit', 'graphql'] }, () => {
	it('delegates to query', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ mutateResult: true }))

		const result = await client.mutate('mutation { doThing }', { id: '1' })
		expect(result).toEqual({ mutateResult: true })
		expect(mockFetch).toHaveBeenCalledOnce()
	})
})

// ===========================================================================
// getMeta
// ===========================================================================

describe('StonecropClient.getMeta', { tags: ['unit', 'graphql'] }, () => {
	it('returns null when the server returns null', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropMeta: null }))
		const result = await client.getMeta({ doctype: 'Missing' })
		expect(result).toBeNull()
	})

	it('returns the doctype meta when found', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropMeta: taskMeta }))
		const result = await client.getMeta({ doctype: 'Task' })
		expect(result).toEqual(taskMeta)
	})

	it('caches the result and does not re-fetch', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropMeta: taskMeta }))

		await client.getMeta({ doctype: 'Task' })
		await client.getMeta({ doctype: 'Task' })

		expect(mockFetch).toHaveBeenCalledOnce()
	})

	it('does not cache a null result', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropMeta: null }))

		await client.getMeta({ doctype: 'Missing' })
		await client.getMeta({ doctype: 'Missing' })

		expect(mockFetch).toHaveBeenCalledTimes(2)
	})

	it('sends the doctype variable in the query', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropMeta: taskMeta }))
		await client.getMeta({ doctype: 'Task' })

		const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
		const body = JSON.parse(options.body as string) as GraphQLRequestBody
		expect(body.variables!.doctype).toBe('Task')
	})
})

// ===========================================================================
// getAllMeta
// ===========================================================================

describe('StonecropClient.getAllMeta', { tags: ['unit', 'graphql'] }, () => {
	it('returns all doctypes', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropAllMeta: [taskMeta] }))
		const result = await client.getAllMeta()
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('Task')
	})

	it('caches each doctype individually so getMeta does not re-fetch', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropAllMeta: [taskMeta] }))
		await client.getAllMeta()

		// getMeta for Task should now be served from cache
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropMeta: taskMeta }))
		await client.getMeta({ doctype: 'Task' })

		// fetch was only called once (for getAllMeta)
		expect(mockFetch).toHaveBeenCalledOnce()
	})
})

// ===========================================================================
// getRecord
// ===========================================================================

describe('StonecropClient.getRecord', { tags: ['unit', 'graphql'] }, () => {
	it('returns the record data via stonecropRecord', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		const record = { id: '42', title: 'Write tests' }
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecord: { data: record } }))

		const result = await client.getRecord(taskRef, '42')
		expect(result.record).toEqual(record)
		expect(result.unknownLinks).toBeUndefined()
	})

	it('returns null record when data is null', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecord: { data: null } }))
		const result = await client.getRecord(taskRef, '999')
		expect(result.record).toBeNull()
	})

	it('sends correct variables to the server', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecord: { data: null } }))
		await client.getRecord(taskRef, 'record-id-1')

		const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
		const body = JSON.parse(options.body as string) as GraphQLRequestBody
		expect(body.variables!.doctype).toBe('Task')
		expect(body.variables!.id).toBe('record-id-1')
		expect(body.variables!.options).toBeUndefined()
	})

	it('sends includeNested options to stonecropRecord', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecord: { data: { id: '42' }, unknownLinks: [] } }))
		await client.getRecord(taskRef, '42', { includeNested: true })

		const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
		const body = JSON.parse(options.body as string) as GraphQLRequestBody
		expect(body.variables!.options).toEqual({ includeNested: true })
	})

	it('returns unknownLinks when includeNested is string array', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(
			makeFetchResponse({
				stonecropRecord: { data: { id: '42' }, unknownLinks: ['typo-link', 'fake-link'] },
			})
		)

		const result = await client.getRecord(taskRef, '42', { includeNested: ['typo-link', 'fake-link'] })

		expect(result.unknownLinks).toEqual(['typo-link', 'fake-link'])
		expect(result.record).toEqual({ id: '42' })
	})

	it('returns empty unknownLinks when all links are valid', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecord: { data: { id: '42' }, unknownLinks: [] } }))

		const result = await client.getRecord(taskRef, '42', { includeNested: ['some-link'] })

		expect(result.unknownLinks).toEqual([])
	})
})

// ===========================================================================
// getRecords
// ===========================================================================

describe('StonecropClient.getRecords', { tags: ['unit', 'graphql'] }, () => {
	it('returns the page and whether more remain', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		const records = [{ id: '1' }, { id: '2' }]
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecords: { data: records, hasMore: true, count: null } }))

		const result = await client.getRecords(taskRef)
		expect(result.data).toHaveLength(2)
		expect(result.hasMore).toBe(true)
	})

	it('omits count entirely when the server did not answer one', async () => {
		// `count` absent and `count: 0` must stay distinguishable: one means nobody asked, the
		// other means the set is empty. Passing null straight through would collapse them.
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecords: { data: [], hasMore: false, count: null } }))

		const result = await client.getRecords(taskRef)
		expect('count' in result).toBe(false)
	})

	it('keeps a zero total when one was requested', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecords: { data: [], hasMore: false, count: 0 } }))

		const result = await client.getRecords(taskRef, { includeTotal: true })
		expect(result.count).toBe(0)
	})

	it('passes includeTotal to the query', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecords: { data: [], hasMore: false, count: 3 } }))

		await client.getRecords(taskRef, { includeTotal: true })

		const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
		const body = JSON.parse(options.body as string) as GraphQLRequestBody
		expect(body.variables!.includeTotal).toBe(true)
	})

	it('passes limit, offset, orderBy, filters to the query', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecords: { data: [], hasMore: false, count: null } }))

		await client.getRecords(taskRef, {
			limit: 10,
			offset: 5,
			orderBy: 'title_ASC',
			filters: { status: 'open' },
		})

		const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
		const body = JSON.parse(options.body as string) as GraphQLRequestBody
		expect(body.variables!.limit).toBe(10)
		expect(body.variables!.offset).toBe(5)
		expect(body.variables!.orderBy).toBe('title_ASC')
		expect(body.variables!.filters).toEqual({ status: 'open' })
	})

	it('works with no options (defaults)', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecords: { data: [], hasMore: false, count: null } }))
		const result = await client.getRecords(taskRef)
		expect(result).toEqual({ data: [], hasMore: false })
	})
})

// ===========================================================================
// getNativeRecord / getNativeRecords
// ===========================================================================

describe('StonecropClient.getNativeRecord', { tags: ['unit', 'graphql'] }, () => {
	it('returns a record with link fields as { id, displayText } objects', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValueOnce(makeFetchResponse({ stonecropAllMeta: allMetaFixture })).mockReturnValueOnce(
			makeFetchResponse({
				salesOrderById: {
					id: 'so-1',
					customerId: 'party-1',
					partyByCustomerId: { id: 'party-1', partyName: 'Acme Corp' },
				},
			})
		)

		const result = await client.getNativeRecord(salesOrderRef, 'so-1')

		expect(result.record).toEqual({
			id: 'so-1',
			customerId: { id: 'party-1', displayText: 'Acme Corp' },
		})
		expect(mockFetch).toHaveBeenCalledTimes(2)
	})

	it('returns null when the doctype is not in metadata', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValueOnce(makeFetchResponse({ stonecropAllMeta: allMetaFixture }))

		const result = await client.getNativeRecord({ name: 'Missing' }, 'so-1')

		expect(result.record).toBeNull()
		expect(mockFetch).toHaveBeenCalledOnce()
	})

	it('returns null when PostGraphile finds no row', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch
			.mockReturnValueOnce(makeFetchResponse({ stonecropAllMeta: allMetaFixture }))
			.mockReturnValueOnce(makeFetchResponse({ salesOrderById: null }))

		const result = await client.getNativeRecord(salesOrderRef, 'missing-id')

		expect(result.record).toBeNull()
	})
})

describe('StonecropClient.getNativeRecords', { tags: ['unit', 'graphql'] }, () => {
	it('returns transformed rows and hasMore when the page is full', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValueOnce(makeFetchResponse({ stonecropAllMeta: allMetaFixture })).mockReturnValueOnce(
			makeFetchResponse({
				allSalesOrders: {
					nodes: [
						{
							id: 'so-1',
							customerId: 'party-1',
							partyByCustomerId: { id: 'party-1', partyName: 'Acme Corp' },
						},
					],
				},
			})
		)

		const result = await client.getNativeRecords(salesOrderRef, { limit: 1 })

		expect(result.data).toEqual([
			{
				id: 'so-1',
				customerId: { id: 'party-1', displayText: 'Acme Corp' },
			},
		])
		expect(result.hasMore).toBe(true)
	})

	it('returns an empty page when the doctype is not in metadata', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValueOnce(makeFetchResponse({ stonecropAllMeta: allMetaFixture }))

		const result = await client.getNativeRecords({ name: 'Missing' })

		expect(result).toEqual({ data: [], hasMore: false })
		expect(mockFetch).toHaveBeenCalledOnce()
	})

	it('passes limit and offset to the native list query', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch
			.mockReturnValueOnce(makeFetchResponse({ stonecropAllMeta: allMetaFixture }))
			.mockReturnValueOnce(makeFetchResponse({ allSalesOrders: { nodes: [] } }))

		await client.getNativeRecords(salesOrderRef, { limit: 25, offset: 50 })

		const [, options] = mockFetch.mock.calls[1] as [string, RequestInit]
		const body = JSON.parse(options.body as string) as GraphQLRequestBody
		expect(body.variables).toEqual({ first: 25, offset: 50 })
	})
})

// ===========================================================================
// runAction
// ===========================================================================

describe('StonecropClient.runAction', { tags: ['unit', 'graphql'] }, () => {
	it('returns the action result', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(
			makeFetchResponse({
				stonecropAction: { success: true, data: { updated: true }, error: null },
			})
		)

		const result = await client.runAction(taskRef, 'submit', [{ id: '1' }])
		expect(result.success).toBe(true)
		expect(result.data).toEqual({ updated: true })
		expect(result.error).toBeNull()
	})

	it('returns success: false on server-side error', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(
			makeFetchResponse({
				stonecropAction: { success: false, data: null, error: 'Action failed' },
			})
		)

		const result = await client.runAction(taskRef, 'submit')
		expect(result.success).toBe(false)
		expect(result.error).toBe('Action failed')
	})

	it('sends correct variables', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropAction: { success: true, data: null, error: null } }))

		await client.runAction(taskRef, 'cancel', ['arg1', 'arg2'])

		const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
		const body = JSON.parse(options.body as string) as GraphQLRequestBody
		expect(body.variables!.doctype).toBe('Task')
		expect(body.variables!.action).toBe('cancel')
		expect(body.variables!.args).toEqual(['arg1', 'arg2'])
	})
})

// ===========================================================================
// clearMetaCache
// ===========================================================================

describe('StonecropClient.clearMetaCache', { tags: ['unit', 'graphql'] }, () => {
	it('clears the cache so subsequent getMeta calls re-fetch', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropMeta: taskMeta }))

		await client.getMeta({ doctype: 'Task' })
		client.clearMetaCache()
		await client.getMeta({ doctype: 'Task' })

		expect(mockFetch).toHaveBeenCalledTimes(2)
	})
})
