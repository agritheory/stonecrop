import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { StonecropClient } from '../src/client'

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

const taskMeta = {
	name: 'Task',
	tableName: 'tasks',
	fields: [
		{ fieldname: 'id', fieldtype: 'Data', label: 'ID' },
		{ fieldname: 'title', fieldtype: 'Data', label: 'Title' },
	],
}

// ===========================================================================
// Constructor
// ===========================================================================

describe('StonecropClient constructor', () => {
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

		const [, options] = mockFetch.mock.calls[0]
		const headers = options.headers as Record<string, string>
		expect(headers['Authorization']).toBe('Bearer token123')
		expect(headers['Content-Type']).toBe('application/json')
	})
})

// ===========================================================================
// query / mutate
// ===========================================================================

describe('StonecropClient.query', () => {
	it('sends a POST request with the query and variables', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ result: 42 }))

		const result = await client.query('query { foo }', { bar: 1 })

		expect(mockFetch).toHaveBeenCalledOnce()
		const [url, options] = mockFetch.mock.calls[0]
		expect(url).toBe(ENDPOINT)
		expect(options.method).toBe('POST')
		const body = JSON.parse(options.body as string)
		expect(body.query).toBe('query { foo }')
		expect(body.variables).toEqual({ bar: 1 })
		expect(result).toEqual({ result: 42 })
	})

	it('sends a POST without variables when not provided', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ x: 1 }))
		await client.query('query { x }')

		const [, options] = mockFetch.mock.calls[0]
		const body = JSON.parse(options.body as string)
		expect(body.variables).toBeUndefined()
	})

	it('throws when the response contains GraphQL errors', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse(null, [{ message: 'Something went wrong' }]))
		await expect(client.query('query { fail }')).rejects.toThrow('Something went wrong')
	})
})

describe('StonecropClient.mutate', () => {
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

describe('StonecropClient.getMeta', () => {
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

		const [, options] = mockFetch.mock.calls[0]
		const body = JSON.parse(options.body as string)
		expect(body.variables.doctype).toBe('Task')
	})
})

// ===========================================================================
// getAllMeta
// ===========================================================================

describe('StonecropClient.getAllMeta', () => {
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

describe('StonecropClient.getRecord', () => {
	it('returns the record data', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		const record = { id: '42', title: 'Write tests' }
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecord: { data: record } }))

		const result = await client.getRecord(taskMeta as any, '42')
		expect(result).toEqual(record)
	})

	it('returns null when record is null', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecord: { data: null } }))
		const result = await client.getRecord(taskMeta as any, '999')
		expect(result).toBeNull()
	})

	it('sends correct variables to the server', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecord: { data: null } }))
		await client.getRecord(taskMeta as any, 'record-id-1')

		const [, options] = mockFetch.mock.calls[0]
		const body = JSON.parse(options.body as string)
		expect(body.variables.doctype).toBe('Task')
		expect(body.variables.id).toBe('record-id-1')
	})
})

// ===========================================================================
// getRecords
// ===========================================================================

describe('StonecropClient.getRecords', () => {
	it('returns the records array', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		const records = [{ id: '1' }, { id: '2' }]
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecords: { data: records, count: 2 } }))

		const result = await client.getRecords(taskMeta as any)
		expect(result).toHaveLength(2)
	})

	it('passes limit, offset, orderBy, filters to the query', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecords: { data: [], count: 0 } }))

		await client.getRecords(taskMeta as any, {
			limit: 10,
			offset: 5,
			orderBy: 'title_ASC',
			filters: { status: 'open' },
		})

		const [, options] = mockFetch.mock.calls[0]
		const body = JSON.parse(options.body as string)
		expect(body.variables.limit).toBe(10)
		expect(body.variables.offset).toBe(5)
		expect(body.variables.orderBy).toBe('title_ASC')
		expect(body.variables.filters).toEqual({ status: 'open' })
	})

	it('works with no options (defaults)', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecords: { data: [], count: 0 } }))
		const result = await client.getRecords(taskMeta as any)
		expect(result).toEqual([])
	})
})

// ===========================================================================
// runAction
// ===========================================================================

describe('StonecropClient.runAction', () => {
	it('returns the action result', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(
			makeFetchResponse({
				stonecropAction: { success: true, data: { updated: true }, error: null },
			})
		)

		const result = await client.runAction(taskMeta as any, 'submit', [{ id: '1' }])
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

		const result = await client.runAction(taskMeta as any, 'submit')
		expect(result.success).toBe(false)
		expect(result.error).toBe('Action failed')
	})

	it('sends correct variables', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropAction: { success: true, data: null, error: null } }))

		await client.runAction(taskMeta as any, 'cancel', ['arg1', 'arg2'])

		const [, options] = mockFetch.mock.calls[0]
		const body = JSON.parse(options.body as string)
		expect(body.variables.doctype).toBe('Task')
		expect(body.variables.action).toBe('cancel')
		expect(body.variables.args).toEqual(['arg1', 'arg2'])
	})
})

// ===========================================================================
// clearMetaCache
// ===========================================================================

describe('StonecropClient.clearMetaCache', () => {
	it('clears the cache so subsequent getMeta calls re-fetch', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropMeta: taskMeta }))

		await client.getMeta({ doctype: 'Task' })
		client.clearMetaCache()
		await client.getMeta({ doctype: 'Task' })

		expect(mockFetch).toHaveBeenCalledTimes(2)
	})
})

// ===========================================================================
// createRecord / saveRecord / deleteRecord — convenience wrappers
// ===========================================================================

describe('StonecropClient.createRecord', () => {
	it('delegates to runAction with action "create" and data as first arg', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(
			makeFetchResponse({
				stonecropAction: { success: true, data: { id: 'new-1', title: 'Task A' }, error: null },
			})
		)

		const result = await client.createRecord(taskMeta as any, { title: 'Task A' })
		expect(result.success).toBe(true)
		expect(result.data).toEqual({ id: 'new-1', title: 'Task A' })

		const [, options] = mockFetch.mock.calls[0]
		const body = JSON.parse(options.body as string)
		expect(body.variables.doctype).toBe('Task')
		expect(body.variables.action).toBe('create')
		expect(body.variables.args).toEqual([{ title: 'Task A' }])
	})
})

describe('StonecropClient.saveRecord', () => {
	it('delegates to runAction with action "update", id, and patch', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(
			makeFetchResponse({
				stonecropAction: { success: true, data: { id: 'rec-1', title: 'Updated' }, error: null },
			})
		)

		const result = await client.saveRecord(taskMeta as any, 'rec-1', { title: 'Updated' })
		expect(result.success).toBe(true)

		const [, options] = mockFetch.mock.calls[0]
		const body = JSON.parse(options.body as string)
		expect(body.variables.action).toBe('update')
		expect(body.variables.args).toEqual(['rec-1', { title: 'Updated' }])
	})
})

describe('StonecropClient.deleteRecord', () => {
	it('delegates to runAction with action "delete" and the record id', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(
			makeFetchResponse({
				stonecropAction: { success: true, data: { id: 'rec-2' }, error: null },
			})
		)

		const result = await client.deleteRecord(taskMeta as any, 'rec-2')
		expect(result.success).toBe(true)

		const [, options] = mockFetch.mock.calls[0]
		const body = JSON.parse(options.body as string)
		expect(body.variables.action).toBe('delete')
		expect(body.variables.args).toEqual(['rec-2'])
	})

	it('returns success: false when server reports an error', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(
			makeFetchResponse({
				stonecropAction: { success: false, data: null, error: 'Record not found' },
			})
		)

		const result = await client.deleteRecord(taskMeta as any, 'missing-id')
		expect(result.success).toBe(false)
		expect(result.error).toBe('Record not found')
	})
})
