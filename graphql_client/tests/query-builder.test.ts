import { describe, it, expect } from 'vitest'
import type { DoctypeMeta } from '@stonecrop/schema'

import {
	doctypeToQueryName,
	doctypeToSingleQuery,
	doctypeToListQuery,
	buildRelationshipName,
	buildSingleRecordQuery,
	buildListRecordQuery,
	transformNativeRecord,
} from '../src/query-builder'

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
		{ kind: 'field', fieldname: 'title', component: 'ATextInput' },
		{ kind: 'field', fieldname: 'customerId', component: 'AFormLink', doctype: 'party' },
	],
}

const currencyMeta: DoctypeMeta = {
	name: 'Currency',
	slug: 'currency',
	fields: [
		{ kind: 'field', fieldname: 'currencyCode', component: 'ATextInput', primaryKey: true },
		{ kind: 'field', fieldname: 'currencyName', component: 'ATextInput' },
	],
}

const allMeta = [partyMeta, salesOrderMeta, currencyMeta]

describe('doctypeToQueryName', { tags: ['unit', 'graphql'] }, () => {
	it('converts PascalCase to camelCase', () => {
		expect(doctypeToQueryName('SalesOrder')).toBe('salesOrder')
		expect(doctypeToQueryName('Party')).toBe('party')
		expect(doctypeToQueryName('Currency')).toBe('currency')
	})
})

describe('doctypeToSingleQuery', { tags: ['unit', 'graphql'] }, () => {
	it('appends ById to the camelCase name', () => {
		expect(doctypeToSingleQuery('SalesOrder')).toBe('salesOrderById')
		expect(doctypeToSingleQuery('Party')).toBe('partyById')
	})
})

describe('doctypeToListQuery', { tags: ['unit', 'graphql'] }, () => {
	it('prepends all and appends s', () => {
		expect(doctypeToListQuery('SalesOrder')).toBe('allSalesOrders')
	})

	it('handles names ending in y by converting to ies', () => {
		expect(doctypeToListQuery('Party')).toBe('allParties')
		expect(doctypeToListQuery('Currency')).toBe('allCurrencies')
	})
})

describe('buildRelationshipName', { tags: ['unit', 'graphql'] }, () => {
	it('combines target type and FK field', () => {
		expect(buildRelationshipName('Party', 'customerId')).toBe('partyByCustomerId')
		expect(buildRelationshipName('Company', 'companyId')).toBe('companyByCompanyId')
	})
})

describe('buildSingleRecordQuery', { tags: ['unit', 'graphql'] }, () => {
	it('builds a query with link field expansion', () => {
		const { query, linkFields } = buildSingleRecordQuery(salesOrderMeta, { allMeta })

		expect(query).toContain('salesOrderById(id: $id)')
		expect(query).toContain('customerId')
		expect(query).toContain('partyByCustomerId { id partyName }')
		expect(linkFields).toEqual(['customerId'])
	})

	it('does not expand links when target has no displayField', () => {
		const orderWithCurrency: DoctypeMeta = {
			name: 'Order',
			slug: 'order',
			fields: [
				{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true },
				{ kind: 'field', fieldname: 'currencyCode', component: 'AFormLink', doctype: 'currency' },
			],
		}

		const { query, linkFields } = buildSingleRecordQuery(orderWithCurrency, { allMeta })

		expect(query).toContain('currencyCode')
		expect(query).not.toContain('currencyByCurrencyCode')
		expect(linkFields).toEqual([])
	})

	it('respects maxDepth: 0 to disable expansion', () => {
		const { query, linkFields } = buildSingleRecordQuery(salesOrderMeta, { allMeta, maxDepth: 0 })

		expect(query).toContain('customerId')
		expect(query).not.toContain('partyByCustomerId')
		expect(linkFields).toEqual([])
	})
})

describe('buildListRecordQuery', { tags: ['unit', 'graphql'] }, () => {
	it('builds a query with nodes wrapper', () => {
		const { query, linkFields } = buildListRecordQuery(salesOrderMeta, { allMeta })

		expect(query).toContain('allSalesOrders')
		expect(query).toContain('nodes {')
		expect(query).toContain('partyByCustomerId { id partyName }')
		expect(linkFields).toEqual(['customerId'])
	})

	it('includes pagination parameters when provided', () => {
		const { query } = buildListRecordQuery(salesOrderMeta, {
			allMeta,
			first: 10,
			offset: 5,
		})

		expect(query).toContain('$first: Int')
		expect(query).toContain('$offset: Int')
		expect(query).toContain('first: $first')
		expect(query).toContain('offset: $offset')
	})
})

describe('transformNativeRecord', { tags: ['unit', 'graphql'] }, () => {
	it('transforms link fields to { id, displayText } objects', () => {
		const record = {
			id: '1',
			title: 'Test Order',
			customerId: 'party-uuid',
			partyByCustomerId: { id: 'party-uuid', partyName: 'Acme Corp' },
		}

		const result = transformNativeRecord(record, ['customerId'], salesOrderMeta, allMeta)

		expect(result.id).toBe('1')
		expect(result.title).toBe('Test Order')
		expect(result.customerId).toEqual({ id: 'party-uuid', displayText: 'Acme Corp' })
		expect(result.partyByCustomerId).toBeUndefined()
	})

	it('preserves non-link fields unchanged', () => {
		const record = {
			id: '1',
			title: 'Test Order',
			customerId: 'party-uuid',
			partyByCustomerId: { id: 'party-uuid', partyName: 'Acme Corp' },
		}

		const result = transformNativeRecord(record, ['customerId'], salesOrderMeta, allMeta)

		expect(result.id).toBe('1')
		expect(result.title).toBe('Test Order')
	})

	it('handles null relationship data', () => {
		const record = {
			id: '1',
			customerId: 'party-uuid',
			partyByCustomerId: null,
		}

		const result = transformNativeRecord(record, ['customerId'], salesOrderMeta, allMeta)

		expect(result.customerId).toBe('party-uuid')
	})
})
