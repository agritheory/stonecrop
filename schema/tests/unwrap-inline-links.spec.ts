import { describe, it, expect } from 'vite-plus/test'

import { unwrapInlineLinks } from '../src/index'
import type { DoctypeField, RelatedDoctype } from '../src/index'

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

	it("reduces a fieldset child, held as the record's own key", () => {
		const fields = [fieldset('details', [link('customerId', 'AFormLink')])]
		expect(unwrapInlineLinks(fields, { customerId: { id: 'p-1', displayText: 'Dover' } })).toEqual({
			customerId: 'p-1',
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

describe('unwrapInlineLinks across declared relations', { tags: ['unit'] }, () => {
	const task: RelatedDoctype = {
		fields: [text('name'), link('workstationId', 'AFormLink')],
		links: { checks: { target: 'task-check', cardinality: 'noneOrMany' } },
	}
	const taskCheck: RelatedDoctype = { fields: [link('inspectorId', 'AFormLink')] }
	const doctypes: Record<string, RelatedDoctype> = { 'job-task': task, 'task-check': taskCheck }
	const resolve = (target: string) => doctypes[target]
	const picked = (id: string) => ({ id, displayText: `name of ${id}` })

	it("reduces an inline link inside each row of a many relation, by the row's own doctype", () => {
		const record = {
			name: 'job',
			tasks: [
				{ name: 'A', workstationId: picked('w-1') },
				{ name: 'B', workstationId: 'w-2' },
			],
		}
		const links = { tasks: { target: 'job-task', cardinality: 'noneOrMany' as const } }
		expect(unwrapInlineLinks([text('name')], record, { links, resolve })).toEqual({
			name: 'job',
			tasks: [
				{ name: 'A', workstationId: 'w-1' },
				{ name: 'B', workstationId: 'w-2' },
			],
		})
	})

	it('reduces an inline link inside the record of a one relation', () => {
		const links = { primaryTask: { target: 'job-task', cardinality: 'one' as const } }
		const record = { primaryTask: { name: 'A', workstationId: picked('w-1') } }
		expect(unwrapInlineLinks([], record, { links, resolve })).toEqual({
			primaryTask: { name: 'A', workstationId: 'w-1' },
		})
	})

	it('reads the rows from the fieldname a relation declares, as the read path writes them', () => {
		const links = { taskRows: { target: 'job-task', cardinality: 'noneOrMany' as const, fieldname: 'tasks' } }
		const record = { tasks: [{ workstationId: picked('w-1') }] }
		expect(unwrapInlineLinks([], record, { links, resolve })).toEqual({ tasks: [{ workstationId: 'w-1' }] })
	})

	it("descends through a row's own relations", () => {
		const links = { tasks: { target: 'job-task', cardinality: 'noneOrMany' as const } }
		const record = { tasks: [{ workstationId: picked('w-1'), checks: [{ inspectorId: picked('i-1') }] }] }
		expect(unwrapInlineLinks([], record, { links, resolve })).toEqual({
			tasks: [{ workstationId: 'w-1', checks: [{ inspectorId: 'i-1' }] }],
		})
	})

	it('treats a relation rendered as a picker as the link field it is, not as a record', () => {
		const fields = [link('ownerId', 'AFormLink')]
		const links = { ownerId: { target: 'job-task', cardinality: 'one' as const } }
		expect(unwrapInlineLinks(fields, { ownerId: picked('t-1') }, { links, resolve })).toEqual({ ownerId: 't-1' })
	})

	it('leaves the rows of a relation whose doctype is not registered as they came', () => {
		const links = { tasks: { target: 'unregistered', cardinality: 'noneOrMany' as const } }
		const record = { tasks: [{ workstationId: picked('w-1') }] }
		expect(unwrapInlineLinks([], record, { links, resolve })).toEqual(record)
	})

	it('does not mutate the rows it is given', () => {
		const links = { tasks: { target: 'job-task', cardinality: 'noneOrMany' as const } }
		const row = { workstationId: picked('w-1') }
		unwrapInlineLinks([], { tasks: [row] }, { links, resolve })
		expect(row.workstationId).toEqual(picked('w-1'))
	})
})
