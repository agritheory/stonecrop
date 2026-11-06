import { flushPromises, mount } from '@vue/test-utils'
import { List } from 'immutable'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { install as installAForm } from '@stonecrop/aform'
import { Doctype, Registry, Stonecrop, useOperationLogStore } from '@stonecrop/stonecrop'

import Desktop from '../../src/components/Desktop.vue'
import type { RouteAdapter } from '../../src/types'

import { makeStonecropPlugin } from './desktop.helpers'

// Two fields filled before Vue re-renders, as a script filling several fields at once does, keep only the last
// (#559): the store keeps the old name, and the log records the name set and then set back. This pins that
// behaviour, so it fails once it changes; turn it round then.
function buildContactDoctype() {
	const fields = List([
		{ kind: 'field' as const, fieldname: 'id', label: 'ID', component: 'ATextInput', primaryKey: true },
		{ kind: 'field' as const, fieldname: 'name', label: 'Name', component: 'ATextInput' },
		{ kind: 'field' as const, fieldname: 'email', label: 'Email', component: 'ATextInput' },
	])
	const workflow = { states: ['draft'], actions: { save: { label: 'Save', selfTransition: true } } }
	return new Doctype('contact', fields, workflow as any)
}

const routeAdapter: RouteAdapter = {
	getCurrentDoctype: () => 'contact',
	getCurrentRecordId: () => 'c-1',
	getCurrentView: () => 'record',
	navigate: vi.fn(),
}

const fillNow = (input: HTMLInputElement, text: string) => {
	input.value = text
	input.dispatchEvent(new Event('input', { bubbles: true }))
}

describe('Desktop, two fields filled at once', { tags: ['component'] }, () => {
	let registry: Registry
	let stonecrop: Stonecrop
	let pinia: ReturnType<typeof createPinia>

	beforeEach(() => {
		pinia = createPinia()
		setActivePinia(pinia)
		registry = new Registry()
		stonecrop = new Stonecrop(registry)
		registry.addDoctype(buildContactDoctype())
		stonecrop.addRecord('contact', 'c-1', { id: 'c-1', name: 'Ada', email: 'ada@example.com' })
	})

	afterEach(() => {
		Registry._root = undefined as any
		Stonecrop._root = undefined as any
	})

	it('stores and logs only the last edit, with the first set back', async () => {
		const wrapper = mount(Desktop, {
			props: { routeAdapter },
			global: {
				plugins: [makeStonecropPlugin(registry, stonecrop), pinia, { install: installAForm }],
				stubs: { ActionSet: true, SheetNav: true, CommandPalette: true },
			},
		})
		await flushPromises()
		const input = (fieldname: string) => wrapper.find(`input[id$="-${fieldname}"]`).element as HTMLInputElement
		fillNow(input('name'), 'Bea')
		fillNow(input('email'), 'bea@example.com')
		await flushPromises()

		const record = stonecrop.getRecordById('contact', 'c-1')
		expect(record?.get('name')).toBe('Ada')
		expect(record?.get('email')).toBe('bea@example.com')
		const fieldEdits = useOperationLogStore()
			.operations.filter(operation => operation.path.startsWith('contact.c-1.'))
			.map(operation => [operation.path, operation.beforeValue, operation.afterValue])
		expect(fieldEdits).toEqual([
			['contact.c-1.name', 'Ada', 'Bea'],
			['contact.c-1.name', 'Bea', 'Ada'],
			['contact.c-1.email', 'ada@example.com', 'bea@example.com'],
		])
	})
})
