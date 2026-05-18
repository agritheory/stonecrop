import { describe, it, expect } from 'vitest'

import {
	defaultRecordFieldName,
	defaultConnectionFieldName,
	defaultOrderByTypeName,
	defaultRecordArgName,
	defaultRecordArgType,
} from '../src/plugin/postgraphile'

// ===========================================================================
// Read inflection helpers
// ===========================================================================

describe('defaultRecordFieldName', { tags: ['unit', 'graphql'] }, () => {
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

describe('defaultConnectionFieldName', { tags: ['unit', 'graphql'] }, () => {
	it('prefixes with "all" and PascalCases', () => {
		expect(defaultConnectionFieldName('resources')).toBe('allResources')
	})

	it('handles snake_case', () => {
		expect(defaultConnectionFieldName('sales_orders')).toBe('allSalesOrders')
	})
})

describe('defaultOrderByTypeName', { tags: ['unit', 'graphql'] }, () => {
	it('PascalCases and appends OrderBy', () => {
		expect(defaultOrderByTypeName('resources')).toBe('ResourcesOrderBy')
	})

	it('handles snake_case', () => {
		expect(defaultOrderByTypeName('sales_orders')).toBe('SalesOrdersOrderBy')
	})
})

describe('defaultRecordArgName', { tags: ['unit', 'graphql'] }, () => {
	it('returns "id" for all table names (standard Relay Global ID)', () => {
		expect(defaultRecordArgName('resources')).toBe('id')
		expect(defaultRecordArgName('sales_orders')).toBe('id')
	})
})

describe('defaultRecordArgType', { tags: ['unit', 'graphql'] }, () => {
	it('returns "UUID!" for all table names (Amber default)', () => {
		expect(defaultRecordArgType('resources')).toBe('UUID!')
		expect(defaultRecordArgType('sales_orders')).toBe('UUID!')
	})
})
