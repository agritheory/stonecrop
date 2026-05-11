import { describe, it, expect } from 'vitest'

import { schemaToColumns } from '../src/schemaToColumns'
import type { ColumnSchema } from '@stonecrop/schema'

describe('schemaToColumns', () => {
	it('maps fieldname to name', () => {
		const schema: ColumnSchema[] = [{ fieldname: 'item_name', fieldtype: 'Data', label: 'Item Name' }]
		const columns = schemaToColumns(schema)
		expect(columns[0].name).toBe('item_name')
		expect((columns[0] as any).fieldname).toBeUndefined()
	})

	it('preserves label, fieldtype, width, align', () => {
		const schema: ColumnSchema[] = [
			{ fieldname: 'qty', fieldtype: 'Int', label: 'Quantity', width: '10ch', align: 'right' },
		]
		const columns = schemaToColumns(schema)
		expect(columns[0].label).toBe('Quantity')
		expect(columns[0].fieldtype).toBe('Int')
		expect(columns[0].width).toBe('10ch')
		expect(columns[0].align).toBe('right')
	})

	it('filters out fields with hidden: true', () => {
		const schema: ColumnSchema[] = [
			{ fieldname: 'visible', fieldtype: 'Data', label: 'Visible' },
			{ fieldname: 'secret', fieldtype: 'Data', label: 'Secret', hidden: true },
		]
		const columns = schemaToColumns(schema)
		expect(columns).toHaveLength(1)
		expect(columns[0].name).toBe('visible')
	})

	it('filters out fields without fieldtype (nested table/fieldset entries)', () => {
		const schema = [
			{ fieldname: 'title', fieldtype: 'Data', label: 'Title' },
			{ fieldname: 'sub_items' } as ColumnSchema,
		]
		const columns = schemaToColumns(schema)
		expect(columns).toHaveLength(1)
		expect(columns[0].name).toBe('title')
	})

	it('strips hidden from output', () => {
		const schema: ColumnSchema[] = [{ fieldname: 'title', fieldtype: 'Data', label: 'Title', hidden: false }]
		const columns = schemaToColumns(schema)
		expect((columns[0] as any).hidden).toBeUndefined()
	})

	it('passes through extra properties (cellComponent, cellComponentProps, pinned, format)', () => {
		const schema: ColumnSchema[] = [
			{
				fieldname: 'status',
				fieldtype: 'Select',
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
			{ fieldname: 'a', fieldtype: 'Data', hidden: true },
			{ fieldname: 'b', fieldtype: 'Data', hidden: true },
		]
		expect(schemaToColumns(schema)).toEqual([])
	})

	it('preserves field order', () => {
		const schema: ColumnSchema[] = [
			{ fieldname: 'z', fieldtype: 'Data', label: 'Z' },
			{ fieldname: 'a', fieldtype: 'Data', label: 'A' },
			{ fieldname: 'm', fieldtype: 'Data', label: 'M' },
		]
		expect(schemaToColumns(schema).map(c => c.name)).toEqual(['z', 'a', 'm'])
	})
})
