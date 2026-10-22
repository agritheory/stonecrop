import { List } from 'immutable'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
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
				{ kind: 'field', fieldname: 'onDay', component: 'ADate' },
				{ kind: 'field', fieldname: 'at', component: 'ADateTime' },
			] as any),
			{ id: 'event', initial: 'draft', states: { draft: {} } } as any,
			undefined,
			undefined,
			undefined,
			{ onDay: 'now', at: 'now' }
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

	it('generates uuidv7 for id when its starting value is the token', async () => {
		const doctype = new Doctype(
			'Row',
			List([{ kind: 'field', fieldname: 'id', component: 'ATextInput' }] as any),
			{ id: 'row', initial: 'draft', states: { draft: {} } } as any,
			undefined,
			undefined,
			undefined,
			{ id: 'uuidv7' }
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

	it('warns when a second registration replaces the first', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
		registry.registerDefaults('order', { status: 'Draft' })
		expect(warn).not.toHaveBeenCalled()
		registry.registerDefaults('Order', { status: 'Open' })
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('"order"'))
		warn.mockRestore()
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
				{ kind: 'field', fieldname: 'note', component: 'ATextInput' },
				{ kind: 'field', fieldname: 'customer', component: 'ATextInput' },
			] as any),
			{ id: 'order', initial: 'draft', states: { draft: {} } } as any,
			undefined,
			undefined,
			undefined,
			{ note: 'ready' }
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

	it("applies the app's registration over the doctype's own defaults, and lets it read them", async () => {
		const doctype = new Doctype(
			'Order',
			List([
				{ kind: 'field', fieldname: 'company', component: 'ATextInput' },
				{ kind: 'field', fieldname: 'status', component: 'ATextInput' },
				{ kind: 'field', fieldname: 'warehouse', component: 'ATextInput' },
			] as any),
			{ id: 'order', initial: 'draft', states: { draft: {} } } as any,
			undefined,
			undefined,
			undefined,
			{ company: 'ACME', status: 'Draft' }
		)
		registry.addDoctype(doctype)
		registry.registerDefaults('order', { status: 'Open', warehouse: ({ record }) => `${String(record.company)} main` })

		const { record } = await registry.composeNewRecord(doctype)
		expect(record).toEqual({ company: 'ACME', status: 'Open', warehouse: 'ACME main' })
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
			List([{ kind: 'field', fieldname: 'day', component: 'ADate' }] as any),
			{ id: 'visit', initial: 'draft', states: { draft: {} } } as any,
			undefined,
			undefined,
			undefined,
			{ day: 'now' }
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

	it('keeps the other values when one lookup fails, and reports the failure', async () => {
		const doctype = order('warehouse', 'customer')
		registry.registerDefaults('order', {
			warehouse: () => later('Main'),
			customer: () => Promise.reject(new Error('customer lookup failed')),
		})

		const { record } = await registry.composeNewRecord(doctype)
		expect(record).toStrictEqual({ warehouse: 'Main' })
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
		expect(record).toStrictEqual({})
		expect(String(warn.mock.calls.flat().join(' '))).toContain('registered defaults')
	})

	it('waits for a value nested inside a looked-up document', async () => {
		const doctype = order('x', 'y')
		registry.registerDefaults('order', async () => ({ x: 'X', y: () => later('Y') }))

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
		registry.registerDefaults('parent', { lines: () => later([{ productId: 'P-1' }]) })

		const { record } = await registry.composeNewRecord(parent)
		expect(record.lines).toEqual([{ productId: 'P-1' }])
	})

	it('takes a default read from app state', async () => {
		const doctype = order('owner', 'note')
		const auth = reactive({ user: { id: 'u1' } })
		registry.registerDefaults('order', { owner: () => auth.user, note: () => 'hi' })

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
		expect(record).toStrictEqual({ warehouse: 'Main' })
		expect(String(warn.mock.calls.flat().join(' '))).toContain('customer')
	})

	it('never changes the record after returning it', async () => {
		const doctype = order('customer')
		registry.registerDefaults('order', { customer: () => later('too late', 40) })

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

	it('starts a date inside a section as today', async () => {
		const doctype = new Doctype(
			'Visit',
			List([section('details', date('onDay'), date('day'))] as any),
			workflow('visit'),
			undefined,
			undefined,
			undefined,
			{ onDay: 'now', day: 'now' }
		)
		registry.addDoctype(doctype)

		const { record } = await registry.composeNewRecord(doctype, { now: noon })
		expect(record).toEqual({ onDay: '2026-09-29', day: '2026-09-29' })
	})

	it('reaches a section inside a section', async () => {
		const doctype = new Doctype(
			'Visit',
			List([section('outer', section('inner', date('day')))] as any),
			workflow('visit'),
			undefined,
			undefined,
			undefined,
			{ day: 'now' }
		)
		registry.addDoctype(doctype)

		const { record } = await registry.composeNewRecord(doctype, { now: noon })
		expect(record).toEqual({ day: '2026-09-29' })
	})

	it('gives a line item inside a section its own starting values', async () => {
		const line = new Doctype(
			'Line',
			List([{ kind: 'field', fieldname: 'qty', component: 'ANumericInput' }] as any),
			workflow('line'),
			undefined,
			undefined,
			undefined,
			{ qty: 1 }
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
		expect(record).toStrictEqual({})
		expect(String(warn.mock.calls.flat().join(' '))).toContain('details: no field by that name')
	})

	it('gives a line item its own starting values when its link is keyed differently from its field', async () => {
		const line = new Doctype(
			'Line',
			List([{ kind: 'field', fieldname: 'qty', component: 'ANumericInput' }] as any),
			workflow('line'),
			undefined,
			undefined,
			undefined,
			{ qty: 1 }
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
			List([{ kind: 'field', fieldname: 'qty', component: 'ANumericInput' }] as any),
			workflow('line'),
			undefined,
			undefined,
			undefined,
			{ qty: 1 }
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
			List([{ kind: 'field', fieldname: 'qty', component: 'ANumericInput' }] as any),
			workflow('line'),
			undefined,
			undefined,
			undefined,
			{ qty: 1 }
		)
		const parent = new Doctype(
			'Parent',
			List([{ kind: 'field', fieldname: 'lines', component: 'ATable', doctype: 'line' }] as any),
			workflow('parent'),
			undefined,
			{ lines: { target: 'line', cardinality: 'noneOrMany', fieldname: 'lines' } },
			undefined,
			{ lines: ['one'] }
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
		expect(record).toStrictEqual({})
		expect(lookup).not.toHaveBeenCalled()
		expect(String(warn.mock.calls.flat().join(' '))).toContain('dya: no field by that name')
	})

	it("starts an embedded record from its own doctype's defaults, under the containing doctype's", async () => {
		const address = new Doctype(
			'Address',
			List([
				{ kind: 'field', fieldname: 'city', component: 'ATextInput' },
				{ kind: 'field', fieldname: 'country', component: 'ATextInput' },
			] as any),
			workflow('address'),
			undefined,
			undefined,
			undefined,
			{ city: 'Springfield', country: 'US' }
		)
		const order = new Doctype(
			'Order',
			List([{ kind: 'field', fieldname: 'address', component: 'AForm', doctype: 'address' }] as any),
			workflow('order'),
			undefined,
			{ address: { target: 'address', cardinality: 'one', fieldname: 'address' } },
			undefined,
			{ address: { city: 'Portland' } }
		)
		registry.addDoctype(address)
		registry.addDoctype(order)

		const { record } = await registry.composeNewRecord(order)
		expect(record.address).toEqual({ city: 'Portland', country: 'US' })
	})

	it('stops and reports defaults that would start a row of the same doctype forever', async () => {
		const category = new Doctype(
			'Category',
			List([
				{ kind: 'field', fieldname: 'name', component: 'ATextInput' },
				{ kind: 'field', fieldname: 'children', component: 'ATable', doctype: 'category' },
			] as any),
			workflow('category'),
			undefined,
			{ children: { target: 'category', cardinality: 'noneOrMany', fieldname: 'children' } },
			undefined,
			{ name: 'New', children: [{}] }
		)
		registry.addDoctype(category)

		const { record } = await registry.composeNewRecord(category)
		expect(record).toStrictEqual({ name: 'New', children: [{ children: [] }] })
		expect(String(warn.mock.calls.flat().join(' '))).toContain('would never end')
	})
})

// An app opens a new record already filled in, such as a sales order made from a quotation: the values are
// checked when the app hands them over, held until that doctype's new form is built, and win over every default.
describe('a new record the app fills in', { tags: ['unit'] }, () => {
	let registry: Registry
	let warn: ReturnType<typeof vi.spyOn>

	const workflow = (id: string) => ({ id, initial: 'draft', states: { draft: {} } }) as any

	const addSalesOrder = () => {
		const line = new Doctype(
			'OrderLine',
			List([
				{ kind: 'field', fieldname: 'item', component: 'ATextInput' },
				{ kind: 'field', fieldname: 'qty', component: 'ANumericInput' },
			] as any),
			workflow('order-line'),
			undefined,
			undefined,
			undefined,
			{ qty: 1 }
		)
		const address = new Doctype(
			'Address',
			List([{ kind: 'field', fieldname: 'city', component: 'ATextInput' }] as any),
			workflow('address')
		)
		const order = new Doctype(
			'SalesOrder',
			List([
				{ kind: 'field', fieldname: 'customer', component: 'ATextInput' },
				{ kind: 'field', fieldname: 'status', component: 'ATextInput' },
				{ kind: 'field', fieldname: 'items', component: 'ATable', doctype: 'order-line' },
				{ kind: 'field', fieldname: 'shipTo', component: 'AForm', doctype: 'address' },
				{ kind: 'table', fieldname: 'notes', columns: [{ fieldname: 'text', component: 'ATextInput' }] },
			] as any),
			workflow('sales-order'),
			undefined,
			{
				items: { target: 'order-line', cardinality: 'noneOrMany', fieldname: 'items' },
				shipTo: { target: 'address', cardinality: 'one', fieldname: 'shipTo' },
			},
			undefined,
			{ status: 'Draft' }
		)
		registry.addDoctype(line)
		registry.addDoctype(address)
		registry.addDoctype(order)
		return order
	}

	beforeEach(() => {
		Registry._root = undefined as any
		registry = new Registry()
		warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
	})

	afterEach(() => {
		warn.mockRestore()
	})

	describe('prefillDraft', () => {
		const refusal = (reason: string) => new Error(`Couldn't open a new SalesOrder: ${reason}.`)

		it('holds the values under the doctype, whichever name the caller uses, until they are taken once', () => {
			addSalesOrder()
			registry.prefillDraft('SalesOrder', { customer: 'C-1' })
			expect(registry.takePrefill('sales-order')).toEqual({ customer: 'C-1' })
			expect(registry.takePrefill('sales-order')).toBeUndefined()

			registry.prefillDraft('sales-order', { customer: 'C-2' })
			expect(registry.takePrefill('SalesOrder')).toEqual({ customer: 'C-2' })
		})

		it('holds values filled under another name the doctype is registered by for its own new form', () => {
			const order = addSalesOrder()
			// The Nuxt template also registers a doctype under its file name when that differs from its slug.
			registry.registry['sales-orders'] = order
			registry.prefillDraft('sales-orders', { customer: 'C-1' })

			expect(registry.takePrefill(order.slug)).toEqual({ customer: 'C-1' })

			registry.prefillDraft('SalesOrder', { customer: 'C-2' })
			expect(registry.takePrefill('sales-orders')).toEqual({ customer: 'C-2' })
		})

		it('skips a field given as undefined, so its default stays', async () => {
			const order = addSalesOrder()
			registry.registerDefaults('sales-order', { customer: 'Walk-in' })
			registry.prefillDraft('sales-order', { customer: undefined, status: 'Open', shipTo: { city: undefined } })
			const prefill = registry.takePrefill('sales-order')

			expect(prefill).toStrictEqual({ status: 'Open', shipTo: {} })
			const { record } = await registry.composeNewRecord(order, { prefill })
			expect(record.customer).toBe('Walk-in')
		})

		it('holds numbers, booleans and null inside a value as given', () => {
			addSalesOrder()
			registry.prefillDraft('sales-order', { customer: { id: 'C-1', qty: 2, active: true, note: null } })

			expect(registry.takePrefill('sales-order')).toStrictEqual({
				customer: { id: 'C-1', qty: 2, active: true, note: null },
			})
		})

		it("skips a key given as undefined inside a field's own value", () => {
			addSalesOrder()
			registry.prefillDraft('sales-order', { customer: { id: 'C-1', displayText: undefined } })

			expect(registry.takePrefill('sales-order')).toStrictEqual({ customer: { id: 'C-1' } })
		})

		it('replaces values held for the same doctype', () => {
			addSalesOrder()
			registry.prefillDraft('sales-order', { customer: 'C-1' })
			registry.prefillDraft('sales-order', { customer: 'C-2' })

			expect(registry.takePrefill('sales-order')).toEqual({ customer: 'C-2' })
		})

		it("keeps its own copy, so a later change to the caller's object does not reach the form", () => {
			addSalesOrder()
			// A link reads back as an object on a field of its own, so a value can be an object too.
			const values = {
				customer: { id: 'C-1', displayText: 'Acme' },
				items: [{ item: 'apple' }],
				shipTo: { city: 'Paris' },
				notes: [{ text: 'Rush' }],
			}
			registry.prefillDraft('sales-order', values)
			values.customer.displayText = 'changed'
			values.items[0].item = 'pear'
			values.shipTo.city = 'Lyon'
			values.notes[0].text = 'Slow'

			expect(registry.takePrefill('sales-order')).toEqual({
				customer: { id: 'C-1', displayText: 'Acme' },
				items: [{ item: 'apple' }],
				shipTo: { city: 'Paris' },
				notes: [{ text: 'Rush' }],
			})
		})

		it.each([
			['on the record', { colour: 'red' }, 'colour'],
			['on a line', { items: [{ colour: 'red' }] }, 'items[0].colour'],
			['on an embedded record', { shipTo: { colour: 'red' } }, 'shipTo.colour'],
			["on an inline table's row", { notes: [{ colour: 'red' }] }, 'notes[0].colour'],
		])('refuses a name the doctype does not have %s, and keeps what it held', (_where, values, path) => {
			addSalesOrder()
			registry.prefillDraft('sales-order', { customer: 'C-1' })

			expect(() => registry.prefillDraft('sales-order', values)).toThrow(refusal(`it has no field "${path}"`))
			expect(registry.takePrefill('sales-order')).toEqual({ customer: 'C-1' })
		})

		it.each([
			['lines that are not a list', { items: 'apple' }, '"items" must be a list'],
			['no lines at all', { items: null }, '"items" must be a list'],
			['a line that is not a record', { items: ['apple'] }, '"items[0]" must be a record'],
			['a date as a line', { items: [new Date(0)] }, '"items[0]" must be a record'],
			['an embedded record that is not a record', { shipTo: 'Paris' }, '"shipTo" must be a record'],
			['a function as a value', { customer: () => 'C-1' }, '"customer" can\'t be a function'],
			['a function inside a line', { items: [{ item: () => 'apple' }] }, '"items[0].item" can\'t be a function'],
			['a function inside a value', { customer: { id: 'C-1', pick: () => 1 } }, '"customer.pick" can\'t be a function'],
			['a date as a value', { customer: new Date(0) }, '"customer" must be plain data'],
			['a map as a value', { customer: new Map() }, '"customer" must be plain data'],
			['a bigint as a value', { customer: BigInt(10) }, '"customer" must be plain data'],
			['a symbol inside a value', { customer: { id: Symbol('C-1') } }, '"customer.id" must be plain data'],
			['undefined inside a list value', { customer: ['C-1', undefined] }, '"customer[1]" must be plain data'],
			['values that are not a record', ['C-1'], 'its values must be a record'],
		])('refuses %s, and holds nothing', (_what, values, reason) => {
			addSalesOrder()

			expect(() => registry.prefillDraft('sales-order', values as any)).toThrow(refusal(reason))
			expect(registry.takePrefill('sales-order')).toBeUndefined()
		})

		it('takes no embedded record as null, as a read gives one that is absent', () => {
			addSalesOrder()
			registry.prefillDraft('sales-order', { shipTo: null })

			expect(registry.takePrefill('sales-order')).toEqual({ shipTo: null })
		})

		it('refuses a doctype that is not registered', () => {
			expect(() => registry.prefillDraft('NoSuchThing', { customer: 'C-1' })).toThrow(
				new Error("Couldn't open a new NoSuchThing: no doctype by that name is registered.")
			)
		})
	})

	describe('composeNewRecord with filled values', () => {
		it('puts them over every default, an empty one included', async () => {
			const order = addSalesOrder()
			registry.registerDefaults('sales-order', { customer: 'Walk-in', status: 'Open' })

			const { record } = await registry.composeNewRecord(order, { prefill: { customer: 'C-1', status: '' } })
			expect(record.customer).toBe('C-1')
			expect(record.status).toBe('')
		})

		it("gives each filled line its own doctype's defaults first", async () => {
			const order = addSalesOrder()

			const { record } = await registry.composeNewRecord(order, {
				prefill: { items: [{ item: 'apple' }, { item: 'pear', qty: 3 }] },
			})
			expect(record.items).toEqual([
				{ item: 'apple', qty: 1 },
				{ item: 'pear', qty: 3 },
			])
		})

		it('keeps them when registered defaults never answer or fail', async () => {
			const order = addSalesOrder()
			registry.registerDefaults('sales-order', {
				customer: () => new Promise<never>(() => undefined),
				status: () => Promise.reject(new Error('status lookup failed')),
			})

			const { record } = await registry.composeNewRecord(order, {
				timeoutMs: 20,
				prefill: { customer: 'C-1', status: 'From quotation' },
			})
			expect([record.customer, record.status]).toEqual(['C-1', 'From quotation'])
		})
	})
})
