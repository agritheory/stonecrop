import { describe, it, expect } from 'vitest'

import {
	defaultRecordFieldName,
	defaultConnectionFieldName,
	defaultOrderByTypeName,
	defaultRecordArgName,
	defaultRecordArgType,
	defaultCreateMutationName,
	defaultUpdateMutationName,
	defaultDeleteMutationName,
	defaultRecordTypeName,
} from '../src/plugin/postgraphile'

// ===========================================================================
// Read inflection helpers
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

describe('defaultRecordArgName', () => {
	it('returns "id" for all table names (standard Relay Global ID)', () => {
		expect(defaultRecordArgName('resources')).toBe('id')
		expect(defaultRecordArgName('sales_orders')).toBe('id')
	})
})

describe('defaultRecordArgType', () => {
	it('returns "UUID!" for all table names (Amber default)', () => {
		expect(defaultRecordArgType('resources')).toBe('UUID!')
		expect(defaultRecordArgType('sales_orders')).toBe('UUID!')
	})
})

// ===========================================================================
// Write mutation inflection helpers
// ===========================================================================

describe('defaultCreateMutationName', () => {
	it('singularizes and prefixes with create', () => {
		expect(defaultCreateMutationName('resources')).toBe('createResource')
	})

	it('handles snake_case table names', () => {
		expect(defaultCreateMutationName('sales_orders')).toBe('createSalesOrder')
	})

	it('handles irregular plurals', () => {
		expect(defaultCreateMutationName('statuses')).toBe('createStatus')
		expect(defaultCreateMutationName('categories')).toBe('createCategory')
	})
})

describe('defaultUpdateMutationName', () => {
	it('singularizes and wraps with update…ById', () => {
		expect(defaultUpdateMutationName('resources')).toBe('updateResourceById')
	})

	it('handles snake_case table names', () => {
		expect(defaultUpdateMutationName('sales_orders')).toBe('updateSalesOrderById')
	})
})

describe('defaultDeleteMutationName', () => {
	it('singularizes and wraps with delete…ById', () => {
		expect(defaultDeleteMutationName('resources')).toBe('deleteResourceById')
	})

	it('handles snake_case table names', () => {
		expect(defaultDeleteMutationName('sales_orders')).toBe('deleteSalesOrderById')
	})
})

describe('defaultRecordTypeName', () => {
	it('returns singular camelCase for simple plurals', () => {
		expect(defaultRecordTypeName('resources')).toBe('resource')
	})

	it('returns singular camelCase for snake_case table names', () => {
		expect(defaultRecordTypeName('sales_orders')).toBe('salesOrder')
	})

	it('handles irregular plurals', () => {
		expect(defaultRecordTypeName('statuses')).toBe('status')
		expect(defaultRecordTypeName('categories')).toBe('category')
	})
})
