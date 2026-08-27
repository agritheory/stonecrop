import { List } from 'immutable'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { Doctype, Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import type { RouteAdapter } from '../../src/types'

import { buildDoctype, makeStonecropPlugin } from './desktop.helpers'

afterEach(() => {
	Registry._root = undefined as any
	Stonecrop._root = undefined as any
})

const recordAdapter = (doctype: string, recordId: string): RouteAdapter => ({
	getCurrentDoctype: () => doctype,
	getCurrentRecordId: () => recordId,
	getCurrentView: () => 'record',
	navigate: vi.fn(),
})

const mountDesktop = (registry: Registry, stonecrop: Stonecrop, adapter: RouteAdapter) =>
	mount(Desktop, {
		props: { routeAdapter: adapter },
		global: {
			plugins: [makeStonecropPlugin(registry, stonecrop)],
			stubs: { AForm: true, SheetNav: true, CommandPalette: true, ActionSet: true },
		},
	})

describe('Desktop — link values on write', { tags: ['component'] }, () => {
	// An inline link and an expanded one are both fields carrying `doctype`, and both hold an object
	// with an `id` by the time AForm emits. Only the component says which is which, so a write path
	// that inspects the value instead cannot tell them apart.
	const buildOrder = (registry: Registry, stonecrop: Stonecrop) => {
		const doctype = buildDoctype('order', 'draft', { draft: {} }, [
			{ kind: 'field' as const, fieldname: 'customer', label: 'Customer', component: 'AForm', doctype: 'party' },
			{ kind: 'field' as const, fieldname: 'agentId', label: 'Agent', component: 'AFormLink', doctype: 'party' },
		] as any)
		registry.addDoctype(doctype)
		stonecrop.addRecord('order', 'o-1', {
			id: 'o-1',
			title: 'Order One',
			customer: { id: 'p-1', partyName: 'Acme Corp' },
			agentId: 'p-2',
		})
	}

	it('keeps an expanded link a whole record, and the edit that triggered the write', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		buildOrder(registry, stonecrop)

		const wrapper = mountDesktop(registry, stonecrop, recordAdapter('order', 'o-1'))
		await nextTick()

		await wrapper.findComponent({ name: 'AForm' }).vm.$emit('update:data', {
			id: 'o-1',
			title: 'Order One',
			customer: { id: 'p-1', partyName: 'Acme Corp EDITED' },
			agentId: { id: 'p-2', displayText: 'Globex' },
		})
		await nextTick()

		// Unwrapping this to 'p-1' would replace the embedded record with its own id — the nested
		// data gone and the edit that caused the write discarded with it.
		expect(stonecrop.getStore().get('order.o-1.customer')).toEqual({ id: 'p-1', partyName: 'Acme Corp EDITED' })
	})

	// The store keeps what the adapter returned, because nothing else holds the display text: the
	// field, the list cell and a later read all need it. Reducing it here is what left a form
	// rendering raw ids the moment anything edited it.
	it('keeps an inline link resolved in the store', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		buildOrder(registry, stonecrop)

		const wrapper = mountDesktop(registry, stonecrop, recordAdapter('order', 'o-1'))
		await nextTick()

		await wrapper.findComponent({ name: 'AForm' }).vm.$emit('update:data', {
			id: 'o-1',
			agentId: { id: 'p-2', displayText: 'Globex' },
		})
		await nextTick()

		expect(stonecrop.getStore().get('order.o-1.agentId')).toEqual({ id: 'p-2', displayText: 'Globex' })
	})

	// The regression: editing `title` used to rewrite every inline link on the record as a bare id,
	// so a link resolved by the adapter went blank on the first keystroke in an unrelated field.
	it('leaves a link the edit never touched exactly as it was', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		buildOrder(registry, stonecrop)
		stonecrop.getStore().set('order.o-1.agentId', { id: 'p-2', displayText: 'Globex' })

		const wrapper = mountDesktop(registry, stonecrop, recordAdapter('order', 'o-1'))
		await nextTick()

		await wrapper.findComponent({ name: 'AForm' }).vm.$emit('update:data', {
			id: 'o-1',
			title: 'Order One EDITED',
			agentId: { id: 'p-2', displayText: 'Globex' },
		})
		await nextTick()

		expect(stonecrop.getStore().get('order.o-1.agentId')).toEqual({ id: 'p-2', displayText: 'Globex' })
	})

	// The Actions dropdown is the path a user clicks; `emitAction` below is slot convenience.
	// Three call sites emit `action`, so a reduction added back at one would hide behind the others.
	it('emits the store shape on a transition fired from the Actions menu', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		const doctype = buildDoctype(
			'order',
			'draft',
			{ draft: { on: { SUBMIT: 'submitted' } }, submitted: { type: 'final' } },
			[
				{ kind: 'field' as const, fieldname: 'customer', label: 'Customer', component: 'AForm', doctype: 'party' },
				{ kind: 'field' as const, fieldname: 'agentId', label: 'Agent', component: 'AFormLink', doctype: 'party' },
			] as any
		)
		registry.addDoctype(doctype)
		stonecrop.addRecord('order', 'o-1', {
			id: 'o-1',
			status: 'draft',
			customer: { id: 'p-1', partyName: 'Acme Corp' },
			agentId: { id: 'p-2', displayText: 'Globex' },
		})

		// ActionSet unstubbed, so the transition is read off what Desktop actually rendered.
		const wrapper = mount(Desktop, {
			props: { routeAdapter: recordAdapter('order', 'o-1') },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, SheetNav: true, CommandPalette: true },
			},
		})
		await nextTick()

		const elements = wrapper.findComponent({ name: 'ActionSet' }).props('elements') as any[]
		const dropdown = elements?.find(e => e.type === 'dropdown')
		expect(dropdown?.actions?.length).toBeGreaterThan(0)
		dropdown.actions[0].action()
		await nextTick()

		const [payload] = wrapper.emitted('action')![0] as [{ data: Record<string, any> }]
		// Both shapes cross untouched — reducing the inline one is the adapter's job.
		expect(payload.data.agentId).toEqual({ id: 'p-2', displayText: 'Globex' })
		expect(payload.data.customer).toEqual({ id: 'p-1', partyName: 'Acme Corp' })
	})

	// A third emit site, built by `getAvailableCommands` — a guard over transitions cannot see it.
	it('emits the store shape on a stateless Command', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		const schema = List([
			{ kind: 'field' as const, fieldname: 'id', label: 'ID', component: 'ATextInput' },
			{ kind: 'field' as const, fieldname: 'status', label: 'Status', component: 'ATextInput' },
			{ kind: 'field' as const, fieldname: 'agentId', label: 'Agent', component: 'AFormLink', doctype: 'party' },
		] as any)
		const workflow = { states: ['PROCESSING'], actions: { print: { label: 'Print', stateless: true } } }
		registry.addDoctype(new Doctype('order', schema, workflow))
		stonecrop.addRecord('order', 'o-1', {
			id: 'o-1',
			status: 'PROCESSING',
			agentId: { id: 'p-2', displayText: 'Globex' },
		})

		const wrapper = mount(Desktop, {
			props: { routeAdapter: recordAdapter('order', 'o-1') },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop)],
				stubs: { AForm: true, SheetNav: true, CommandPalette: true },
			},
		})
		await nextTick()

		const elements = wrapper.findComponent({ name: 'ActionSet' }).props('elements') as any[]
		const command = elements?.find(e => e.type === 'dropdown')?.actions?.find((a: any) => a.label === 'Print')
		expect(command).toBeDefined()
		command.action()
		await nextTick()

		const [payload] = wrapper.emitted('action')![0] as [{ data: Record<string, any> }]
		expect(payload.data.agentId).toEqual({ id: 'p-2', displayText: 'Globex' })
	})

	it('emits the store shape on the action it emits', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		buildOrder(registry, stonecrop)
		stonecrop.getStore().set('order.o-1.agentId', { id: 'p-2', displayText: 'Globex' })

		const wrapper = mountDesktop(registry, stonecrop, recordAdapter('order', 'o-1'))
		await nextTick()

		const { emitAction } = wrapper.vm.$.provides['desktopMethods'] as {
			emitAction: (name: string, data?: Record<string, any>) => void
		}
		emitAction('save')
		await nextTick()

		const [payload] = wrapper.emitted('action')![0] as [{ data: Record<string, any> }]
		expect(payload.data.agentId).toEqual({ id: 'p-2', displayText: 'Globex' })
		// An expanded link crosses the wire whole — it is the record, not a reference to one.
		expect(payload.data.customer).toEqual({ id: 'p-1', partyName: 'Acme Corp' })
	})
})

describe('Desktop — link display text resolution', { tags: ['component'] }, () => {
	const resolverFor = async (meta: Record<string, unknown>) => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		registry.addDoctype(buildDoctype('order', 'draft', { draft: {} }))
		stonecrop.addRecord('order', 'o-1', { id: 'o-1' })
		// The record the link points at, already cached — so a resolver that finds a display value
		// does so without any fetch, and one that returns nothing did so by choice.
		stonecrop.addRecord('party', 'p-1', { id: 'p-1', name: 'Acme Corp', title: 'Acme', partyName: 'Acme Corp' })
		registry.getMeta = vi.fn().mockResolvedValue(meta)

		const wrapper = mountDesktop(registry, stonecrop, recordAdapter('order', 'o-1'))
		await nextTick()

		return wrapper.vm.$.provides['aformLinkResolver'] as (doctype: string, id: string) => Promise<string | undefined>
	}

	it('reads the field the target doctype declares', async () => {
		const resolve = await resolverFor({ name: 'Party', displayField: 'partyName' })
		await expect(resolve('party', 'p-1')).resolves.toBe('Acme Corp')
	})

	// Deliberate: the previous `name ?? title ?? displayText` fallback guessed, and guessed wrong on
	// any doctype whose `name` column is not its label. A doctype that nominates no display field
	// gets its raw id rendered, which is visibly unhelpful rather than quietly incorrect — and the
	// record here carries `name` and `title`, so a reintroduced heuristic fails this.
	it('resolves nothing when the target doctype nominates no display field', async () => {
		const resolve = await resolverFor({ name: 'Party' })
		await expect(resolve('party', 'p-1')).resolves.toBeUndefined()
	})
})
