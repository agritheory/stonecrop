import { describe, it, expect } from 'vite-plus/test'

import {
	componentParts,
	componentTakesParts,
	parseField,
	partsPatch,
	readParts,
	validateDoctype,
	validateField,
} from '../src'

const field = (fieldname: string, component = 'ATextInput') => ({ fieldname, component })

const quantity = (parts: Record<string, string>, component = 'AQuantityInput') => ({
	fieldname: 'quantity',
	component,
	label: 'Quantity',
	parts,
})

const total = (fieldname: string) => ({
	fieldname,
	component: 'ACurrencyInput',
	parts: { amount: fieldname, currency: 'currencyCode', exchangeRate: 'exchangeRate' },
})

const fieldMessages = (data: unknown) =>
	validateField(data)
		.errors.map(error => error.message)
		.join('\n')

const doctypeMessages = (fields: unknown[]) =>
	validateDoctype({ name: 'OrderLine', fields })
		.errors.map(error => error.message)
		.join('\n')

describe('a field whose component edits parts held in several fields', { tags: ['unit'] }, () => {
	it('keeps the parts it declares', () => {
		expect(parseField(quantity({ qty: 'quantity', uom: 'uom' }))).toMatchObject({
			kind: 'field',
			parts: { qty: 'quantity', uom: 'uom' },
		})
	})

	it('refuses a missing part, and one the component does not have', () => {
		expect(fieldMessages(quantity({ qty: 'quantity' }))).toContain('"uom"')
		expect(fieldMessages(quantity({ qty: 'quantity', uom: 'uom', size: 'size' }))).toContain('"size"')
	})

	it('refuses parts on a component that edits a single value', () => {
		expect(fieldMessages(quantity({ qty: 'quantity', uom: 'uom' }, 'ATextInput'))).toContain('ATextInput')
	})

	it('refuses a field named by two parts', () => {
		expect(fieldMessages(quantity({ qty: 'quantity', uom: 'quantity' }))).toContain('more than one part')
	})

	it('refuses parts that leave out the field itself', () => {
		expect(fieldMessages(quantity({ qty: 'amount', uom: 'uom' }))).toContain('"quantity"')
	})

	it('names the parts each component edits', () => {
		expect(componentParts('AQuantityInput')).toEqual(['qty', 'uom'])
		expect(componentParts('ACurrencyInput')).toEqual(['amount', 'currency', 'exchangeRate'])
		expect(componentParts('ATextInput')).toBeUndefined()
		expect(componentParts(undefined)).toBeUndefined()
	})
})

describe('a doctype whose fields edit parts held in other fields', { tags: ['unit'] }, () => {
	it('refuses a part naming a field the doctype does not have', () => {
		expect(doctypeMessages([quantity({ qty: 'quantity', uom: 'unit' }), field('uom')])).toContain('"unit"')
	})

	it('lets several amounts share one currency and one rate', () => {
		const fields = [
			total('netTotal'),
			total('grandTotal'),
			field('currencyCode', 'AFormLink'),
			field('exchangeRate', 'ANumericInput'),
		]
		expect(validateDoctype({ name: 'Order', fields })).toEqual({ success: true, errors: [] })
	})

	it('finds a part held in a fieldset', () => {
		const fields = [quantity({ qty: 'quantity', uom: 'uom' }), { fieldname: 'details', schema: [field('uom')] }]
		expect(validateDoctype({ name: 'OrderLine', fields })).toEqual({ success: true, errors: [] })
	})
})

describe('reading and writing a field’s parts', { tags: ['unit'] }, () => {
	const parts = { qty: 'quantity', uom: 'uom' }

	it('reads each part from its field', () => {
		expect(readParts(parts, { quantity: 5, uom: 'Box', note: 'x' })).toEqual({ qty: 5, uom: 'Box' })
	})

	it('writes back only the parts that changed, and nothing the component derives', () => {
		const record = { quantity: 5, uom: 'Box', note: 'x' }
		const edited = { qty: 7, uom: 'Box', stockQty: 84, stockUom: 'Nos', conversionFactor: 12 }
		expect(partsPatch(parts, record, edited)).toEqual({ quantity: 7 })
	})

	it('leaves an empty part as the record holds it', () => {
		expect(partsPatch(parts, { quantity: null, uom: null }, { qty: 3, uom: null })).toEqual({ quantity: 3 })
	})
})

// An app's own component reads other fields of its record through `parts`, the one way that works for
// a record not yet saved.
describe('an app’s own component reading other fields of its record', { tags: ['unit'] }, () => {
	const chart = (parts: Record<string, string>) => ({ fieldname: 'chart', component: 'PlanChart', parts })
	const lines = (parts: Record<string, string>, component?: string) => ({
		fieldname: 'lines',
		...(component ? { component } : {}),
		columns: [{ fieldname: 'deliveryDate' }],
		parts,
	})

	it('names whatever parts it reads, without naming its own field', () => {
		expect(parseField(chart({ start: 'startDate', end: 'endDate' }))).toMatchObject({
			kind: 'field',
			parts: { start: 'startDate', end: 'endDate' },
		})
	})

	it('still refuses a field named by two parts', () => {
		expect(fieldMessages(chart({ start: 'startDate', end: 'startDate' }))).toContain('more than one part')
	})

	it('lets a table rendered by an app’s own component declare parts', () => {
		expect(parseField(lines({ deliveryDate: 'deliveryDate' }, 'OrderLines'))).toMatchObject({
			kind: 'table',
			parts: { deliveryDate: 'deliveryDate' },
		})
	})

	it('refuses parts on a table ATable renders, named or by default', () => {
		expect(fieldMessages(lines({ deliveryDate: 'deliveryDate' }, 'ATable'))).toContain('ATable')
		expect(fieldMessages(lines({ deliveryDate: 'deliveryDate' }))).toContain('ATable')
	})

	it('refuses a part naming a field the doctype does not have', () => {
		const fields = [lines({ deliveryDate: 'dueDate' }, 'OrderLines'), field('deliveryDate', 'ADatePicker')]
		expect(doctypeMessages(fields)).toContain('"dueDate"')
	})

	it('finds the fields its parts name, a table among them', () => {
		const fields = [
			chart({ start: 'startDate', end: 'endDate', lines: 'lines' }),
			field('startDate', 'ADatePicker'),
			field('endDate', 'ADatePicker'),
			lines({ deliveryDate: 'deliveryDate' }, 'OrderLines'),
			field('deliveryDate', 'ADatePicker'),
		]
		expect(validateDoctype({ name: 'Plan', fields })).toEqual({ success: true, errors: [] })
	})

	it('tells which components take parts', () => {
		expect(componentTakesParts('AQuantityInput')).toBe(true)
		expect(componentTakesParts('PlanChart')).toBe(true)
		expect(componentTakesParts('ATextInput')).toBe(false)
		expect(componentTakesParts('ATable')).toBe(false)
	})
})
