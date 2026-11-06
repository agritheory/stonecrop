import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'
import { defineComponent, reactive, ref } from 'vue'

import AForm from '../src/components/AForm.vue'
import AFieldset from '../src/components/form/AFieldset.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { ResolvedField } from '../src/types'

/*
AForm reports an edit as a new record through `update:data` and leaves the `data` it was given as it
was: that object is the caller's, often the store's own, so a change written into it before the caller
hears of it leaves the caller no old value to compare with or to undo to.
*/

const fieldProps = ['modelValue', 'schema', 'data', 'mode', 'errors', 'uuid', 'label', 'fieldname', 'kind']

// A component editing a value made of parts, as a quantity or a currency amount is.
const PartsInput = defineComponent({
	name: 'PartsInput',
	props: [...fieldProps, 'parts'],
	emits: ['update:modelValue'],
	template: `<button class="parts-input" type="button" @click="$emit('update:modelValue', { ...modelValue, amount: 5 })">edit</button>`,
})

// A table that adds a row, as ATable reports one through `update:rows`.
const RowsTable = defineComponent({
	name: 'RowsTable',
	props: [...fieldProps, 'rows', 'columns', 'config'],
	emits: ['update:rows'],
	template: `<button class="rows-table" type="button" @click="$emit('update:rows', [...rows, { sku: 'C-3' }])">add</button>`,
})

// Renders the expansion slot for every row, as ATable does for an expanded row.
const ExpandingTable = defineComponent({
	name: 'ExpandingTable',
	props: [...fieldProps, 'rows', 'config'],
	template: `<div class="expanding-table">
		<div v-for="(row, rowIndex) in rows" :key="rowIndex" class="expanded-row">
			<slot name="content" :row="row" :row-index="rowIndex" />
		</div>
	</div>`,
})

const nameField = { kind: 'field', fieldname: 'name', component: 'ATextInput', label: 'Name' }

type Case = [
	what: string,
	schema: Record<string, unknown>[],
	data: Record<string, unknown>,
	edit: (wrapper: VueWrapper) => Promise<unknown>,
	emitted: Record<string, unknown>,
]

const typeInto = (selector: string, text: string) => (wrapper: VueWrapper) =>
	wrapper.findAll(selector).at(-1)!.setValue(text)

const cases: Case[] = [
	['a field', [nameField], { name: 'Ada', age: 36 }, typeInto('input', 'Bea'), { name: 'Bea', age: 36 }],
	[
		'a field made of parts',
		[{ kind: 'field', fieldname: 'price', component: 'PartsInput', parts: { amount: 'amount', currency: 'currency' } }],
		{ amount: 1, currency: 'EUR' },
		wrapper => wrapper.find('.parts-input').trigger('click'),
		{ amount: 5, currency: 'EUR' },
	],
	[
		"a fieldset's field",
		[{ kind: 'fieldset', fieldname: 'details', label: 'Details', schema: [nameField] }],
		{ name: 'Ada', age: 36 },
		typeInto('input', 'Bea'),
		{ name: 'Bea', age: 36 },
	],
	[
		"a linked record's field",
		[{ kind: 'link', fieldname: 'customer', label: 'Customer', schema: [nameField] }],
		{ customer: { name: 'Acme' }, total: 10 },
		typeInto('input', 'Acme Ltd'),
		{ customer: { name: 'Acme Ltd' }, total: 10 },
	],
	[
		"a table's rows",
		[{ kind: 'table', fieldname: 'lines', component: 'RowsTable', label: 'Lines', columns: [] }],
		{ lines: [{ sku: 'A-1' }] },
		wrapper => wrapper.find('.rows-table').trigger('click'),
		{ lines: [{ sku: 'A-1' }, { sku: 'C-3' }] },
	],
	[
		'a field in an expanded row',
		[
			{
				kind: 'table',
				fieldname: 'lines',
				component: 'ExpandingTable',
				label: 'Lines',
				config: { view: 'list-expansion' },
				schema: [{ fieldname: 'sku', label: 'SKU', component: 'ATextInput' }],
			},
		],
		{ lines: [{ sku: 'A-1' }, { sku: 'B-2' }] },
		typeInto('.aform-table-expansion input', 'B-9'),
		{ lines: [{ sku: 'A-1' }, { sku: 'B-9' }] },
	],
]

describe('AForm leaves the data it was given', { tags: ['component'] }, () => {
	it.each(cases)('reports an edit to %s as a new record', async (_, schema, data, edit, emitted) => {
		const before = structuredClone(data)
		const wrapper = mount(AForm, {
			props: { schema: schema as ResolvedField[], data },
			global: { components: { AForm, AFieldset, ATextInput, PartsInput, RowsTable, ExpandingTable } },
		})

		await edit(wrapper)

		expect(wrapper.emitted('update:data')?.at(-1)?.[0]).toEqual(emitted)
		expect(data).toEqual(before)
	})
})

// Two fields a user fills in one after the other.
const twoFields = [nameField, { kind: 'field', fieldname: 'age', component: 'ATextInput', label: 'Age' }]

describe('AForm adds up edits', { tags: ['component'] }, () => {
	it('keeps both of two edits made through v-model', async () => {
		const Host = defineComponent({
			components: { AForm },
			setup: () => ({ record: ref({ name: 'Ada', age: '36' }), schema: twoFields }),
			template: `<AForm v-model:data="record" :schema="schema" />`,
		})
		const wrapper = mount(Host, { global: { components: { ATextInput } } })
		const [name, age] = wrapper.findAll('input')
		await name.setValue('Bea')
		await age.setValue('37')

		expect(wrapper.vm.record).toEqual({ name: 'Bea', age: '37' })
	})

	// As FAB's line tables do: take each record by writing it into the row, and fill a field in themselves.
	it('shows, and builds on, a value the host writes into its record in place', async () => {
		const row = reactive<Record<string, unknown>>({ name: 'Ada', age: '36' })
		let filled = false
		const takeInPlace = (next: Record<string, unknown>) => {
			Object.assign(row, next)
			if (!filled) row.age = '40'
			filled = true
		}
		const Host = defineComponent({
			components: { AForm },
			setup: () => ({ row, schema: twoFields, takeInPlace }),
			template: `<AForm :data="row" :schema="schema" @update:data="takeInPlace" />`,
		})
		const wrapper = mount(Host, { global: { components: { ATextInput } } })
		const [name, age] = wrapper.findAll('input')
		await name.setValue('Bea')
		await flushPromises()
		expect((age.element as HTMLInputElement).value).toBe('40')
		await name.setValue('Bee')

		expect(row).toEqual({ name: 'Bee', age: '40' })
	})
})
