import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it } from 'vite-plus/test'
import { defineComponent, ref } from 'vue'

import { install as installATable } from '@stonecrop/atable'

import AForm from '../src/components/AForm.vue'
import AFieldset from '../src/components/form/AFieldset.vue'
import ATextInput from '../src/components/form/ATextInput.vue'

/*
A form reports its edits through `update:data` and never writes them into the `data` it was given, so a form
that nothing listens to has nowhere for an edit to go. It shows `edit` as `read`, nested forms included, so the
missing listener shows on screen instead of edits vanishing.
*/

const fieldProps = ['modelValue', 'schema', 'data', 'mode', 'errors', 'uuid', 'label', 'fieldname', 'kind']

// Renders the expansion slot for every row, as ATable does for an expanded row.
const ExpandingTable = defineComponent({
	name: 'ExpandingTable',
	props: [...fieldProps, 'rows', 'config', 'columns'],
	template: `<div><div v-for="(row, rowIndex) in rows" :key="rowIndex"><slot name="content" :row="row" :row-index="rowIndex" /></div></div>`,
})

const text = (fieldname: string, extra: Record<string, unknown> = {}) => ({
	kind: 'field',
	fieldname,
	component: 'ATextInput',
	label: fieldname,
	...extra,
})

const schema = [
	text('name'),
	{ kind: 'fieldset', fieldname: 'address', label: 'Address', schema: [text('city')] },
	{ kind: 'link', fieldname: 'customer', label: 'Customer', schema: [text('company'), text('vat', { mode: 'edit' })] },
	{
		kind: 'table',
		fieldname: 'lines',
		component: 'ExpandingTable',
		label: 'Lines',
		config: { view: 'list-expansion' },
		schema: [{ fieldname: 'sku', label: 'SKU', component: 'ATextInput' }],
	},
]
const record = () => ({
	name: 'Ada',
	city: 'Leeds',
	customer: { company: 'Acme', vat: 'GB1' },
	lines: [{ sku: 'A-1' }],
})

// Each input by its field, as `edit` or `read`.
const inputStates = (wrapper: ReturnType<typeof mount>) =>
	Object.fromEntries(
		wrapper
			.findAll('input')
			.map(input => [
				String(input.attributes('id')).replace(/^.*-/, ''),
				input.attributes('disabled') === undefined ? 'edit' : 'read',
			])
	)
const allEdit = { name: 'edit', city: 'edit', company: 'edit', vat: 'edit', sku: 'edit' }
const allRead = { name: 'read', city: 'read', company: 'read', vat: 'read', sku: 'read' }

const mountHost = (template: string, setup: () => Record<string, unknown>, components: Record<string, unknown> = {}) =>
	mount(defineComponent({ components: { AForm, AFieldset, ...components }, setup, template }), {
		global: { components: { AForm, AFieldset, ATextInput, ExpandingTable } },
	})

describe('AForm with nothing listening for its edits', { tags: ['component'] }, () => {
	it('shows every field read-only, nested forms and a field declaring edit included', () => {
		const wrapper = mountHost(`<AForm :data="data" :schema="schema" />`, () => ({ data: record(), schema }))

		expect(inputStates(wrapper)).toEqual(allRead)
	})

	it('shows every field read-only when told mode="edit"', () => {
		const wrapper = mountHost(`<AForm :data="data" :schema="schema" mode="edit" />`, () => ({ data: record(), schema }))

		expect(inputStates(wrapper)).toEqual(allRead)
	})

	it('still displays in mode="display", with a field declaring edit read-only', () => {
		const wrapper = mountHost(`<AForm :data="data" :schema="schema" mode="display" />`, () => ({
			data: record(),
			schema,
		}))

		expect(inputStates(wrapper)).toEqual({ vat: 'read' })
		expect(wrapper.findAll('.aform_display-value')).toHaveLength(4)
	})

	it('is editable once a listener is added, and read-only again once it is removed', async () => {
		const listening = ref(false)
		const wrapper = mountHost(
			`<AForm :data="data" :schema="schema" v-on="listening ? { 'update:data': () => {} } : {}" />`,
			() => ({ data: record(), schema, listening })
		)
		expect(inputStates(wrapper)).toEqual(allRead)

		listening.value = true
		await flushPromises()
		expect(inputStates(wrapper)).toEqual(allEdit)

		listening.value = false
		await flushPromises()
		expect(inputStates(wrapper)).toEqual(allRead)
	})

	it('hears a listener passed through a wrapper that leaves `data` to the form', () => {
		const Wrapper = defineComponent({
			components: { AForm },
			props: ['schema'],
			template: `<AForm :schema="schema" />`,
		})
		const listened = mountHost(
			`<Wrapper :data="data" :schema="schema" @update:data="() => {}" />`,
			() => ({ data: record(), schema }),
			{ Wrapper }
		)
		const unheard = mountHost(`<Wrapper :data="data" :schema="schema" />`, () => ({ data: record(), schema }), {
			Wrapper,
		})

		expect([inputStates(listened), inputStates(unheard)]).toEqual([allEdit, allRead])
	})

	// Vue keeps `update:data` for a component declaring `data` and does not pass it on, so this wrapper's edits
	// reach nobody unless it emits them itself.
	it('is read-only inside a wrapper that declares `data` and never emits its edits', () => {
		const Wrapper = defineComponent({
			components: { AForm },
			props: ['data', 'schema'],
			template: `<AForm :data="data" :schema="schema" />`,
		})
		const wrapper = mountHost(
			`<Wrapper :data="data" :schema="schema" @update:data="() => {}" />`,
			() => ({ data: record(), schema }),
			{ Wrapper }
		)

		expect(inputStates(wrapper)).toEqual(allRead)
	})
})

describe('AForm with a listener', { tags: ['component'] }, () => {
	it('is editable through v-model:data, and each nested edit reaches the host', async () => {
		const data = ref(record())
		const wrapper = mountHost(`<AForm v-model:data="data" :schema="schema" />`, () => ({ data, schema }))
		expect(inputStates(wrapper)).toEqual(allEdit)

		const typeInto = async (fieldname: string, value: string) => {
			await wrapper.find(`input[id$="-${fieldname}"]`).setValue(value)
			await flushPromises()
		}
		await typeInto('name', 'Bea')
		await typeInto('city', 'York')
		await typeInto('vat', 'GB2')
		await typeInto('sku', 'A-9')

		expect(data.value).toEqual({
			name: 'Bea',
			city: 'York',
			customer: { company: 'Acme', vat: 'GB2' },
			lines: [{ sku: 'A-9' }],
		})
	})

	it('is editable through an update:data handler', () => {
		const wrapper = mountHost(`<AForm :data="data" :schema="schema" @update:data="() => {}" />`, () => ({
			data: record(),
			schema,
		}))

		expect(inputStates(wrapper)).toEqual(allEdit)
	})
})

describe('AFieldset on its own', { tags: ['component'] }, () => {
	it('is read-only with nothing listening and editable through v-model:data', async () => {
		const fields = [text('city')]
		const unheard = mountHost(`<AFieldset :data="data" :schema="schema" label="Address" />`, () => ({
			data: { city: 'Leeds' },
			schema: fields,
		}))
		const data = ref({ city: 'Leeds' })
		const bound = mountHost(`<AFieldset v-model:data="data" :schema="schema" label="Address" />`, () => ({
			data,
			schema: fields,
		}))
		expect([inputStates(unheard), inputStates(bound)]).toEqual([{ city: 'read' }, { city: 'edit' }])

		await bound.find('input').setValue('York')
		expect(data.value).toEqual({ city: 'York' })
	})
})

// A table takes no `mode`: each column's own `edit` decides whether its cells can be edited.
const contactsTable = {
	kind: 'table',
	fieldname: 'contacts',
	component: 'ATable',
	label: 'Contacts',
	schema: [{ fieldname: 'person', label: 'Person', component: 'ATextInput', edit: true }],
	config: { view: 'list' },
}

describe("A read-only form's table", { tags: ['component'] }, () => {
	it.each([
		['in mode="read"', `<AForm v-model:data="data" :schema="schema" mode="read" />`],
		['with nothing listening', `<AForm :data="data" :schema="schema" />`],
		['with v-model:data, as a control', `<AForm v-model:data="data" :schema="schema" />`],
	])('%s offers an editable cell only when the form is editable', async (what, template) => {
		const data = ref({ contacts: [{ person: 'Bo' }] })
		const wrapper = mount(
			defineComponent({ components: { AForm }, setup: () => ({ data, schema: [contactsTable] }), template }),
			{
				global: { plugins: [createPinia(), { install: installATable }] },
			}
		)
		await flushPromises()

		expect(wrapper.find('td[data-editable="true"]').exists()).toBe(what.includes('control'))
	})
})
