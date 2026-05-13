import { snakeToCamel, type DoctypeMeta } from '@stonecrop/schema'
import { describe, it, expect } from 'vitest'

import {
	defaultRecordFieldName,
	defaultConnectionFieldName,
	defaultOrderByTypeName,
	defaultRecordArgName,
	defaultRecordArgType,
	defaultReverseConnectionName,
	buildRecordQuery,
	buildListQuery,
	queryableFieldNames,
	RELATION_FIELDTYPES,
	extractSingleResult,
	extractListResult,
	mergeNestedResults,
} from '../src/plugin/postgraphile'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const scalarOnlyMeta: DoctypeMeta = {
	name: 'Resource',
	tableName: 'resources',
	fields: [
		{ fieldname: 'id', fieldtype: 'Data', label: 'ID' },
		{ fieldname: 'name', fieldtype: 'Data', label: 'Name' },
		{ fieldname: 'quantity', fieldtype: 'Int', label: 'Quantity' },
		{ fieldname: 'is_active', fieldtype: 'Check', label: 'Active' },
	],
}

const mixedFieldsMeta: DoctypeMeta = {
	name: 'Recipe',
	tableName: 'recipes',
	fields: [
		{ fieldname: 'id', fieldtype: 'Data', label: 'ID' },
		{ fieldname: 'title', fieldtype: 'Data', label: 'Title' },
		{ fieldname: 'created_at', fieldtype: 'Datetime', label: 'Created' },
		// FK object reference — requires sub-selection, should be skipped
		{ fieldname: 'userByCreatedBy', fieldtype: 'Link', label: 'Creator', options: 'user' },
		{ fieldname: 'rating', fieldtype: 'Float', label: 'Rating' },
	],
	links: {
		// Reverse relation connection — routes to links, not fields
		recipeIngredientsByRecipeId: { target: 'recipe-ingredient', cardinality: 'noneOrMany' },
	},
}

// Nested doctype fixtures
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
		supersededBy: { target: 'recipe', cardinality: 'atMostOne', backlink: 'supersededBy', fetch: { method: 'sync' } },
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
		recipe: { target: 'recipe', cardinality: 'one', backlink: 'tasks', fetch: { method: 'sync' } },
	},
}

const registry = new Map<string, DoctypeMeta>([
	['recipe', recipeMeta],
	['recipe-task', recipeTaskMeta],
])

const getMeta = (slug: string) => registry.get(slug)

// ===========================================================================
// Field filtering
// ===========================================================================

describe('RELATION_FIELDTYPES', () => {
	it('contains Link', () => {
		expect(RELATION_FIELDTYPES.has('Link')).toBe(true)
		expect(RELATION_FIELDTYPES.has('Doctype')).toBe(false)
	})

	it('contains Display', () => {
		expect(RELATION_FIELDTYPES.has('Display')).toBe(true)
	})

	it('does not contain scalar types', () => {
		expect(RELATION_FIELDTYPES.has('Data')).toBe(false)
		expect(RELATION_FIELDTYPES.has('Int')).toBe(false)
	})
})

describe('queryableFieldNames', () => {
	it('returns all fields when none are relational', () => {
		const names = queryableFieldNames(scalarOnlyMeta)
		expect(names).toContain('id')
		expect(names).toContain('name')
		expect(names).toContain('quantity')
		expect(names).toContain('is_active')
	})

	it('excludes Link fields', () => {
		const names = queryableFieldNames(mixedFieldsMeta)
		expect(names).toContain('id')
		expect(names).toContain('title')
		expect(names).toContain('created_at')
		expect(names).toContain('rating')
		expect(names).not.toContain('userByCreatedBy')
		expect(names).not.toContain('recipeIngredientsByRecipeId')
	})

	it('excludes Display fields from scalar selection', () => {
		const meta: DoctypeMeta = {
			name: 'Plan',
			tableName: 'plan',
			fields: [
				{ fieldname: 'id', fieldtype: 'Data', label: 'ID' },
				{ fieldname: 'name', fieldtype: 'Data', label: 'Name' },
				{ fieldname: 'planner', fieldtype: 'Display', component: 'Planner', label: 'Resource Planner' },
			],
		}
		const names = queryableFieldNames(meta)
		expect(names).toContain('id')
		expect(names).toContain('name')
		expect(names).not.toContain('planner')
	})
})

// ===========================================================================
// buildRecordQuery
// ===========================================================================

describe('buildRecordQuery', () => {
	it('generates valid query with default arg name/type', () => {
		const query = buildRecordQuery(
			scalarOnlyMeta,
			defaultRecordFieldName,
			defaultRecordArgName,
			defaultRecordArgType,
			getMeta
		)
		expect(query).toContain('query GetRecord($id: UUID!)')
		expect(query).toContain('resourceById(id: $id)')
		expect(query).toContain('id')
		expect(query).toContain('name')
		expect(query).toContain('quantity')
	})

	it('excludes relation fields from selection', () => {
		const query = buildRecordQuery(
			mixedFieldsMeta,
			defaultRecordFieldName,
			defaultRecordArgName,
			defaultRecordArgType,
			getMeta
		)
		expect(query).toContain('title')
		expect(query).toContain('rating')
		expect(query).not.toContain('userByCreatedBy')
		expect(query).not.toContain('recipeIngredientsByRecipeId')
	})

	it('uses custom recordFieldName inflection', () => {
		const customFieldName = (_t: string) => 'resourceByRowId'
		const customArgName = (_t: string) => 'rowId'
		const query = buildRecordQuery(scalarOnlyMeta, customFieldName, customArgName, defaultRecordArgType, getMeta)
		expect(query).toContain('query GetRecord($rowId: UUID!)')
		expect(query).toContain('resourceByRowId(rowId: $rowId)')
	})

	it('uses custom recordArgName and recordArgType together', () => {
		const customFieldName = (_t: string) => 'resourceById'
		const customArgName = (_t: string) => 'nodeId'
		const customArgType = (_t: string) => 'ID!'
		const query = buildRecordQuery(scalarOnlyMeta, customFieldName, customArgName, customArgType, getMeta)
		expect(query).toContain('query GetRecord($nodeId: ID!)')
		expect(query).toContain('resourceById(nodeId: $nodeId)')
	})

	it('row_id pattern: rowId arg with UUID! type', () => {
		const rowIdFieldName = (t: string) => `${defaultRecordFieldName(t).replace(/ById$/, 'ByRowId')}`
		const rowIdArgName = (_t: string) => 'rowId'
		const query = buildRecordQuery(scalarOnlyMeta, rowIdFieldName, rowIdArgName, defaultRecordArgType, getMeta)
		expect(query).toContain('query GetRecord($rowId: UUID!)')
		expect(query).toContain('resourceByRowId(rowId: $rowId)')
	})
})

// ===========================================================================
// buildListQuery
// ===========================================================================

describe('buildListQuery', () => {
	it('declares no variables when no args are provided', () => {
		const query = buildListQuery(scalarOnlyMeta, {}, defaultConnectionFieldName, defaultOrderByTypeName)
		expect(query).toMatch(/query GetRecords\s*\{/)
		expect(query).not.toContain('$limit')
		expect(query).not.toContain('$offset')
		expect(query).not.toContain('$orderBy')
	})

	it('declares only $limit when only limit is provided', () => {
		const query = buildListQuery(scalarOnlyMeta, { limit: 10 }, defaultConnectionFieldName, defaultOrderByTypeName)
		expect(query).toContain('$limit: Int')
		expect(query).toContain('first: $limit')
		expect(query).not.toContain('$offset')
		expect(query).not.toContain('$orderBy')
	})

	it('declares only $limit and $offset when both are provided', () => {
		const query = buildListQuery(
			scalarOnlyMeta,
			{ limit: 10, offset: 20 },
			defaultConnectionFieldName,
			defaultOrderByTypeName
		)
		expect(query).toContain('$limit: Int')
		expect(query).toContain('$offset: Int')
		expect(query).not.toContain('$orderBy')
	})

	it('declares all three variables when all args are provided', () => {
		const query = buildListQuery(
			scalarOnlyMeta,
			{ limit: 10, offset: 20, orderBy: 'NAME_ASC' },
			defaultConnectionFieldName,
			defaultOrderByTypeName
		)
		expect(query).toContain('$limit: Int')
		expect(query).toContain('$offset: Int')
		expect(query).toContain('$orderBy: [ResourcesOrderBy!]')
		expect(query).toContain('first: $limit')
		expect(query).toContain('offset: $offset')
		expect(query).toContain('orderBy: $orderBy')
	})

	it('uses correct connection field name', () => {
		const query = buildListQuery(scalarOnlyMeta, {}, defaultConnectionFieldName, defaultOrderByTypeName)
		expect(query).toContain('allResources')
	})

	it('excludes relation fields from selection', () => {
		const query = buildListQuery(mixedFieldsMeta, {}, defaultConnectionFieldName, defaultOrderByTypeName)
		expect(query).toContain('title')
		expect(query).toContain('rating')
		expect(query).not.toContain('userByCreatedBy')
		expect(query).not.toContain('recipeIngredientsByRecipeId')
	})
})

// ===========================================================================
// extractSingleResult
// ===========================================================================

describe('extractSingleResult', () => {
	it('extracts the record from the result using the field name', () => {
		const record = { id: '1', name: 'Test' }
		const result = { resourceById: record }
		const extracted = extractSingleResult({ result, meta: scalarOnlyMeta, recordFieldName: defaultRecordFieldName })
		expect(extracted).toBe(record)
	})

	it('returns undefined when field is absent', () => {
		const result = {}
		const extracted = extractSingleResult({ result, meta: scalarOnlyMeta, recordFieldName: defaultRecordFieldName })
		expect(extracted).toBeUndefined()
	})

	it('uses custom recordFieldName inflection', () => {
		const record = { id: '1' }
		const result = { resourceByRowId: record }
		const extracted = extractSingleResult({ result, meta: scalarOnlyMeta, recordFieldName: () => 'resourceByRowId' })
		expect(extracted).toBe(record)
	})
})

// ===========================================================================
// extractListResult
// ===========================================================================

describe('extractListResult', () => {
	it('extracts the nodes array from the connection', () => {
		const nodes = [{ id: '1' }, { id: '2' }]
		const result = { allResources: { nodes } }
		const extracted = extractListResult({
			result,
			meta: scalarOnlyMeta,
			connectionFieldName: defaultConnectionFieldName,
		})
		expect(extracted).toEqual(nodes)
	})

	it('returns empty array when connection field is absent', () => {
		const result = {}
		const extracted = extractListResult({
			result,
			meta: scalarOnlyMeta,
			connectionFieldName: defaultConnectionFieldName,
		})
		expect(extracted).toEqual([])
	})

	it('returns empty array when nodes is absent', () => {
		const result = { allResources: {} }
		const extracted = extractListResult({
			result,
			meta: scalarOnlyMeta,
			connectionFieldName: defaultConnectionFieldName,
		})
		expect(extracted).toEqual([])
	})
})

// ===========================================================================
// defaultReverseConnectionName
// ===========================================================================

describe('defaultReverseConnectionName', () => {
	it('derives correct PostGraphile connection name', () => {
		const result = defaultReverseConnectionName({
			doctype: 'recipe',
			linkName: 'tasks',
			backlink: 'recipe',
			target: 'recipe-task',
		})
		expect(result).toBe('recipeTasksByRecipeId')
	})

	it('handles self-referential links', () => {
		const result = defaultReverseConnectionName({
			doctype: 'recipe',
			linkName: 'supersededBy',
			backlink: 'supersededBy',
			target: 'recipe',
		})
		expect(result).toBe('recipesBySupersededById')
	})

	it('handles underscored table names', () => {
		const result = defaultReverseConnectionName({
			doctype: 'bom',
			linkName: 'items',
			backlink: 'bom',
			target: 'bom-item',
		})
		expect(result).toBe('bomItemsByBomId')
	})
})

describe('reverseConnectionName override', () => {
	it('uses custom reverseConnectionName when provided', () => {
		const customReverseConnection = ({ target }: { target: string }) => `Custom_${target}`
		const query = buildRecordQuery(
			recipeMeta,
			defaultRecordFieldName,
			defaultRecordArgName,
			defaultRecordArgType,
			getMeta,
			{ includeNested: true },
			customReverseConnection
		)
		// With custom reverseConnectionName, the query should use the custom format
		expect(query).toContain('Custom_recipe-task')
	})

	it('uses default reverseConnectionName when no custom provided', () => {
		const query = buildRecordQuery(
			recipeMeta,
			defaultRecordFieldName,
			defaultRecordArgName,
			defaultRecordArgType,
			getMeta,
			{ includeNested: true }
		)
		// Default uses PostGraphile Amber convention
		expect(query).toContain('recipeTasksByRecipeId')
	})
})

// ===========================================================================
// buildRecordQuery with nested
// ===========================================================================

describe('buildRecordQuery with includeNested', () => {
	it('generates nested query for noneOrMany links', () => {
		const query = buildRecordQuery(
			recipeMeta,
			defaultRecordFieldName,
			defaultRecordArgName,
			defaultRecordArgType,
			getMeta,
			{ includeNested: true }
		)
		expect(query).toContain('recipeTasksByRecipeId')
		expect(query).toContain('nodes')
		expect(query).toContain('description')
	})

	it('generates direct sub-selection for atMostOne links', () => {
		const query = buildRecordQuery(
			recipeMeta,
			defaultRecordFieldName,
			defaultRecordArgName,
			defaultRecordArgType,
			getMeta,
			{ includeNested: true }
		)
		expect(query).toContain('supersededBy {')
		expect(query).not.toContain('supersededBysBy')
	})

	it('respects seen Set to prevent infinite recursion on circular links', () => {
		const query = buildRecordQuery(
			recipeMeta,
			defaultRecordFieldName,
			defaultRecordArgName,
			defaultRecordArgType,
			getMeta,
			{ includeNested: true }
		)
		// recipe → recipe-task → recipe (seen, skipped)
		expect(query).toContain('recipeTasksByRecipeId')
		// Should not include nested recipe sub-selection (circular)
		expect((query.match(/recipeById/g) || []).length).toBe(1) // only the outermost
	})

	it('respects maxDepth parameter', () => {
		const query = buildRecordQuery(
			recipeMeta,
			defaultRecordFieldName,
			defaultRecordArgName,
			defaultRecordArgType,
			getMeta,
			{ includeNested: true, maxDepth: 1 }
		)
		expect(query).toContain('recipeTasksByRecipeId')
		// RecipeTask's links should not be included (depth 1 limit)
		expect(query).not.toContain('recipe {')
	})

	it('filters to named fieldnames when includeNested is string[]', () => {
		const query = buildRecordQuery(
			recipeMeta,
			defaultRecordFieldName,
			defaultRecordArgName,
			defaultRecordArgType,
			getMeta,
			{ includeNested: ['supersededBy'] }
		)
		expect(query).toContain('supersededBy {')
		expect(query).not.toContain('recipeTasksByRecipeId')
	})

	it('skips lazy links', () => {
		const lazyMeta: DoctypeMeta = {
			...recipeMeta,
			links: {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'lazy' } },
			},
		}
		const lazyRegistry = new Map<string, DoctypeMeta>([
			['recipe', lazyMeta],
			['recipe-task', recipeTaskMeta],
		])
		const query = buildRecordQuery(
			lazyMeta,
			defaultRecordFieldName,
			defaultRecordArgName,
			defaultRecordArgType,
			(slug: string) => lazyRegistry.get(slug),
			{ includeNested: true }
		)
		expect(query).not.toContain('recipeTasksByRecipeId')
		expect(query).toContain('name')
		expect(query).toContain('status')
	})

	it('includes sync links', () => {
		const query = buildRecordQuery(
			recipeMeta,
			defaultRecordFieldName,
			defaultRecordArgName,
			defaultRecordArgType,
			getMeta,
			{ includeNested: true }
		)
		expect(query).toContain('supersededBy {')
	})

	it('applies cardinality-based defaults: noneOrMany defaults to sync with limit 50', () => {
		const defaultMeta: DoctypeMeta = {
			...recipeMeta,
			links: {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany' },
			},
		}
		const defaultRegistry = new Map<string, DoctypeMeta>([
			['recipe', defaultMeta],
			['recipe-task', recipeTaskMeta],
		])
		const query = buildRecordQuery(
			defaultMeta,
			defaultRecordFieldName,
			defaultRecordArgName,
			defaultRecordArgType,
			(slug: string) => defaultRegistry.get(slug),
			{ includeNested: true }
		)
		expect(query).toContain('recipeTasksByRecipeId(first: 50)')
	})

	it('blockWorkflows true forces lazy link into query', () => {
		const lazyWithBlockMeta: DoctypeMeta = {
			...recipeMeta,
			links: {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'lazy' }, blockWorkflows: true },
			},
		}
		const lazyWithBlockRegistry = new Map<string, DoctypeMeta>([
			['recipe', lazyWithBlockMeta],
			['recipe-task', recipeTaskMeta],
		])
		const query = buildRecordQuery(
			lazyWithBlockMeta,
			defaultRecordFieldName,
			defaultRecordArgName,
			defaultRecordArgType,
			(slug: string) => lazyWithBlockRegistry.get(slug),
			{ includeNested: true }
		)
		expect(query).toContain('recipeTasksByRecipeId')
	})
})

// ===========================================================================
// mergeNestedResults
// ===========================================================================

describe('mergeNestedResults', () => {
	it('flattens noneOrMany connection results', () => {
		const record = {
			id: 'r1',
			name: 'Test Recipe',
			recipeTasksByRecipeId: {
				nodes: [
					{ id: 't1', name: 'Task 1' },
					{ id: 't2', name: 'Task 2' },
				],
			},
		}

		const result = mergeNestedResults({ record, meta: recipeMeta, getMeta })

		expect(result.tasks).toEqual([
			{ id: 't1', name: 'Task 1' },
			{ id: 't2', name: 'Task 2' },
		])
		expect(result.recipeTasksByRecipeId).toBeUndefined()
	})

	it('leaves atMostOne links in place', () => {
		const record = {
			id: 'r1',
			name: 'Sourdough',
			supersededBy: { id: 'r2', name: 'Sourdough v2' },
		}

		const result = mergeNestedResults({ record, meta: recipeMeta, getMeta })

		expect(result.supersededBy).toEqual({ id: 'r2', name: 'Sourdough v2' })
	})

	it('returns empty array for noneOrMany link with no nodes', () => {
		const record = {
			id: 'r1',
			name: 'Test Recipe',
			recipeTasksByRecipeId: { nodes: [] },
		}

		const result = mergeNestedResults({ record, meta: recipeMeta, getMeta })

		expect(result.tasks).toEqual([])
	})

	it('handles missing connection field', () => {
		const record = {
			id: 'r1',
			name: 'Test Recipe',
		}

		const result = mergeNestedResults({ record, meta: recipeMeta, getMeta })

		expect(result.tasks).toEqual([])
	})

	it('returns original record when no links', () => {
		const result = mergeNestedResults({ record: { id: '1', name: 'Test' }, meta: scalarOnlyMeta, getMeta })
		expect(result).toEqual({ id: '1', name: 'Test' })
	})

	it('uses reverseConnectionNameFn when provided', () => {
		const record = {
			id: 'r1',
			name: 'Test Recipe',
			TasksByRecipeId: {
				nodes: [{ id: 't1', name: 'Task 1' }],
			},
		}
		// Custom function that omits the target prefix — differs from default
		const customReverseConnection: typeof defaultReverseConnectionName = ({ backlink }) => {
			const backlinkPascal = backlink!.charAt(0).toUpperCase() + snakeToCamel(backlink!).slice(1)
			return `TasksBy${backlinkPascal}Id`
		}

		const result = mergeNestedResults({
			record,
			meta: recipeMeta,
			getMeta,
			reverseConnectionNameFn: customReverseConnection,
		})

		expect(result.tasks).toEqual([{ id: 't1', name: 'Task 1' }])
		expect(result.TasksByRecipeId).toBeUndefined()
	})

	it('falls back to default when reverseConnectionNameFn not provided', () => {
		const record = {
			id: 'r1',
			name: 'Test Recipe',
			recipeTasksByRecipeId: {
				nodes: [{ id: 't1', name: 'Task 1' }],
			},
		}

		const result = mergeNestedResults({ record, meta: recipeMeta, getMeta })

		expect(result.tasks).toEqual([{ id: 't1', name: 'Task 1' }])
	})
})
