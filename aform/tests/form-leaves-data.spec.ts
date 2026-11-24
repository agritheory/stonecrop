import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'
import { defineComponent, reactive, ref } from 'vue'

import AForm from '../src/components/AForm.vue'
import AFieldset from '../src/components/form/AFieldset.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { ResolvedField } from '../src/types'
import { mountBound } from './mount-bound'

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
		const wrapper = mountBound({
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

// Sets the currency of a value made of parts, as a second total sharing that currency would.
const CurrencyInput = defineComponent({
	name: 'CurrencyInput',
	props: [...fieldProps, 'parts'],
	emits: ['update:modelValue'],
	template: `<button class="currency-input" type="button" @click="$emit('update:modelValue', { ...modelValue, currency: 'USD' })">currency</button>`,
})

// Edits made before Vue re-renders, as a script filling several fields at once makes them (#559): a host's new
// record reaches the form only on the next render, so each edit builds on the record last reported, not on the
// record the form was last handed, and keeps the edits before it.
const typeNow = (input: Element, text: string) => {
	;(input as HTMLInputElement).value = text
	input.dispatchEvent(new Event('input', { bubbles: true }))
}

const mountInHost = (schema: Record<string, unknown>[], data: Record<string, unknown>) => {
	const record = ref(data)
	const Host = defineComponent({
		components: { AForm },
		setup: () => ({ record, schema }),
		template: `<AForm v-model:data="record" :schema="schema" />`,
	})
	const wrapper = mount(Host, {
		global: { components: { AForm, AFieldset, ATextInput, PartsInput, CurrencyInput, ExpandingTable } },
	})
	return { wrapper, record }
}

describe('AForm given edits before it re-renders (#559)', { tags: ['component'] }, () => {
	it('keeps both of two fields filled at once', async () => {
		const { wrapper, record } = mountInHost(twoFields, { name: 'Ada', age: '36' })
		const [name, age] = wrapper.findAll('input').map(found => found.element)
		typeNow(name, 'Bea')
		typeNow(age, '37')
		await flushPromises()

		expect(record.value).toEqual({ name: 'Bea', age: '37' })
		expect(wrapper.findAll('input').map(found => (found.element as HTMLInputElement).value)).toEqual(['Bea', '37'])
	})

	it('keeps both of two fields filled at once for a host that replaces the record itself', async () => {
		const record = ref<Record<string, unknown>>({ name: 'Ada', age: '36' })
		const Host = defineComponent({
			components: { AForm },
			setup: () => ({ record, schema: twoFields, take: (next: Record<string, unknown>) => (record.value = next) }),
			template: `<AForm :data="record" :schema="schema" @update:data="take" />`,
		})
		const wrapper = mount(Host, { global: { components: { ATextInput } } })
		const [name, age] = wrapper.findAll('input').map(found => found.element)
		typeNow(name, 'Bea')
		typeNow(age, '37')
		await flushPromises()

		expect(record.value).toEqual({ name: 'Bea', age: '37' })
	})

	it('keeps a value the host writes into its record in place between two fields filled at once', async () => {
		const row = reactive<Record<string, unknown>>({ name: 'Ada', age: '36', city: '' })
		let filled = false
		const takeInPlace = (next: Record<string, unknown>) => {
			Object.assign(row, next)
			if (!filled) row.city = 'York'
			filled = true
		}
		const Host = defineComponent({
			components: { AForm },
			setup: () => ({ row, schema: twoFields, takeInPlace }),
			template: `<AForm :data="row" :schema="schema" @update:data="takeInPlace" />`,
		})
		const wrapper = mount(Host, { global: { components: { ATextInput } } })
		const [name, age] = wrapper.findAll('input').map(found => found.element)
		typeNow(name, 'Bea')
		typeNow(age, '37')
		await flushPromises()

		expect(row).toEqual({ name: 'Bea', age: '37', city: 'York' })
	})

	it('does not carry an edit its host declined into one made after the form re-renders', async () => {
		const record = ref<Record<string, unknown>>({ name: 'Ada', age: '36' })
		const heard: Record<string, unknown>[] = []
		const Host = defineComponent({
			components: { AForm },
			setup: () => ({ record, schema: twoFields, decline: (next: Record<string, unknown>) => heard.push(next) }),
			template: `<AForm :data="record" :schema="schema" @update:data="decline" />`,
		})
		const wrapper = mount(Host, { global: { components: { ATextInput } } })
		const [name, age] = wrapper.findAll('input').map(found => found.element)
		typeNow(name, 'Bea')
		await flushPromises()
		typeNow(age, '37')

		expect(heard.at(-1)).toEqual({ name: 'Ada', age: '37' })
	})

	it("keeps both of a field and a fieldset's field filled at once", async () => {
		const { wrapper, record } = mountInHost(
			[
				nameField,
				{
					kind: 'fieldset',
					fieldname: 'address',
					label: 'Address',
					schema: [{ ...nameField, fieldname: 'city', label: 'City' }],
				},
			],
			{ name: 'Ada', city: 'Leeds' }
		)
		const [name, city] = wrapper.findAll('input').map(found => found.element)
		typeNow(name, 'Bea')
		typeNow(city, 'York')
		await flushPromises()

		expect(record.value).toEqual({ name: 'Bea', city: 'York' })
	})

	it('keeps both of two edits to values made of parts that share a part', async () => {
		const { wrapper, record } = mountInHost(
			[
				{
					kind: 'field',
					fieldname: 'grandTotal',
					component: 'CurrencyInput',
					parts: { amount: 'grand', currency: 'currency' },
				},
				{
					kind: 'field',
					fieldname: 'netTotal',
					component: 'PartsInput',
					parts: { amount: 'net', currency: 'currency' },
				},
			],
			{ grand: 1, net: 2, currency: 'EUR' }
		)
		;(wrapper.find('.currency-input').element as HTMLButtonElement).click()
		;(wrapper.find('.parts-input').element as HTMLButtonElement).click()
		await flushPromises()

		expect(record.value).toEqual({ grand: 1, net: 5, currency: 'USD' })
	})

	it('keeps both of edits to two expanded rows made at once', async () => {
		const { wrapper, record } = mountInHost(
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
			{ lines: [{ sku: 'A-1' }, { sku: 'B-2' }] }
		)
		const [first, second] = wrapper.findAll('.aform-table-expansion input').map(found => found.element)
		typeNow(first, 'A-9')
		typeNow(second, 'B-9')
		await flushPromises()

		expect(record.value).toEqual({ lines: [{ sku: 'A-9' }, { sku: 'B-9' }] })
	})

	it('keeps a value the host fills in place when a fieldset field and another are filled at once', async () => {
		const row = reactive<Record<string, unknown>>({ name: 'Ada', email: '', city: '' })
		let filled = false
		const takeInPlace = (next: Record<string, unknown>) => {
			Object.assign(row, next)
			if (!filled && row.name !== 'Ada') {
				row.city = 'York'
				filled = true
			}
		}
		const schema = [
			{ kind: 'fieldset', fieldname: 'details', label: 'Details', schema: [nameField] },
			{ ...nameField, fieldname: 'email', label: 'Email' },
		]
		const Host = defineComponent({
			components: { AForm },
			setup: () => ({ row, schema, takeInPlace }),
			template: `<AForm :data="row" :schema="schema" @update:data="takeInPlace" />`,
		})
		const wrapper = mount(Host, { global: { components: { AFieldset, ATextInput } } })
		const [name, email] = wrapper.findAll('input').map(found => found.element)
		typeNow(name, 'Bea')
		typeNow(email, 'bea@example.com')
		await flushPromises()

		expect(row).toEqual({ name: 'Bea', email: 'bea@example.com', city: 'York' })
	})

	it("keeps a line's value the host fills in place when two fields of an expanded row are filled at once", async () => {
		const order = reactive<Record<string, any>>({ lines: [{ sku: 'A-1', qty: '1', price: 0 }] })
		let filled = false
		const takeInPlace = (next: Record<string, any>) => {
			Object.assign(order, next)
			if (!filled && order.lines[0].sku !== 'A-1') {
				order.lines[0].price = 9
				filled = true
			}
		}
		const schema = [
			{
				kind: 'table',
				fieldname: 'lines',
				component: 'ExpandingTable',
				label: 'Lines',
				config: { view: 'list-expansion' },
				schema: [
					{ fieldname: 'sku', label: 'SKU', component: 'ATextInput' },
					{ fieldname: 'qty', label: 'Qty', component: 'ATextInput' },
				],
			},
		]
		const Host = defineComponent({
			components: { AForm },
			setup: () => ({ order, schema, takeInPlace }),
			template: `<AForm :data="order" :schema="schema" @update:data="takeInPlace" />`,
		})
		const wrapper = mount(Host, { global: { components: { AForm, ATextInput, ExpandingTable } } })
		const [sku, qty] = wrapper.findAll('.aform-table-expansion input').map(found => found.element)
		typeNow(sku, 'B-2')
		typeNow(qty, '3')
		await flushPromises()

		expect(order.lines).toEqual([{ sku: 'B-2', qty: '3', price: 9 }])
	})

	it("keeps a line's field cleared and set back to its old value at once in an expanded row", async () => {
		const { wrapper, record } = mountInHost(
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
			{ lines: [{ sku: 'A-1' }] }
		)
		const [sku] = wrapper.findAll('.aform-table-expansion input').map(found => found.element)
		typeNow(sku, '')
		typeNow(sku, 'A-1')
		await flushPromises()

		expect(record.value).toEqual({ lines: [{ sku: 'A-1' }] })
	})

	it("keeps a fieldset's field cleared and set back to its old value at once", async () => {
		const { wrapper, record } = mountInHost(
			[{ kind: 'fieldset', fieldname: 'details', label: 'Details', schema: [nameField] }],
			{ name: 'Ada' }
		)
		const [name] = wrapper.findAll('input').map(found => found.element)
		typeNow(name, '')
		typeNow(name, 'Ada')
		await flushPromises()

		expect(record.value).toEqual({ name: 'Ada' })
	})
})
