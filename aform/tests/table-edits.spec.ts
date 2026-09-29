import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { install as installATable } from '@stonecrop/atable'

import AForm from '../src/components/AForm.vue'
import AFieldset from '../src/components/form/AFieldset.vue'
import type { ResolvedField } from '../src/types'

const contacts = {
	kind: 'table',
	fieldname: 'contacts',
	component: 'ATable',
	label: 'Contacts',
	schema: [{ fieldname: 'person', label: 'Person', component: 'ATextInput', edit: true }],
	config: { view: 'list' },
} as unknown as ResolvedField

const typeIntoCell = async (cell: ReturnType<ReturnType<typeof mount>['find']>, text: string) => {
	await cell.trigger('click')
	cell.element.textContent = text
	await cell.trigger('input')
	// ACell's own debounce before it writes the cell.
	vi.advanceTimersByTime(300)
	await nextTick()
}

describe('AForm tables', { tags: ['component'] }, () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	// Through the real ATable: the form hears a table's edit as it hears any field's.
	it('sends an edit typed into a table up as the record’s new rows', async () => {
		vi.useFakeTimers()
		const wrapper = mount(AForm, {
			props: { schema: [contacts], data: { contacts: [{ person: 'Bo' }] } },
			global: { plugins: [createPinia(), { install: installATable }] },
		})
		await nextTick()

		const cell = wrapper.find('td[data-editable="true"]')
		expect(cell.exists()).toBe(true)
		await typeIntoCell(cell, 'Bob')

		expect(wrapper.emitted('update:data')?.at(-1)?.[0]).toEqual({ contacts: [{ person: 'Bob' }] })
	})

	it('sends an edit typed into a table inside a fieldset up as the record’s new rows', async () => {
		vi.useFakeTimers()
		const people = { kind: 'fieldset', fieldname: 'people', label: 'People', schema: [contacts] } as ResolvedField
		const wrapper = mount(AForm, {
			props: { schema: [people], data: { contacts: [{ person: 'Bo' }] } },
			global: { plugins: [createPinia(), { install: installATable }], components: { AFieldset } },
		})
		await nextTick()

		const cell = wrapper.find('fieldset td[data-editable="true"]')
		expect(cell.exists()).toBe(true)
		await typeIntoCell(cell, 'Bob')

		expect(wrapper.emitted('update:data')?.at(-1)?.[0]).toEqual({ contacts: [{ person: 'Bob' }] })
	})
})
