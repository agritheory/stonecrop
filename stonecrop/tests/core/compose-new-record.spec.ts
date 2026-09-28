import { List } from 'immutable'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Doctype from '../../src/doctype'
import Registry from '../../src/registry'

describe('composeNewRecord', { tags: ['unit'] }, () => {
	let registry: Registry

	beforeEach(() => {
		Registry._root = undefined as any
		registry = new Registry()
	})

	it('resolves "now" on date and datetime fields at compose time', async () => {
		const fixed = new Date('2026-03-28T15:04:05.000Z')
		const doctype = new Doctype(
			'Event',
			List([
				{ kind: 'field', fieldname: 'onDay', component: 'ADate', default: 'now' },
				{ kind: 'field', fieldname: 'at', component: 'ADateTime', default: 'now' },
			] as any),
			{ id: 'event', initial: 'draft', states: { draft: {} } } as any
		)
		registry.addDoctype(doctype)

		const { record } = await registry.composeNewRecord(doctype, { now: fixed })
		expect(record.onDay).toBe('2026-03-28')
		expect(record.at).toBe(fixed.toISOString())
	})

	it('resolves "now" on a datetime field from the doctype defaults document', async () => {
		const fixed = new Date('2026-03-28T15:04:05.000Z')
		const doctype = new Doctype(
			'Order',
			List([{ kind: 'field', fieldname: 'createdAt', component: 'ADateTime' }] as any),
			{ id: 'order', initial: 'draft', states: { draft: {} } } as any,
			undefined,
			undefined,
			undefined,
			{ createdAt: 'now' }
		)
		registry.addDoctype(doctype)

		const { record } = await registry.composeNewRecord(doctype, { now: fixed })
		expect(record.createdAt).toBe(fixed.toISOString())
	})

	it('resolves "now" inside a defaults table row', async () => {
		const fixed = new Date('2026-03-28T12:00:00.000Z')
		const line = new Doctype('Line', List([{ kind: 'field', fieldname: 'postingDate', component: 'ADate' }] as any), {
			id: 'line',
			initial: 'draft',
			states: { draft: {} },
		} as any)
		const parent = new Doctype(
			'Parent',
			List([{ kind: 'field', fieldname: 'lines', component: 'ATable', doctype: 'line' }] as any),
			{ id: 'parent', initial: 'draft', states: { draft: {} } } as any,
			undefined,
			{ lines: { target: 'line', cardinality: 'noneOrMany', fieldname: 'lines' } },
			undefined,
			{ lines: [{ postingDate: 'now' }] }
		)
		registry.addDoctype(line)
		registry.addDoctype(parent)

		const { record } = await registry.composeNewRecord(parent, { now: fixed })
		expect(record.lines).toEqual([{ postingDate: '2026-03-28' }])
	})

	it('generates uuidv7 for id when default is the token', async () => {
		const doctype = new Doctype(
			'Row',
			List([{ kind: 'field', fieldname: 'id', component: 'ATextInput', default: 'uuidv7' }] as any),
			{ id: 'row', initial: 'draft', states: { draft: {} } } as any
		)
		registry.addDoctype(doctype)

		const first = await registry.composeNewRecord(doctype)
		const second = await registry.composeNewRecord(doctype)
		expect(typeof first.record.id).toBe('string')
		expect(first.record.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
		expect(second.record.id).not.toBe(first.record.id)
	})

	it('applies a sync registered function before returning the record', async () => {
		const doctype = new Doctype(
			'Order',
			List([{ kind: 'field', fieldname: 'status', component: 'ADropdown' }] as any),
			{ id: 'order', initial: 'draft', states: { draft: {} } } as any
		)
		registry.addDoctype(doctype)
		registry.registerDefaults('order', () => ({ status: 'Draft' }))

		const { record } = await registry.composeNewRecord(doctype)
		expect(record.status).toBe('Draft')
	})

	it('patches an awaitable field after the sync record is returned', async () => {
		const doctype = new Doctype(
			'Order',
			List([
				{ kind: 'field', fieldname: 'note', component: 'ATextInput', default: 'ready' },
				{ kind: 'field', fieldname: 'customer', component: 'ATextInput' },
			] as any),
			{ id: 'order', initial: 'draft', states: { draft: {} } } as any
		)
		registry.addDoctype(doctype)

		let resolveCustomer!: (value: string) => void
		const customerPromise = new Promise<string>(resolve => {
			resolveCustomer = resolve
		})

		registry.registerDefaults('order', {
			customer: () => customerPromise,
		})

		const { record, settled } = await registry.composeNewRecord(doctype)
		expect(record.note).toBe('ready')
		expect(record.customer).toBe('')

		resolveCustomer('acme')
		const final = await settled
		expect(final.customer).toBe('acme')
	})

	it('leaves a many-table empty when defaults omit it', async () => {
		const line = new Doctype('Line', List([{ kind: 'field', fieldname: 'qty', component: 'ANumericInput' }] as any), {
			id: 'line',
			initial: 'draft',
			states: { draft: {} },
		} as any)
		const parent = new Doctype(
			'Parent',
			List([{ kind: 'field', fieldname: 'lines', component: 'ATable', doctype: 'line' }] as any),
			{ id: 'parent', initial: 'draft', states: { draft: {} } } as any,
			undefined,
			{ lines: { target: 'line', cardinality: 'noneOrMany', fieldname: 'lines' } }
		)
		registry.addDoctype(line)
		registry.addDoctype(parent)

		const { record } = await registry.composeNewRecord(parent)
		expect(record.lines).toEqual([])
	})

	it('does not invoke the defaults loader during resolveSchema', () => {
		const loader = vi.fn()
		registry.setDefaultsLoader(loader)
		const doctype = new Doctype('Task', List([{ kind: 'field', fieldname: 'title', component: 'ATextInput' }] as any), {
			id: 'task',
			initial: 'draft',
			states: { draft: {} },
		} as any)
		registry.addDoctype(doctype)
		registry.resolveSchema(doctype)
		expect(loader).not.toHaveBeenCalled()
	})
})
