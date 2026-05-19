import { parse } from 'graphql'
import { makeSchema } from 'postgraphile'
import { execute } from 'postgraphile/grafast'
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'

import { createStonecropPlugin } from '../src/plugin/postgraphile'
import { clearRegistry, loadDoctypesFromObject } from '../src/registry/doctypes'

// ===========================================================================
// createStonecropPlugin — inflection resolution coverage
// ===========================================================================

describe('createStonecropPlugin', { tags: ['unit', 'graphql'] }, () => {
	const mockExecutor = { query: vi.fn(), mutate: vi.fn() }

	it('creates a plugin with default inflection', () => {
		const plugin = createStonecropPlugin({ executor: mockExecutor })
		expect(plugin).toBeDefined()
	})

	it('accepts partial inflection overrides', () => {
		const plugin = createStonecropPlugin({
			executor: mockExecutor,
			inflection: {
				recordFieldName: t => `${t}ByRowId`,
				recordArgName: () => 'rowId',
			},
		})
		expect(plugin).toBeDefined()
	})

	it('accepts full inflection overrides', () => {
		const plugin = createStonecropPlugin({
			executor: mockExecutor,
			inflection: {
				recordFieldName: t => `custom_${t}`,
				connectionFieldName: t => `list_${t}`,
				orderByTypeName: t => `${t}Sort`,
				recordArgName: () => 'nodeId',
				recordArgType: () => 'ID!',
			},
		})
		expect(plugin).toBeDefined()
	})

	it('accepts reverseConnectionName override', () => {
		const plugin = createStonecropPlugin({
			executor: mockExecutor,
			inflection: {
				reverseConnectionName: ({ target }) => `Custom_${target}`,
			},
		})
		expect(plugin).toBeDefined()
	})
})

// ===========================================================================
// stonecropRecords — pagination, ordering, filter and options passthrough
// ===========================================================================

describe('stonecropRecords', { tags: ['unit', 'graphql'] }, () => {
	const mockExecutor = {
		query: vi.fn(),
		mutate: vi.fn(),
	}
	let schema: Awaited<ReturnType<typeof makeSchema>>['schema']
	let resolvedPreset: Awaited<ReturnType<typeof makeSchema>>['resolvedPreset']

	beforeAll(async () => {
		loadDoctypesFromObject({
			Resource: {
				name: 'Resource',
				tableName: 'resources',
				fields: [
					{ fieldname: 'id', fieldtype: 'Data', label: 'ID' },
					{ fieldname: 'name', fieldtype: 'Data', label: 'Name' },
				],
			},
		})
		const result = await makeSchema({
			extends: [PostGraphileAmberPreset],
			plugins: [createStonecropPlugin({ executor: mockExecutor })],
		})
		schema = result.schema
		resolvedPreset = result.resolvedPreset
	})

	afterAll(() => {
		clearRegistry()
	})

	beforeEach(() => {
		// allResources matches defaultConnectionFieldName('resources')
		mockExecutor.query.mockResolvedValue({ allResources: { nodes: [{ id: '1', name: 'Test' }] } })
		mockExecutor.query.mockClear()
	})

	async function run(gql: string) {
		return execute({ schema, document: parse(gql), resolvedPreset })
	}

	it('baseline — no pagination args produces a query with no variable declarations', async () => {
		await run(`{ stonecropRecords(doctype: "Resource") { count } }`)
		expect(mockExecutor.query).toHaveBeenCalledOnce()
		const query: string = mockExecutor.query.mock.calls[0][0]
		expect(query).not.toContain('$limit')
		expect(query).not.toContain('$offset')
		expect(query).not.toContain('$orderBy')
	})

	it('passes limit through as $limit variable', async () => {
		await run(`{ stonecropRecords(doctype: "Resource", limit: 5) { count } }`)
		const query: string = mockExecutor.query.mock.calls[0][0]
		expect(query).toContain('$limit: Int')
		expect(query).toContain('first: $limit')
		expect(query).not.toContain('$offset')
		expect(query).not.toContain('$orderBy')
	})

	it('passes limit and offset together', async () => {
		await run(`{ stonecropRecords(doctype: "Resource", limit: 10, offset: 20) { count } }`)
		const query: string = mockExecutor.query.mock.calls[0][0]
		expect(query).toContain('$limit: Int')
		expect(query).toContain('$offset: Int')
		expect(query).toContain('offset: $offset')
		expect(query).not.toContain('$orderBy')
	})

	it('passes orderBy through as $orderBy variable', async () => {
		await run(`{ stonecropRecords(doctype: "Resource", orderBy: "NAME_ASC") { count } }`)
		const query: string = mockExecutor.query.mock.calls[0][0]
		expect(query).toContain('$orderBy')
		expect(query).toContain('orderBy: $orderBy')
	})

	it('filters are accepted but not applied in the generated query (Phase 5)', async () => {
		await run(`{ stonecropRecords(doctype: "Resource", filters: {name: "test"}) { count } }`)
		expect(mockExecutor.query).toHaveBeenCalledOnce()
		const query: string = mockExecutor.query.mock.calls[0][0]
		// filters are collected in the spec but buildListQuery does not use them yet
		expect(query).not.toContain('WHERE')
		expect(query).not.toContain('filter')
	})

	it('unknown options keys are ignored gracefully', async () => {
		const result = await run(`{ stonecropRecords(doctype: "Resource", options: {unknownKey: "value"}) { count } }`)
		expect((result as any).errors).toBeUndefined()
		expect(mockExecutor.query).toHaveBeenCalledOnce()
	})
})
