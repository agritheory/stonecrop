import { List } from 'immutable'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'

import Doctype from '../../src/doctype'
import Registry from '../../src/registry'

describe('composeNewRecord', { tags: ['unit'] }, () => {
	let registry: Registry

	beforeEach(() => {
		Registry._root = undefined as any
		registry = new Registry()
	})

	it('resolves "now" on date and datetime fields at compose time', async () => {
		const fixed = new Date(2026, 2, 28, 15, 4, 5)
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
		const fixed = new Date(2026, 2, 28, 12)
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

	it("applies defaults registered under the doctype's name", async () => {
		const doctype = new Doctype(
			'OrderItem',
			List([{ kind: 'field', fieldname: 'qty', component: 'ANumericInput' }] as any),
			{ id: 'order-item', initial: 'draft', states: { draft: {} } } as any
		)
		registry.addDoctype(doctype)
		registry.registerDefaults('OrderItem', { qty: 5 })

		const { record } = await registry.composeNewRecord(doctype)
		expect(record.qty).toBe(5)
	})

	it('waits for an awaitable field before returning the record', async () => {
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

		const composing = registry.composeNewRecord(doctype)
		resolveCustomer('acme')
		const { record } = await composing
		expect(record.note).toBe('ready')
		expect(record.customer).toBe('acme')
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

// "now" on a date field is the day on the user's own calendar. Pinned zones, because the runner's own zone hides
// the difference: CI runs in UTC, where the calendar day and the UTC day agree.
describe.each(['America/Los_Angeles', 'Asia/Tokyo'])('composeNewRecord gives today in %s', zone => {
	let registry: Registry

	beforeEach(() => {
		vi.stubEnv('TZ', zone)
		Registry._root = undefined as any
		registry = new Registry()
	})

	afterEach(() => {
		vi.unstubAllEnvs()
	})

	it("as the user's own date, morning and evening", async () => {
		const doctype = new Doctype(
			'Visit',
			List([{ kind: 'field', fieldname: 'day', component: 'ADate', default: 'now' }] as any),
			{ id: 'visit', initial: 'draft', states: { draft: {} } } as any
		)
		registry.addDoctype(doctype)

		const morning = await registry.composeNewRecord(doctype, { now: new Date(2026, 8, 29, 8) })
		const evening = await registry.composeNewRecord(doctype, { now: new Date(2026, 8, 29, 20) })
		expect([morning.record.day, evening.record.day]).toEqual(['2026-09-29', '2026-09-29'])
	})
})

// A form is filled once, with every starting value, so nothing can land on top of what a user types. These
// are the ways a value that arrives late, fails, or never arrives used to reach the user.
describe('composeNewRecord waits for every starting value', { tags: ['unit'] }, () => {
	let registry: Registry
	let warn: ReturnType<typeof vi.spyOn>

	const workflow = (id: string) => ({ id, initial: 'draft', states: { draft: {} } }) as any
	const text = (fieldname: string) => ({ kind: 'field', fieldname, component: 'ATextInput' })
	const later = <T>(value: T, ms = 5) => new Promise<T>(resolve => setTimeout(() => resolve(value), ms))
	const order = (...fieldnames: string[]) => {
		const doctype = new Doctype('Order', List(fieldnames.map(text) as any), workflow('order'))
		registry.addDoctype(doctype)
		return doctype
	}

	beforeEach(() => {
		Registry._root = undefined as any
		registry = new Registry()
		warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
	})

	afterEach(() => {
		warn.mockRestore()
	})

	it('keeps a value the caller pre-filled over a looked-up default', async () => {
		const doctype = order('customer')
		registry.registerDefaults('order', { customer: () => later('first-customer-in-db') as any })

		const { record } = await registry.composeNewRecord(doctype, { overlay: { customer: 'ACME' } })
		expect(record.customer).toBe('ACME')
	})

	it('keeps the other values when one lookup fails, and reports the failure', async () => {
		const doctype = order('warehouse', 'customer')
		registry.registerDefaults('order', {
			warehouse: () => later('Main') as any,
			customer: () => Promise.reject(new Error('customer lookup failed')) as any,
		})

		const { record } = await registry.composeNewRecord(doctype)
		expect(record.warehouse).toBe('Main')
		expect(record.customer).toBe('')
		expect(String(warn.mock.calls.flat().join(' '))).toContain('customer lookup failed')
	})

	it('keeps the other values when a default function throws, and reports it', async () => {
		const doctype = order('a', 'b')
		registry.registerDefaults('order', {
			a: () => {
				throw new Error('bug in default a')
			},
			b: 'still filled',
		})

		const { record } = await registry.composeNewRecord(doctype)
		expect(record.b).toBe('still filled')
		expect(String(warn.mock.calls.flat().join(' '))).toContain('bug in default a')
	})

	it('reports a defaults source that gives back something other than a document', async () => {
		const doctype = order('status')
		registry.registerDefaults('order', (() => 'Open') as any)

		const { record } = await registry.composeNewRecord(doctype)
		expect(record.status).toBe('')
		expect(String(warn.mock.calls.flat().join(' '))).toContain('registered defaults')
	})

	it('tries the loader again for the next new record after it fails', async () => {
		const doctype = order('status')
		let calls = 0
		registry.setDefaultsLoader(async () => {
			if (++calls === 1) throw new Error('network blip')
			return { status: 'Open' }
		})

		const first = await registry.composeNewRecord(doctype)
		const second = await registry.composeNewRecord(doctype)
		expect(first.record.status).toBe('')
		expect(second.record.status).toBe('Open')
	})

	it('gives two new records opened at once the loaded values, from one load', async () => {
		const doctype = order('status')
		const loader = vi.fn(() => later({ status: 'Open' }))
		registry.setDefaultsLoader(loader)

		const [a, b] = await Promise.all([registry.composeNewRecord(doctype), registry.composeNewRecord(doctype)])
		expect([a.record.status, b.record.status]).toEqual(['Open', 'Open'])
		expect(loader).toHaveBeenCalledTimes(1)
	})

	it('waits for a value nested inside a looked-up document', async () => {
		const doctype = order('x', 'y')
		registry.registerDefaults('order', async () => ({ x: 'X', y: () => later('Y') }) as any)

		const { record } = await registry.composeNewRecord(doctype)
		expect([record.x, record.y]).toEqual(['X', 'Y'])
	})

	it('waits for the rows of a table', async () => {
		const line = new Doctype('Line', List([text('productId')] as any), workflow('line'))
		const parent = new Doctype(
			'Parent',
			List([{ kind: 'field', fieldname: 'lines', component: 'ATable', doctype: 'line' }] as any),
			workflow('parent'),
			undefined,
			{ lines: { target: 'line', cardinality: 'noneOrMany', fieldname: 'lines' } }
		)
		registry.addDoctype(line)
		registry.addDoctype(parent)
		registry.registerDefaults('parent', { lines: () => later([{ productId: 'P-1' }]) as any })

		const { record } = await registry.composeNewRecord(parent)
		expect(record.lines).toEqual([{ productId: 'P-1' }])
	})

	it('takes a default read from app state', async () => {
		const doctype = order('owner', 'note')
		const auth = reactive({ user: { id: 'u1' } })
		registry.registerDefaults('order', { owner: () => auth.user as any, note: () => 'hi' })

		const { record } = await registry.composeNewRecord(doctype)
		expect(record.owner).toEqual({ id: 'u1' })
		expect(record.note).toBe('hi')
	})

	it('gives up on a lookup that never answers, keeps the rest, and reports it', async () => {
		const doctype = order('customer', 'warehouse')
		registry.registerDefaults('order', {
			customer: () => new Promise<never>(() => undefined),
			warehouse: 'Main',
		})

		const { record } = await registry.composeNewRecord(doctype, { timeoutMs: 20 })
		expect(record.customer).toBe('')
		expect(record.warehouse).toBe('Main')
		expect(String(warn.mock.calls.flat().join(' '))).toContain('customer')
	})

	it('never changes the record after returning it', async () => {
		const doctype = order('customer')
		registry.registerDefaults('order', { customer: () => later('too late', 40) as any })

		const { record } = await registry.composeNewRecord(doctype, { timeoutMs: 10 })
		const returned = { ...record }
		await later(null, 60)
		expect(record).toEqual(returned)
	})
})

// A grouped section is layout: its fields are the record's own keys, so they take starting values like any other.
describe('composeNewRecord fills the fields inside a grouped section', { tags: ['unit'] }, () => {
	let registry: Registry
	let warn: ReturnType<typeof vi.spyOn>

	const workflow = (id: string) => ({ id, initial: 'draft', states: { draft: {} } }) as any
	const section = (fieldname: string, ...schema: any[]) => ({ kind: 'fieldset', fieldname, label: fieldname, schema })
	const date = (fieldname: string, extra = {}) => ({ kind: 'field', fieldname, component: 'ADate', ...extra })
	const noon = new Date(2026, 8, 29, 12, 0, 0)

	beforeEach(() => {
		Registry._root = undefined as any
		registry = new Registry()
		warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
	})

	afterEach(() => {
		warn.mockRestore()
	})

	it('starts a date inside a section as today, from its field default or the defaults document', async () => {
		const doctype = new Doctype(
			'Visit',
			List([section('details', date('onDay', { default: 'now' }), date('day'))] as any),
			workflow('visit'),
			undefined,
			undefined,
			undefined,
			{ day: 'now' }
		)
		registry.addDoctype(doctype)

		const { record } = await registry.composeNewRecord(doctype, { now: noon })
		expect(record).toEqual({ onDay: '2026-09-29', day: '2026-09-29' })
	})

	it('reaches a section inside a section', async () => {
		const doctype = new Doctype(
			'Visit',
			List([section('outer', section('inner', date('day', { default: 'now' })))] as any),
			workflow('visit')
		)
		registry.addDoctype(doctype)

		const { record } = await registry.composeNewRecord(doctype, { now: noon })
		expect(record).toEqual({ day: '2026-09-29' })
	})

	it('gives a line item inside a section its own starting values', async () => {
		const line = new Doctype(
			'Line',
			List([{ kind: 'field', fieldname: 'qty', component: 'ANumericInput', default: 1 }] as any),
			workflow('line')
		)
		const parent = new Doctype(
			'Parent',
			List([section('items', { kind: 'field', fieldname: 'lines', component: 'ATable', doctype: 'line' })] as any),
			workflow('parent'),
			undefined,
			{ lines: { target: 'line', cardinality: 'noneOrMany', fieldname: 'lines' } },
			undefined,
			{ lines: [{}] }
		)
		registry.addDoctype(line)
		registry.addDoctype(parent)

		const { record } = await registry.composeNewRecord(parent)
		expect(record.lines).toEqual([{ qty: 1 }])
	})

	it("reports and skips a starting value given under a section's name", async () => {
		const doctype = new Doctype(
			'Visit',
			List([section('details', date('day'))] as any),
			workflow('visit'),
			undefined,
			undefined,
			undefined,
			{ details: { day: '2026-01-01' } }
		)
		registry.addDoctype(doctype)

		const { record } = await registry.composeNewRecord(doctype)
		expect(record).toEqual({ day: null })
		expect(String(warn.mock.calls.flat().join(' '))).toContain('details: no field by that name')
	})

	it('gives a line item its own starting values when its link is keyed differently from its field', async () => {
		const line = new Doctype(
			'Line',
			List([{ kind: 'field', fieldname: 'qty', component: 'ANumericInput', default: 1 }] as any),
			workflow('line')
		)
		const parent = new Doctype(
			'Parent',
			List([{ kind: 'field', fieldname: 'lines', component: 'ATable', doctype: 'line' }] as any),
			workflow('parent'),
			undefined,
			{ lineItems: { target: 'line', cardinality: 'noneOrMany', fieldname: 'lines' } },
			undefined,
			{ lines: [{}] }
		)
		registry.addDoctype(line)
		registry.addDoctype(parent)

		const { record } = await registry.composeNewRecord(parent)
		expect(record.lines).toEqual([{ qty: 1 }])
	})

	it("gives the rows of a table inside an embedded record their own doctype's starting values", async () => {
		const line = new Doctype(
			'Line',
			List([{ kind: 'field', fieldname: 'qty', component: 'ANumericInput', default: 1 }] as any),
			workflow('line')
		)
		const shipment = new Doctype(
			'Shipment',
			List([{ kind: 'field', fieldname: 'lines', component: 'ATable', doctype: 'line' }] as any),
			workflow('shipment'),
			undefined,
			{ lines: { target: 'line', cardinality: 'noneOrMany', fieldname: 'lines' } }
		)
		const order = new Doctype(
			'Order',
			List([{ kind: 'field', fieldname: 'shipment', component: 'AForm', doctype: 'shipment' }] as any),
			workflow('order'),
			undefined,
			{ shipment: { target: 'shipment', cardinality: 'one', fieldname: 'shipment' } },
			undefined,
			{ shipment: { lines: [{}] } }
		)
		registry.addDoctype(line)
		registry.addDoctype(shipment)
		registry.addDoctype(order)

		const { record } = await registry.composeNewRecord(order)
		expect(record.shipment).toEqual({ lines: [{ qty: 1 }] })
	})

	it('reports a table row given as something other than a document, and starts it empty', async () => {
		const line = new Doctype(
			'Line',
			List([{ kind: 'field', fieldname: 'qty', component: 'ANumericInput', default: 1 }] as any),
			workflow('line')
		)
		const parent = new Doctype(
			'Parent',
			List([{ kind: 'field', fieldname: 'lines', component: 'ATable', doctype: 'line' }] as any),
			workflow('parent'),
			undefined,
			{ lines: { target: 'line', cardinality: 'noneOrMany', fieldname: 'lines' } },
			undefined,
			{ lines: ['one'] } as any
		)
		registry.addDoctype(line)
		registry.addDoctype(parent)

		const { record } = await registry.composeNewRecord(parent)
		expect(record.lines).toEqual([{ qty: 1 }])
		expect(String(warn.mock.calls.flat().join(' '))).toContain('lines[0]: gave back "one"')
	})

	it('reports and skips a starting value for a field the doctype does not have', async () => {
		const doctype = new Doctype('Visit', List([date('day')] as any), workflow('visit'))
		registry.addDoctype(doctype)
		const lookup = vi.fn(() => 'never asked')
		registry.registerDefaults('visit', { dya: lookup })

		const { record } = await registry.composeNewRecord(doctype)
		expect(record).toEqual({ day: null })
		expect(lookup).not.toHaveBeenCalled()
		expect(String(warn.mock.calls.flat().join(' '))).toContain('dya: no field by that name')
	})
})
