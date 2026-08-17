import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { Registry, Stonecrop } from '@stonecrop/stonecrop'

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

	it('unwraps an inline link back to the id that gets persisted', async () => {
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

		expect(stonecrop.getStore().get('order.o-1.agentId')).toBe('p-2')
	})

	it('never writes a display sibling into the record', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		buildOrder(registry, stonecrop)

		const wrapper = mountDesktop(registry, stonecrop, recordAdapter('order', 'o-1'))
		await nextTick()

		await wrapper.findComponent({ name: 'AForm' }).vm.$emit('update:data', {
			id: 'o-1',
			agentId: 'p-2',
			agentId__display: 'Globex',
		})
		await nextTick()

		expect(stonecrop.getStore().has('order.o-1.agentId__display')).toBe(false)
	})

	// The suffix is not what identifies a display sibling — the doctype is. A real field that
	// happens to end in `__display` belongs to the record and must be written like any other.
	it('writes a real field whose name ends in the display suffix', async () => {
		const registry = new Registry()
		const stonecrop = new Stonecrop(registry)
		const doctype = buildDoctype('banner', 'draft', { draft: {} }, [
			{ kind: 'field' as const, fieldname: 'hero__display', label: 'Hero Display', component: 'ATextInput' },
		] as any)
		registry.addDoctype(doctype)
		stonecrop.addRecord('banner', 'b-1', { id: 'b-1', hero__display: 'before' })

		const wrapper = mountDesktop(registry, stonecrop, recordAdapter('banner', 'b-1'))
		await nextTick()

		await wrapper.findComponent({ name: 'AForm' }).vm.$emit('update:data', {
			id: 'b-1',
			hero__display: 'after',
		})
		await nextTick()

		expect(stonecrop.getStore().get('banner.b-1.hero__display')).toBe('after')
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
