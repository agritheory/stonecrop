import { describe, it, expect } from 'vitest'

import { schemaToColumns } from '../src/schemaToColumns'
import type { ColumnSchema } from '@stonecrop/schema'

describe('schemaToColumns', { tags: ['component'] }, () => {
	it('maps fieldname to name', () => {
		const schema: ColumnSchema[] = [{ fieldname: 'item_name', component: 'ATextInput', label: 'Item Name' }]
		const columns = schemaToColumns(schema)
		expect(columns[0].name).toBe('item_name')
		expect((columns[0] as any).fieldname).toBeUndefined()
	})

	it('preserves label, component, width, align', () => {
		const schema: ColumnSchema[] = [
			{ fieldname: 'qty', component: 'ANumericInput', label: 'Quantity', width: '10ch', align: 'right' },
		]
		const columns = schemaToColumns(schema)
		expect(columns[0].label).toBe('Quantity')
		expect(columns[0].component).toBe('ANumericInput')
		expect(columns[0].width).toBe('10ch')
		expect(columns[0].align).toBe('right')
	})

	it('filters out fields with hidden: true', () => {
		const schema: ColumnSchema[] = [
			{ fieldname: 'visible', component: 'ATextInput', label: 'Visible' },
			{ fieldname: 'secret', component: 'ATextInput', label: 'Secret', hidden: true },
		]
		const columns = schemaToColumns(schema)
		expect(columns).toHaveLength(1)
		expect(columns[0].name).toBe('visible')
	})

	it('filters out fields without a component (nested table/fieldset entries)', () => {
		const schema = [
			{ fieldname: 'title', component: 'ATextInput', label: 'Title' },
			{ fieldname: 'sub_items' } as ColumnSchema,
		]
		const columns = schemaToColumns(schema)
		expect(columns).toHaveLength(1)
		expect(columns[0].name).toBe('title')
	})

	it('strips hidden from output', () => {
		const schema: ColumnSchema[] = [{ fieldname: 'title', component: 'ATextInput', label: 'Title', hidden: false }]
		const columns = schemaToColumns(schema)
		expect((columns[0] as any).hidden).toBeUndefined()
	})

	it('passes through extra properties (cellComponent, cellComponentProps, pinned, format)', () => {
		const schema: ColumnSchema[] = [
			{
				fieldname: 'status',
				component: 'ADropdown',
				label: 'Status',
				cellComponent: 'StatusBadge',
				cellComponentProps: { color: 'green' },
				pinned: true,
				format: '(v) => v.toUpperCase()',
			},
		]
		const columns = schemaToColumns(schema)
		expect(columns[0].cellComponent).toBe('StatusBadge')
		expect(columns[0].cellComponentProps).toEqual({ color: 'green' })
		expect(columns[0].pinned).toBe(true)
		expect(columns[0].format).toBe('(v) => v.toUpperCase()')
	})

	it('returns empty array for empty input', () => {
		expect(schemaToColumns([])).toEqual([])
	})

	it('returns empty array when all fields are hidden', () => {
		const schema: ColumnSchema[] = [
			{ fieldname: 'a', component: 'ATextInput', hidden: true },
			{ fieldname: 'b', component: 'ATextInput', hidden: true },
		]
		expect(schemaToColumns(schema)).toEqual([])
	})

	describe('Link field handling', () => {
		it('adds a display format function for Link fields without explicit format or cellComponent', () => {
			const schema: ColumnSchema[] = [
				{ fieldname: 'category_id', label: 'Category', component: 'AFormLink', doctype: 'category' } as any,
			]
			const columns = schemaToColumns(schema)
			expect(typeof columns[0].format).toBe('function')
			expect((columns[0].format as Function)('cat-1')).toBe('cat-1')
			expect((columns[0].format as Function)({ id: 'cat-1', displayText: 'Personal' })).toBe('Personal')
			expect((columns[0].format as Function)({ id: 'cat-1' })).toBe('cat-1')
			expect((columns[0].format as Function)(null)).toBe('')
			expect((columns[0].format as Function)(undefined)).toBe('')
		})

		it('sets linkDoctype from the field doctype property', () => {
			const schema = [
				{ fieldname: 'category_id', component: 'AFormLink', label: 'Category', doctype: 'category' },
			] as ColumnSchema[]
			const columns = schemaToColumns(schema)
			expect(columns[0].linkDoctype).toBe('category')
		})

		it('leaves linkDoctype undefined for a column that is not a link', () => {
			// `doctype` is what makes a column a link — without it this is a plain scalar column.
			const schema: ColumnSchema[] = [{ fieldname: 'ref_id', component: 'ATextInput', label: 'Ref' }]
			const columns = schemaToColumns(schema)
			expect(columns[0].linkDoctype).toBeUndefined()
		})

		it('does not override an explicit format on a Link field', () => {
			const schema: ColumnSchema[] = [
				{
					fieldname: 'customer_id',
					component: 'AFormLink',
					doctype: 'customer',
					label: 'Customer',
					format: '(v) => v.toUpperCase()',
				},
			]
			const columns = schemaToColumns(schema)
			expect(columns[0].format).toBe('(v) => v.toUpperCase()')
		})

		it('does not set linkDoctype or format when cellComponent is already set', () => {
			const schema = [
				{
					fieldname: 'customer_id',
					component: 'AFormLink',
					label: 'Customer',
					cellComponent: 'MyLinkCell',
					doctype: 'customer',
				},
			] as ColumnSchema[]
			const columns = schemaToColumns(schema)
			expect(columns[0].format).toBeUndefined()
			expect(columns[0].linkDoctype).toBeUndefined()
		})

		it('does not add format for non-Link fields', () => {
			const schema: ColumnSchema[] = [{ fieldname: 'title', component: 'ATextInput', label: 'Title' }]
			const columns = schemaToColumns(schema)
			expect(columns[0].format).toBeUndefined()
			expect(columns[0].linkDoctype).toBeUndefined()
		})
	})

	describe('Quantity field handling', () => {
		it('adds a "<qty> <uom>" format for quantity fields without an explicit format', () => {
			const schema: ColumnSchema[] = [{ fieldname: 'qty', component: 'AQuantityInput', label: 'Quantity' }]
			const columns = schemaToColumns(schema)
			expect(typeof columns[0].format).toBe('function')
			expect((columns[0].format as Function)({ qty: 2, uom: 'Box' })).toBe('2 Box')
			expect((columns[0].format as Function)(null)).toBe('')
		})

		it('does not override an explicit format on a quantity field', () => {
			const schema: ColumnSchema[] = [
				{ fieldname: 'qty', component: 'AQuantityInput', label: 'Quantity', format: '(v) => v.qty' },
			]
			const columns = schemaToColumns(schema)
			expect(columns[0].format).toBe('(v) => v.qty')
		})
	})

	describe('Currency field handling', () => {
		it('adds a formatCurrency function for currency-category fields without explicit format', () => {
			const schema: ColumnSchema[] = [{ fieldname: 'total', component: 'ACurrencyInput', label: 'Total' }]
			const columns = schemaToColumns(schema)
			expect(typeof columns[0].format).toBe('function')
			expect((columns[0].format as Function)({ amount: 5, currency: { id: 'USD', displayText: 'US Dollar' } })).toBe(
				'5 US Dollar'
			)
		})

		it('does not override an explicit format on a currency field', () => {
			const schema: ColumnSchema[] = [
				{ fieldname: 'total', component: 'ACurrencyInput', label: 'Total', format: '(v) => v.amount' },
			]
			const columns = schemaToColumns(schema)
			expect(columns[0].format).toBe('(v) => v.amount')
		})

		it('does not add format for non-currency fields', () => {
			const schema: ColumnSchema[] = [{ fieldname: 'title', component: 'ATextInput', label: 'Title' }]
			const columns = schemaToColumns(schema)
			expect(columns[0].format).toBeUndefined()
		})
	})

	describe('Date field handling', () => {
		it('formats YYYY-MM-DD as a local calendar day', () => {
			const schema: ColumnSchema[] = [{ fieldname: 'ship_date', component: 'ADate', label: 'Ship Date' }]
			const columns = schemaToColumns(schema)
			expect(typeof columns[0].format).toBe('function')
			expect((columns[0].format as Function)('2025-08-05')).toBe(new Date(2025, 7, 5).toLocaleDateString())
		})

		it('does not override an explicit format on a date field', () => {
			const schema: ColumnSchema[] = [
				{ fieldname: 'ship_date', component: 'ADate', label: 'Ship Date', format: '(v) => v' },
			]
			const columns = schemaToColumns(schema)
			expect(columns[0].format).toBe('(v) => v')
		})
	})

	it('preserves field order', () => {
		const schema: ColumnSchema[] = [
			{ fieldname: 'z', component: 'ATextInput', label: 'Z' },
			{ fieldname: 'a', component: 'ATextInput', label: 'A' },
			{ fieldname: 'm', component: 'ATextInput', label: 'M' },
		]
		expect(schemaToColumns(schema).map(c => c.name)).toEqual(['z', 'a', 'm'])
	})

	it('excludes fields without a component', () => {
		const schema: ColumnSchema[] = [
			{ fieldname: 'title', component: 'ATextInput', label: 'Title' },
			{ fieldname: 'nested', label: 'Nested' }, // no component → non-scalar, excluded
		]
		expect(schemaToColumns(schema).map(c => c.name)).toEqual(['title'])
	})
})
