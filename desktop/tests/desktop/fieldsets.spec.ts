import { flushPromises, mount } from '@vue/test-utils'
import { List } from 'immutable'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { install as installAForm } from '@stonecrop/aform'
import { Doctype, Registry, Stonecrop } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import type { RouteAdapter } from '../../src/types'

import { makeStonecropPlugin } from './desktop.helpers'

// A fieldset is layout: its fields are the record's own, held flat by the store and the server,
// and the form reads and writes them there too.
function buildGadgetDoctype() {
	const fields = List([
		{ kind: 'field' as const, fieldname: 'id', label: 'ID', component: 'ATextInput', primaryKey: true },
		{
			kind: 'fieldset' as const,
			fieldname: 'info_fieldset',
			label: 'Info',
			component: 'AFieldset',
			schema: [
				{ kind: 'field' as const, fieldname: 'color', label: 'Color', component: 'ATextInput' },
				{ kind: 'field' as const, fieldname: 'weight', label: 'Weight', component: 'ATextInput' },
			],
		},
	])
	const workflow = { states: ['draft'], actions: { save: { label: 'Save', selfTransition: true } } }
	return new Doctype('gadget', fields as any, workflow as any, undefined, undefined, undefined, { color: 'grey' })
}

const adapterFor = (recordId: string): RouteAdapter => ({
	getCurrentDoctype: () => 'gadget',
	getCurrentRecordId: () => recordId,
	getCurrentView: () => 'record',
	navigate: vi.fn(),
})

describe('Desktop fieldsets', { tags: ['component'] }, () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let pinia: ReturnType<typeof createPinia>

	beforeEach(() => {
		pinia = createPinia()
		setActivePinia(pinia)
		registry = new Registry()
		stonecrop = new Stonecrop(registry)
		registry.addDoctype(buildGadgetDoctype())
	})

	afterEach(() => {
		Registry._root = undefined as any
		Stonecrop._root = undefined as any
	})

	const mountAt = (recordId: string, stubs: Record<string, boolean>, plugins: unknown[] = []) =>
		mount(Desktop, {
			props: { routeAdapter: adapterFor(recordId) },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), pinia, ...plugins],
				stubs: { ActionSet: true, SheetNav: true, CommandPalette: true, ...stubs },
			},
		})

	it('hands the form the record as stored, fieldset fields included', async () => {
		stonecrop.addRecord('gadget', 'g-1', { id: 'g-1', color: 'red', weight: '10g' })
		const wrapper = mountAt('g-1', { AForm: true })
		await nextTick()

		expect(wrapper.findComponent({ name: 'AForm' }).props('data')).toEqual({ id: 'g-1', color: 'red', weight: '10g' })
	})

	it('seeds a draft with the declared default of a field inside a fieldset', async () => {
		const wrapper = mountAt('new', { AForm: true })
		await flushPromises()

		expect(wrapper.findComponent({ name: 'AForm' }).props('data')).toMatchObject({ color: 'grey' })
	})

	// Through the real form and fieldset: a hand-fired `update:data` once kept this green while no
	// fieldset ever sent one.
	it('saves a value typed into a field inside a fieldset', async () => {
		stonecrop.addRecord('gadget', 'g-1', { id: 'g-1', color: 'red', weight: '10g' })
		const wrapper = mountAt('g-1', {}, [{ install: installAForm }])
		await flushPromises()

		const color = wrapper.findAll('fieldset input').find(input => (input.element as HTMLInputElement).value === 'red')
		expect(color).toBeDefined()
		await color!.setValue('blue')
		await flushPromises()

		const elements = wrapper.findComponent({ name: 'ActionSet' }).props('elements') as any[]
		const save = elements.find(element => element.type === 'dropdown')?.actions.find((a: any) => a.label === 'Save')
		save.action()
		await nextTick()

		const [payload] = wrapper.emitted('action')!.at(-1) as [{ data: Record<string, unknown> }]
		expect(payload.data).toEqual({ id: 'g-1', color: 'blue', weight: '10g' })
	})
})
