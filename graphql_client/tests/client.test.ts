import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { StonecropClient } from '../src/client'
import { buildRecordQuery, buildListQuery } from '../src/query'
import type { DoctypeRef, DoctypeMeta } from '@stonecrop/schema'

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

		const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
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

		const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
		const body = JSON.parse(options.body as string) as GraphQLRequestBody
		expect(body.variables!.doctype).toBe('Task')
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

		const result = await client.getRecord(taskRef, '42')
		expect(result).toEqual(record)
	})

	it('returns null when record is null', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecord: { data: null } }))
		const result = await client.getRecord(taskRef, '999')
		expect(result).toBeNull()
	})

	it('sends correct variables to the server', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecord: { data: null } }))
		await client.getRecord(taskRef, 'record-id-1')

		const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
		const body = JSON.parse(options.body as string) as GraphQLRequestBody
		expect(body.variables!.doctype).toBe('Task')
		expect(body.variables!.id).toBe('record-id-1')
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

		const result = await client.getRecords(taskRef)
		expect(result).toHaveLength(2)
	})

	it('passes limit, offset, orderBy, filters to the query', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecords: { data: [], count: 0 } }))

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
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropRecords: { data: [], count: 0 } }))
		const result = await client.getRecords(taskRef)
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
// buildRecordQuery
// ===========================================================================

const recipeMeta: DoctypeMeta = {
	name: 'Recipe',
	slug: 'recipe',
	tableName: 'recipe',
	fields: [
		{ fieldname: 'id', fieldtype: 'Data', label: 'ID' },
		{ fieldname: 'name', fieldtype: 'Data', label: 'Name' },
		{ fieldname: 'status', fieldtype: 'Data', label: 'Status' },
	],
	links: {
		tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe' },
		supersededBy: { target: 'recipe', cardinality: 'atMostOne', backlink: 'supersededBy' },
	},
}

const recipeTaskMeta: DoctypeMeta = {
	name: 'RecipeTask',
	slug: 'recipe-task',
	tableName: 'recipe_task',
	fields: [
		{ fieldname: 'id', fieldtype: 'Data', label: 'ID' },
		{ fieldname: 'name', fieldtype: 'Data', label: 'Name' },
		{ fieldname: 'description', fieldtype: 'Data', label: 'Description' },
	],
	links: {
		recipe: { target: 'recipe', cardinality: 'one', backlink: 'tasks' },
	},
}

const registry = new Map<string, DoctypeMeta>([
	['recipe', recipeMeta],
	['recipe-task', recipeTaskMeta],
])

const recordFieldName = (t: string) => `${t.charAt(0).toUpperCase() + t.slice(1)}ById`
const recordArgName = () => 'id'
const recordArgType = () => 'UUID!'

describe('buildRecordQuery', () => {
	it('returns scalar-only query when includeNested is falsy', () => {
		const query = buildRecordQuery(recipeMeta, recordFieldName, recordArgName, recordArgType)
		expect(query).toContain('name')
		expect(query).toContain('status')
		expect(query).not.toContain('tasks')
		expect(query).not.toContain('supersededBy')
	})

	it('includes connection sub-selection for noneOrMany links', () => {
		const query = buildRecordQuery(recipeMeta, recordFieldName, recordArgName, recordArgType, registry, {
			includeNested: true,
		})
		expect(query).toContain('RecipeTasksByRecipeId')
		expect(query).toContain('nodes')
		expect(query).toContain('description')
	})

	it('includes direct object sub-selection for atMostOne links', () => {
		const query = buildRecordQuery(recipeMeta, recordFieldName, recordArgName, recordArgType, registry, {
			includeNested: true,
		})
		expect(query).toContain('supersededBy {')
		expect(query).not.toContain('supersededBysBy')
	})

	it('respects seen Set to prevent infinite recursion on circular links', () => {
		const query = buildRecordQuery(recipeMeta, recordFieldName, recordArgName, recordArgType, registry, {
			includeNested: true,
		})
		// recipe → recipe-task → recipe (seen, skipped)
		expect(query).toContain('RecipeTasksByRecipeId')
		// Should not include nested recipe sub-selection (circular)
		expect(query.match(/RecipeById/g) || []).toHaveLength(1) // only the outermost
	})

	it('respects maxDepth parameter', () => {
		const query = buildRecordQuery(recipeMeta, recordFieldName, recordArgName, recordArgType, registry, {
			includeNested: true,
			maxDepth: 1,
		})
		expect(query).toContain('RecipeTasksByRecipeId')
		// RecipeTask's links should not be included (depth 1 limit)
		expect(query).not.toContain('recipe {')
	})

	it('filters to named fieldnames when includeNested is string[]', () => {
		const query = buildRecordQuery(recipeMeta, recordFieldName, recordArgName, recordArgType, registry, {
			includeNested: ['supersededBy'],
		})
		expect(query).toContain('supersededBy {')
		expect(query).not.toContain('RecipeTasksByRecipeId')
	})

	it('returns scalar-only query when includeNested is truthy but registry is absent', () => {
		const query = buildRecordQuery(recipeMeta, recordFieldName, recordArgName, recordArgType, undefined, {
			includeNested: true,
		})
		expect(query).toContain('name')
		expect(query).not.toContain('RecipeTasksByRecipeId')
	})

	it('includes connection sub-selection for atLeastOne links (same style as noneOrMany)', () => {
		const atLeastOneMeta: DoctypeMeta = {
			name: 'Playlist',
			slug: 'playlist',
			tableName: 'playlist',
			fields: [
				{ fieldname: 'id', fieldtype: 'Data', label: 'ID' },
				{ fieldname: 'name', fieldtype: 'Data', label: 'Name' },
			],
			links: {
				tracks: { target: 'track', cardinality: 'atLeastOne', backlink: 'playlist' },
			},
		}
		const trackMeta: DoctypeMeta = {
			name: 'Track',
			slug: 'track',
			tableName: 'track',
			fields: [
				{ fieldname: 'id', fieldtype: 'Data', label: 'ID' },
				{ fieldname: 'title', fieldtype: 'Data', label: 'Title' },
			],
		}
		const localRegistry = new Map<string, DoctypeMeta>([
			['playlist', atLeastOneMeta],
			['track', trackMeta],
		])
		const query = buildRecordQuery(atLeastOneMeta, recordFieldName, recordArgName, recordArgType, localRegistry, {
			includeNested: true,
		})

		// atLeastOne should produce the same connection-style selection as noneOrMany
		expect(query).toContain('TracksByPlaylistId')
		expect(query).toContain('nodes')
		expect(query).toContain('title')
		expect(query).not.toContain('tracks {')
	})

	it('includes both noneOrMany and atMostOne links in the same generated query', () => {
		const query = buildRecordQuery(recipeMeta, recordFieldName, recordArgName, recordArgType, registry, {
			includeNested: true,
		})
		// Both link types are present in one pass
		expect(query).toContain('RecipeTasksByRecipeId')
		expect(query).toContain('supersededBy {')
	})

	it('generates sub-selections 3 levels deep (Recipe → RecipeTask → RegisteredFunction)', () => {
		const registeredFunctionMeta: DoctypeMeta = {
			name: 'RegisteredFunction',
			slug: 'registered-function',
			tableName: 'registered_function',
			fields: [
				{ fieldname: 'id', fieldtype: 'Data', label: 'ID' },
				{ fieldname: 'handler', fieldtype: 'Data', label: 'Handler' },
			],
		}
		const recipeTaskWithFunctionMeta: DoctypeMeta = {
			...recipeTaskMeta,
			links: {
				...recipeTaskMeta.links,
				durationFunction: { target: 'registered-function', cardinality: 'one' },
			},
		}
		const deepRegistry = new Map<string, DoctypeMeta>([
			['recipe', recipeMeta],
			['recipe-task', recipeTaskWithFunctionMeta],
			['registered-function', registeredFunctionMeta],
		])
		const query = buildRecordQuery(recipeMeta, recordFieldName, recordArgName, recordArgType, deepRegistry, {
			includeNested: true,
		})
		// Level 1 → 2: tasks connection
		expect(query).toContain('RecipeTasksByRecipeId')
		// Level 2 → 3: durationFunction direct object inside the task nodes
		expect(query).toContain('durationFunction {')
		expect(query).toContain('handler')
	})
})

// ===========================================================================
// buildListQuery
// ===========================================================================

const connectionFieldName = (t: string) => `all${t.charAt(0).toUpperCase() + t.slice(1)}`
const orderByTypeName = (t: string) => `${t.charAt(0).toUpperCase() + t.slice(1)}OrderBy`

describe('buildListQuery', () => {
	it('generates a query with no variables when no options', () => {
		const query = buildListQuery(recipeMeta, connectionFieldName, orderByTypeName)
		expect(query).toContain('allRecipe')
		expect(query).toContain('id')
		expect(query).toContain('name')
		expect(query).toContain('status')
		expect(query).not.toContain('$limit')
		expect(query).not.toContain('$offset')
		expect(query).not.toContain('$orderBy')
	})

	it('generates a query with limit', () => {
		const query = buildListQuery(recipeMeta, connectionFieldName, orderByTypeName, { limit: 10 })
		expect(query).toContain('$limit: Int')
		expect(query).toContain('first: $limit')
		expect(query).not.toContain('$offset')
		expect(query).not.toContain('$orderBy')
	})

	it('generates a query with limit and offset', () => {
		const query = buildListQuery(recipeMeta, connectionFieldName, orderByTypeName, { limit: 10, offset: 20 })
		expect(query).toContain('$limit: Int')
		expect(query).toContain('$offset: Int')
		expect(query).toContain('first: $limit')
		expect(query).toContain('offset: $offset')
		expect(query).not.toContain('$orderBy')
	})

	it('generates a query with all variables', () => {
		const query = buildListQuery(recipeMeta, connectionFieldName, orderByTypeName, {
			limit: 10,
			offset: 20,
			orderBy: 'NAME_ASC',
		})
		expect(query).toContain('$limit: Int')
		expect(query).toContain('$offset: Int')
		expect(query).toContain('$orderBy: [RecipeOrderBy!]')
		expect(query).toContain('orderBy: $orderBy')
	})

	it('excludes Link and Doctype fields from selection', () => {
		const query = buildListQuery(recipeMeta, connectionFieldName, orderByTypeName)
		expect(query).toContain('name')
		expect(query).not.toContain('tasks')
		expect(query).not.toContain('supersededBy')
	})
})

// ===========================================================================
// getRecord (nested)
// ===========================================================================

describe('StonecropClient.getRecord with nested', () => {
	it('returns null when meta is not found (nested)', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })
		mockFetch.mockReturnValue(makeFetchResponse({ stonecropMeta: null }))

		const result = await client.getRecord({ name: 'Unknown' }, '1', { includeNested: true })
		expect(result).toBeNull()
	})

	it('fetches a record with nested data and merges connection results', async () => {
		const doctypeRegistry = new Map<string, DoctypeMeta>([
			['recipe', recipeMeta],
			['recipe-task', recipeTaskMeta],
		])
		const client = new StonecropClient({ endpoint: ENDPOINT, registry: doctypeRegistry })

		// First call: getMeta
		// Second call: getRecord query
		mockFetch.mockReturnValueOnce(makeFetchResponse({ stonecropMeta: recipeMeta })).mockReturnValueOnce(
			makeFetchResponse({
				recipeById: {
					id: 'r1',
					name: 'Test Recipe',
					status: 'active',
					RecipeTasksByRecipeId: {
						nodes: [
							{ id: 't1', name: 'Task 1', description: 'Desc 1' },
							{ id: 't2', name: 'Task 2', description: 'Desc 2' },
						],
					},
				},
			})
		)

		const result = await client.getRecord({ name: 'Recipe' }, 'r1', {
			includeNested: true,
		})

		expect(result).not.toBeNull()
		expect(result!.name).toBe('Test Recipe')
		expect(result!.tasks).toEqual([
			{ id: 't1', name: 'Task 1', description: 'Desc 1' },
			{ id: 't2', name: 'Task 2', description: 'Desc 2' },
		])
		// Connection field should be removed after merge
		expect(result!.RecipeTasksByRecipeId).toBeUndefined()
	})

	it('returns empty array for noneOrMany link with no nodes', async () => {
		const doctypeRegistry = new Map<string, DoctypeMeta>([
			['recipe', recipeMeta],
			['recipe-task', recipeTaskMeta],
		])
		const client = new StonecropClient({ endpoint: ENDPOINT, registry: doctypeRegistry })

		mockFetch.mockReturnValueOnce(makeFetchResponse({ stonecropMeta: recipeMeta })).mockReturnValueOnce(
			makeFetchResponse({
				recipeById: {
					id: 'r1',
					name: 'Test Recipe',
					status: 'active',
					RecipeTasksByRecipeId: { nodes: [] },
				},
			})
		)

		const result = await client.getRecord({ name: 'Recipe' }, 'r1', {
			includeNested: true,
		})

		expect(result!.tasks).toEqual([])
	})

	it('returns record without merge when includeNested is not set', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })

		mockFetch.mockReturnValueOnce(makeFetchResponse({ stonecropRecord: { data: { id: 't1', title: 'My Task' } } }))

		const result = await client.getRecord({ name: 'Task' }, 't1')

		expect(result).not.toBeNull()
		expect(result!.title).toBe('My Task')
	})

	it('returns null when record is not found in query result (flat)', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })

		mockFetch.mockReturnValueOnce(makeFetchResponse({ stonecropRecord: { data: null } }))

		const result = await client.getRecord({ name: 'Task' }, 't1')
		expect(result).toBeNull()
	})

	it('returns null when record is not found in query result (nested)', async () => {
		const client = new StonecropClient({ endpoint: ENDPOINT })

		mockFetch.mockReturnValueOnce(makeFetchResponse({ stonecropMeta: taskMeta })).mockReturnValueOnce(
			makeFetchResponse({
				taskById: null,
			})
		)

		const result = await client.getRecord({ name: 'Task' }, 't1', { includeNested: true })
		expect(result).toBeNull()
	})

	it('merges both noneOrMany and atMostOne links in a single record', async () => {
		const doctypeRegistry = new Map<string, DoctypeMeta>([
			['recipe', recipeMeta],
			['recipe-task', recipeTaskMeta],
		])
		const client = new StonecropClient({ endpoint: ENDPOINT, registry: doctypeRegistry })

		mockFetch.mockReturnValueOnce(makeFetchResponse({ stonecropMeta: recipeMeta })).mockReturnValueOnce(
			makeFetchResponse({
				recipeById: {
					id: 'r1',
					name: 'Sourdough',
					status: 'active',
					RecipeTasksByRecipeId: {
						nodes: [{ id: 't1', name: 'Mix', description: 'Mix the dough' }],
					},
					supersededBy: { id: 'r2', name: 'Sourdough v2', status: 'active' },
				},
			})
		)

		const result = await client.getRecord({ name: 'Recipe' }, 'r1', { includeNested: true })

		expect(result).not.toBeNull()
		// noneOrMany link merged from connection nodes
		expect(result!.tasks).toEqual([{ id: 't1', name: 'Mix', description: 'Mix the dough' }])
		expect(result!.RecipeTasksByRecipeId).toBeUndefined()
		// atMostOne link left in place as-is
		expect(result!.supersededBy).toEqual({ id: 'r2', name: 'Sourdough v2', status: 'active' })
	})
})
