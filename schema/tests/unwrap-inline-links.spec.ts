import { describe, it, expect } from 'vitest'

import { unwrapInlineLinks } from '../src/index'
import type { DoctypeField } from '../src/index'

const link = (fieldname: string, component: string) =>
	({ kind: 'field', fieldname, component, doctype: 'party' }) as DoctypeField

const text = (fieldname: string) => ({ kind: 'field', fieldname, component: 'ATextInput' }) as DoctypeField

const fieldset = (fieldname: string, schema: DoctypeField[]) =>
	({ kind: 'fieldset', fieldname, schema }) as DoctypeField

describe('unwrapInlineLinks', { tags: ['unit'] }, () => {
	it('reduces an inline link to its id', () => {
		const fields = [link('customerId', 'AFormLink')]
		expect(unwrapInlineLinks(fields, { customerId: { id: 'p-1', displayText: 'Dover Street' } })).toEqual({
			customerId: 'p-1',
		})
	})

	it('leaves an expanded link intact — its object is the record', () => {
		const fields = [link('customer', 'AForm')]
		const record = { customer: { id: 'p-1', partyName: 'Dover Street' } }
		expect(unwrapInlineLinks(fields, record)).toEqual(record)
	})

	it('leaves a link with an unmapped custom component intact', () => {
		const fields = [link('customer', 'PartyCard')]
		const record = { customer: { id: 'p-1', partyName: 'Dover Street' } }
		expect(unwrapInlineLinks(fields, record)).toEqual(record)
	})

	it('passes an unresolved inline link through as the bare id it already is', () => {
		const fields = [link('customerId', 'AFormLink')]
		expect(unwrapInlineLinks(fields, { customerId: 'p-1' })).toEqual({ customerId: 'p-1' })
	})

	it('passes null and undefined link values through', () => {
		const fields = [link('customerId', 'AFormLink')]
		expect(unwrapInlineLinks(fields, { customerId: null })).toEqual({ customerId: null })
		expect(unwrapInlineLinks(fields, { customerId: undefined })).toEqual({ customerId: undefined })
	})

	it('leaves fields the doctype does not declare as inline links alone', () => {
		const fields = [link('customerId', 'AFormLink'), text('title')]
		const record = { customerId: { id: 'p-1', displayText: 'Dover' }, title: { id: 'not-a-link' } }
		expect(unwrapInlineLinks(fields, record)).toEqual({ customerId: 'p-1', title: { id: 'not-a-link' } })
	})

	it('reduces a fieldset child held flat, as the store holds it', () => {
		const fields = [fieldset('details', [link('customerId', 'AFormLink')])]
		expect(unwrapInlineLinks(fields, { customerId: { id: 'p-1', displayText: 'Dover' } })).toEqual({
			customerId: 'p-1',
		})
	})

	it('reduces a fieldset child held nested, as a form emits it', () => {
		const fields = [fieldset('details', [link('customerId', 'AFormLink')])]
		expect(unwrapInlineLinks(fields, { details: { customerId: { id: 'p-1', displayText: 'Dover' } } })).toEqual({
			details: { customerId: 'p-1' },
		})
	})

	it('does not mutate the record it is given', () => {
		const fields = [link('customerId', 'AFormLink')]
		const record = { customerId: { id: 'p-1', displayText: 'Dover' } }
		unwrapInlineLinks(fields, record)
		expect(record.customerId).toEqual({ id: 'p-1', displayText: 'Dover' })
	})

	it('returns the record untouched when the doctype declares no inline link', () => {
		const fields = [text('title')]
		const record = { title: 'x' }
		expect(unwrapInlineLinks(fields, record)).toBe(record)
	})
})
