import { describe, it, expect } from 'vitest'

import {
	defaultRecordFieldName,
	defaultConnectionFieldName,
	defaultOrderByTypeName,
	buildRecordQuery,
	buildListQuery,
	queryableFieldNames,
	RELATION_FIELDTYPES,
} from '../src/plugin/postgraphile'

import type { DoctypeMeta } from '@stonecrop/schema'

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

/** A simple doctype with only scalar fields */
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

/** A doctype that includes Link and Doctype (relation) fields alongside scalars */
const mixedFieldsMeta: DoctypeMeta = {
	name: 'Recipe',
	tableName: 'recipes',
	fields: [
		{ fieldname: 'id', fieldtype: 'Data', label: 'ID' },
		{ fieldname: 'title', fieldtype: 'Data', label: 'Title' },
		{ fieldname: 'created_at', fieldtype: 'Datetime', label: 'Created' },
		// FK object reference — requires sub-selection, should be skipped
		{ fieldname: 'userByCreatedBy', fieldtype: 'Link', label: 'Creator', options: 'user' },
		// Reverse relation connection — requires sub-selection, should be skipped
		{
			fieldname: 'recipeIngredientsByRecipeId',
			fieldtype: 'Doctype',
			label: 'Ingredients',
			options: 'recipe-ingredient',
		},
		{ fieldname: 'rating', fieldtype: 'Float', label: 'Rating' },
	],
}

// ===========================================================================
// Inflection helpers
// ===========================================================================

describe('defaultRecordFieldName', () => {
	it('singularizes regular plurals and appends ById', () => {
		expect(defaultRecordFieldName('resources')).toBe('resourceById')
	})

	it('handles irregular plurals (statuses → status)', () => {
		expect(defaultRecordFieldName('statuses')).toBe('statusById')
	})

	it('handles irregular plurals (categories → category)', () => {
		expect(defaultRecordFieldName('categories')).toBe('categoryById')
	})

	it('handles irregular plurals (addresses → address)', () => {
		expect(defaultRecordFieldName('addresses')).toBe('addressById')
	})

	it('handles snake_case table names', () => {
		expect(defaultRecordFieldName('sales_orders')).toBe('salesOrderById')
	})

	it('handles already-singular names', () => {
		expect(defaultRecordFieldName('resource')).toBe('resourceById')
	})
})

describe('defaultConnectionFieldName', () => {
	it('prefixes with "all" and PascalCases', () => {
		expect(defaultConnectionFieldName('resources')).toBe('allResources')
	})

	it('handles snake_case', () => {
		expect(defaultConnectionFieldName('sales_orders')).toBe('allSalesOrders')
	})
})

describe('defaultOrderByTypeName', () => {
	it('PascalCases and appends OrderBy', () => {
		expect(defaultOrderByTypeName('resources')).toBe('ResourcesOrderBy')
	})

	it('handles snake_case', () => {
		expect(defaultOrderByTypeName('sales_orders')).toBe('SalesOrdersOrderBy')
	})
})

// ===========================================================================
// Query builders — relation field filtering (Issue 5)
// ===========================================================================

describe('queryableFieldNames', () => {
	it('returns all fields when none are relational', () => {
		const names = queryableFieldNames(scalarOnlyMeta)
		expect(names).toContain('id')
		expect(names).toContain('name')
		expect(names).toContain('quantity')
		expect(names).toContain('is_active')
	})

	it('excludes Link and Doctype fields', () => {
		const names = queryableFieldNames(mixedFieldsMeta)
		expect(names).toContain('id')
		expect(names).toContain('title')
		expect(names).toContain('created_at')
		expect(names).toContain('rating')
		expect(names).not.toContain('userByCreatedBy')
		expect(names).not.toContain('recipeIngredientsByRecipeId')
	})
})

describe('RELATION_FIELDTYPES', () => {
	it('contains Link and Doctype', () => {
		expect(RELATION_FIELDTYPES.has('Link')).toBe(true)
		expect(RELATION_FIELDTYPES.has('Doctype')).toBe(true)
	})

	it('does not contain scalar types', () => {
		expect(RELATION_FIELDTYPES.has('Data')).toBe(false)
		expect(RELATION_FIELDTYPES.has('Int')).toBe(false)
	})
})

// ===========================================================================
// buildRecordQuery
// ===========================================================================

describe('buildRecordQuery', () => {
	it('generates valid query with only scalar fields', () => {
		const query = buildRecordQuery(scalarOnlyMeta, defaultRecordFieldName)
		expect(query).toContain('query GetRecord($id: UUID!)')
		expect(query).toContain('resourceById(id: $id)')
		expect(query).toContain('id')
		expect(query).toContain('name')
		expect(query).toContain('quantity')
	})

	it('excludes relation fields from selection', () => {
		const query = buildRecordQuery(mixedFieldsMeta, defaultRecordFieldName)
		expect(query).toContain('title')
		expect(query).toContain('rating')
		expect(query).not.toContain('userByCreatedBy')
		expect(query).not.toContain('recipeIngredientsByRecipeId')
	})

	it('uses custom recordFieldName inflection', () => {
		const customInflection = (t: string) => `${t}ByRowId`
		const query = buildRecordQuery(scalarOnlyMeta, customInflection)
		expect(query).toContain('resourcesByRowId(id: $id)')
	})
})

// ===========================================================================
// buildListQuery — variable declarations (Issue 3)
// ===========================================================================

describe('buildListQuery', () => {
	const identity = (t: string) => t

	it('declares no variables when no args are provided', () => {
		const query = buildListQuery(scalarOnlyMeta, {}, defaultConnectionFieldName, defaultOrderByTypeName)
		// Should be just "query GetRecords {" with no parenthesized variable declarations
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
