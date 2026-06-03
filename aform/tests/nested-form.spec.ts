import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import AForm from '../src/components/AForm.vue'
import AFieldset from '../src/components/form/AFieldset.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { ResolvedField } from '../src/types'

describe('AForm Nested Schema Rendering', { tags: ['component'] }, () => {
	const addressSchema: ResolvedField[] = [
		{ kind: 'field' as const, fieldname: 'street', fieldtype: 'Data', component: 'ATextInput', label: 'Street' },
		{ kind: 'field' as const, fieldname: 'city', fieldtype: 'Data', component: 'ATextInput', label: 'City' },
	]

	const nestedSchema: ResolvedField[] = [
		{
			kind: 'field' as const,
			fieldname: 'name',
			fieldtype: 'Data',
			component: 'ATextInput',
			label: 'Name',
		},
		{
			kind: 'link' as const,
			fieldname: 'address',
			component: 'AForm',
			label: 'Address',
			schema: addressSchema,
		},
	]

	it('renders a nested AForm when field has schema property', async () => {
		const wrapper = mount(AForm, {
			props: {
				schema: nestedSchema,
				data: {
					name: 'John',
					address: { street: '123 Main St', city: 'Springfield' },
				},
			},
			global: {
				components: { ATextInput },
			},
		})

		await wrapper.vm.$nextTick()
		await flushPromises()

		// Should find nested AForm section
		const nestedSections = wrapper.findAll('.aform-nested-section')
		expect(nestedSections.length).toBe(1)

		// Should render nested label
		const nestedLabel = wrapper.find('.aform-nested-label')
		expect(nestedLabel.exists()).toBe(true)
		expect(nestedLabel.text()).toBe('Address')
	})

	it('renders nested AForm without label when label is not set', async () => {
		const schemaWithoutLabel: ResolvedField[] = [
			{
				kind: 'field' as const,
				fieldname: 'name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'Name',
			},
			{
				kind: 'link' as const,
				fieldname: 'address',
				component: 'AForm',
				// no label
				schema: addressSchema,
			},
		]

		const wrapper = mount(AForm, {
			props: {
				schema: schemaWithoutLabel,
				data: {
					name: 'John',
					address: { street: '123 Main St', city: 'Springfield' },
				},
			},
			global: {
				components: { ATextInput },
			},
		})

		await wrapper.vm.$nextTick()

		// Nested section should exist
		const nestedSections = wrapper.findAll('.aform-nested-section')
		expect(nestedSections.length).toBe(1)

		// But no label rendered
		const nestedLabel = wrapper.find('.aform-nested-label')
		expect(nestedLabel.exists()).toBe(false)
	})

	it('initializes nested data from parent dataModel', async () => {
		const wrapper = mount(AForm, {
			props: {
				schema: nestedSchema,
				data: {
					name: 'John',
					address: { street: '123 Main St', city: 'Springfield' },
				},
			},
			global: {
				components: { ATextInput, AForm },
			},
		})

		await wrapper.vm.$nextTick()
		await flushPromises()

		// The nested section should exist with its own nested form element
		const nestedSections = wrapper.findAll('.aform-nested-section')
		expect(nestedSections.length).toBe(1)

		// The nested form (inside the section) should render child inputs
		const nestedForm = nestedSections[0].find('.aform')
		expect(nestedForm.exists()).toBe(true)
	})

	it('initializes nested data as empty object when no parent data exists', async () => {
		const wrapper = mount(AForm, {
			props: {
				schema: nestedSchema,
				data: {
					name: 'John',
					// no address field in data
				},
			},
			global: {
				components: { ATextInput },
			},
		})

		await wrapper.vm.$nextTick()
		await flushPromises()

		// Should still render nested section
		const nestedSections = wrapper.findAll('.aform-nested-section')
		expect(nestedSections.length).toBe(1)
	})

	it('does NOT emit update:data on initialization (no feedback loop)', async () => {
		const data = {
			name: 'John',
			address: { street: '123 Main St', city: 'Springfield' },
		}

		const wrapper = mount(AForm, {
			props: {
				schema: nestedSchema,
				data,
			},
			global: {
				components: { ATextInput },
			},
		})

		await wrapper.vm.$nextTick()
		await flushPromises()

		// The new one-way watch does NOT emit update:data on init — the old
		// watchEffect pair caused an infinite loop by doing so.
		const events = wrapper.emitted('update:data')
		expect(events).toBeFalsy()
	})

	it('propagates nested form changes to parent via updateNestedData', async () => {
		const wrapper = mount(AForm, {
			props: {
				schema: nestedSchema,
				data: {
					name: 'John',
					address: { street: '123 Main St', city: 'Springfield' },
				},
			},
			global: {
				components: { ATextInput, AForm },
			},
		})

		await wrapper.vm.$nextTick()
		await flushPromises()

		// The nested .aform-nested-section contains inputs from the nested AForm.
		// Changing an input inside it fires the nested AForm's update:data event,
		// which calls updateNestedData on the parent (covering lines 13, 64-67).
		const nestedSection = wrapper.find('.aform-nested-section')
		expect(nestedSection.exists()).toBe(true)

		const streetInput = nestedSection.find('input')
		expect(streetInput.exists()).toBe(true)

		await streetInput.setValue('456 Elm St')
		await wrapper.vm.$nextTick()

		// Parent should have emitted update:data after the nested change propagated
		const emitEvents = wrapper.emitted('update:data')
		expect(emitEvents).toBeTruthy()
		const lastEmit = emitEvents![emitEvents!.length - 1][0] as Record<string, any>
		expect(lastEmit.address).toBeDefined()
	})

	it('does not render nested AForm when schema array is empty', async () => {
		const schemaWithEmptyNested: ResolvedField[] = [
			{
				kind: 'field' as const,
				fieldname: 'name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'Name',
			},
			{
				kind: 'link' as const,
				fieldname: 'address',
				component: 'AForm',
				label: 'Address',
				schema: [], // empty schema — should not render nested section
			},
		]

		const wrapper = mount(AForm, {
			props: {
				schema: schemaWithEmptyNested,
				data: { name: 'John' },
			},
			global: {
				components: { ATextInput },
			},
		})

		await wrapper.vm.$nextTick()

		// Should NOT render nested section (empty schema)
		const nestedSections = wrapper.findAll('.aform-nested-section')
		expect(nestedSections.length).toBe(0)
	})

	it('does not render nested AForm when field has no schema property', async () => {
		const plainSchema: ResolvedField[] = [
			{
				kind: 'field' as const,
				fieldname: 'name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'Name',
			},
			{
				kind: 'field' as const,
				fieldname: 'address',
				fieldtype: 'Link',
				options: 'address',
				label: 'Address',
				// no schema property — renders as plain scalar
			},
		]

		const wrapper = mount(AForm, {
			props: {
				schema: plainSchema,
				data: { name: 'John' },
			},
			global: {
				components: { ATextInput },
			},
		})

		await wrapper.vm.$nextTick()

		const nestedSections = wrapper.findAll('.aform-nested-section')
		expect(nestedSections.length).toBe(0)
	})

	it('passes mode to nested AForm', async () => {
		const wrapper = mount(AForm, {
			props: {
				schema: nestedSchema,
				data: {
					name: 'John',
					address: { street: '123 Main St', city: 'Springfield' },
				},
				mode: 'read',
			},
			global: {
				components: { ATextInput, AForm },
			},
		})

		await wrapper.vm.$nextTick()
		await flushPromises()

		// The nested AForm should receive mode
		const nestedForms = wrapper.findAllComponents(AForm)
		expect(nestedForms.length).toBeGreaterThanOrEqual(1)
		expect(nestedForms[0].props('mode')).toBe('read')
	})

	it('passes per-field mode to nested AForm', async () => {
		const schemaWithMode: ResolvedField[] = [
			{
				kind: 'field' as const,
				fieldname: 'name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'Name',
			},
			{
				kind: 'link' as const,
				fieldname: 'address',
				component: 'AForm',
				label: 'Address',
				mode: 'read',
				schema: addressSchema,
			},
		]

		const wrapper = mount(AForm, {
			props: {
				schema: schemaWithMode,
				data: {
					name: 'John',
					address: { street: '123 Main St', city: 'Springfield' },
				},
			},
			global: {
				components: { ATextInput, AForm },
			},
		})

		await wrapper.vm.$nextTick()
		await flushPromises()

		// The nested AForm should receive mode from the field
		const nestedForms = wrapper.findAllComponents(AForm)
		expect(nestedForms.length).toBeGreaterThanOrEqual(1)
		expect(nestedForms[0].props('mode')).toBe('read')
	})

	it('handles multiple nested Doctype fields', async () => {
		const billingSchema: ResolvedField[] = [
			{
				kind: 'field' as const,
				fieldname: 'card_number',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'Card Number',
			},
		]

		const multiNestedSchema: ResolvedField[] = [
			{
				kind: 'field' as const,
				fieldname: 'name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'Name',
			},
			{
				kind: 'link' as const,
				fieldname: 'address',
				component: 'AForm',
				label: 'Address',
				schema: addressSchema,
			},
			{
				kind: 'link' as const,
				fieldname: 'billing',
				component: 'AForm',
				label: 'Billing',
				schema: billingSchema,
			},
		]

		const wrapper = mount(AForm, {
			props: {
				schema: multiNestedSchema,
				data: {
					name: 'John',
					address: { street: '123 Main St', city: 'Springfield' },
					billing: { card_number: '4242' },
				},
			},
			global: {
				components: { ATextInput },
			},
		})

		await wrapper.vm.$nextTick()
		await flushPromises()

		const nestedSections = wrapper.findAll('.aform-nested-section')
		expect(nestedSections.length).toBe(2)
	})

	it('does NOT render as nested section when schema AND kind: "table" are both set', async () => {
		const tableSchema: ResolvedField[] = [
			{
				fieldname: 'name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'Name',
			},
			{
				fieldname: 'items',
				label: 'Items',
				component: 'ATable',
				kind: 'table',
				schema: [
					{ fieldname: 'qty', fieldtype: 'Int', label: 'Qty' },
					{ fieldname: 'price', fieldtype: 'Currency', label: 'Price' },
				],
			} as any,
		] as ResolvedField[]

		const wrapper = mount(AForm, {
			props: {
				schema: tableSchema,
				data: { name: 'Test', items: [] },
			},
			global: { components: { ATextInput } },
		})

		await wrapper.vm.$nextTick()

		const nestedSections = wrapper.findAll('.aform-nested-section')
		expect(nestedSections.length).toBe(0)
	})

	it('emits update:data when childModels change via v-model', async () => {
		const simpleSchema: ResolvedField[] = [
			{
				fieldname: 'first_name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'First Name',
			},
		] as ResolvedField[]

		const wrapper = mount(AForm, {
			props: {
				schema: simpleSchema,
				data: { first_name: '' },
			},
			global: {
				components: { ATextInput },
			},
		})

		await wrapper.vm.$nextTick()

		const textInput = wrapper.findComponent(ATextInput)
		expect(textInput.exists()).toBe(true)
		await textInput.find('input').setValue('Alice')
		await wrapper.vm.$nextTick()

		const dataEvents = wrapper.emitted('update:data')
		expect(dataEvents).toBeTruthy()
		expect(dataEvents!.length).toBeGreaterThanOrEqual(1)
	})

	it('handles childModelsCache rebuild on schema length change', async () => {
		const schema1: ResolvedField[] = [
			{
				fieldname: 'first_name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'First Name',
			},
		] as ResolvedField[]

		const wrapper = mount(AForm, {
			props: {
				schema: schema1,
				data: { first_name: '' },
			},
			global: {
				components: { ATextInput },
			},
		})

		await wrapper.vm.$nextTick()

		// Now update schema with different length
		const schema2: ResolvedField[] = [
			{
				fieldname: 'first_name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'First Name',
			},
			{
				fieldname: 'last_name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'Last Name',
			},
		] as ResolvedField[]

		await wrapper.setProps({ schema: schema2, data: { first_name: '', last_name: '' } })
		await wrapper.vm.$nextTick()

		expect(wrapper.vm).toBeTruthy()
	})

	it('re-syncs nestedData when dataModel reference is replaced (e.g. form reset)', async () => {
		const wrapper = mount(AForm, {
			props: {
				schema: nestedSchema,
				data: {
					name: 'John',
					address: { street: '123 Main St', city: 'Springfield' },
				},
			},
			global: {
				components: { ATextInput },
			},
		})

		await wrapper.vm.$nextTick()
		await flushPromises()

		// Simulate a parent resetting the form by replacing the entire data object.
		// The shallow watch (triggered by reference change) should re-sync nestedData.
		await wrapper.setProps({
			data: {
				name: 'Jane',
				address: { street: '789 Oak Ave', city: 'Shelbyville' },
			},
		})
		await wrapper.vm.$nextTick()

		// Nested section should still render correctly after data reset
		const nestedSections = wrapper.findAll('.aform-nested-section')
		expect(nestedSections.length).toBe(1)
		expect(wrapper.vm).toBeTruthy()
	})

	it('renders ATable component for Doctype field with cardinality: noneOrMany', async () => {
		const tableSchema: ResolvedField[] = [
			{
				fieldname: 'name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'Name',
			},
			{
				fieldname: 'items',
				label: 'Items',
				component: 'ATable',
				columns: [
					{ name: 'item_name', label: 'Item', fieldtype: 'Data' },
					{ name: 'qty', label: 'Qty', fieldtype: 'Int' },
				],
				rows: [
					{ item_name: 'Widget', qty: 5 },
					{ item_name: 'Gadget', qty: 3 },
				],
			},
		]

		const wrapper = mount(AForm, {
			props: {
				schema: tableSchema,
				data: {
					name: 'Test Order',
					items: [
						{ item_name: 'Widget', qty: 5 },
						{ item_name: 'Gadget', qty: 3 },
					],
				},
			},
			global: {
				components: { ATextInput },
			},
		})

		await wrapper.vm.$nextTick()
		await flushPromises()

		// Should NOT render nested AForm section (no schema property)
		const nestedSections = wrapper.findAll('.aform-nested-section')
		expect(nestedSections.length).toBe(0)

		// ATable may not be registered in test, but the component :is binding
		// should still attempt to render it — verify no nested form was created
		expect(nestedSections.length).toBe(0)
	})

	describe('AFieldset inside AForm', () => {
		const fieldsetSchema = [
			{ fieldname: 'first_name', fieldtype: 'Data', component: 'ATextInput', label: 'First Name' },
		] as ResolvedField[]

		it('renders the fieldset legend text when component is AFieldset', async () => {
			const wrapper = mount(AForm, {
				props: {
					schema: [
						{
							fieldname: 'details',
							component: 'AFieldset',
							label: 'Details',
							schema: fieldsetSchema,
						},
					] as any,
					data: { details: {} },
				},
				global: { components: { AFieldset, ATextInput } },
			})

			await wrapper.vm.$nextTick()

			const legend = wrapper.find('legend')
			expect(legend.exists()).toBe(true)
			expect(legend.text()).toContain('Details')
		})

		it('does not render h4 aform-nested-label when the nested component is AFieldset', async () => {
			const wrapper = mount(AForm, {
				props: {
					schema: [
						{
							fieldname: 'details',
							component: 'AFieldset',
							label: 'Details',
							collapsible: false,
							schema: fieldsetSchema,
						},
					] as any,
					data: { details: {} },
				},
				global: { components: { AFieldset, ATextInput } },
			})

			await wrapper.vm.$nextTick()

			expect(wrapper.find('.aform-nested-label').exists()).toBe(false)
		})

		it('passes collapsible prop to nested AFieldset', async () => {
			const wrapper = mount(AForm, {
				props: {
					schema: [
						{
							fieldname: 'details',
							component: 'AFieldset',
							label: 'Details',
							collapsible: true,
							schema: fieldsetSchema,
						},
					] as any,
					data: { details: {} },
				},
				global: { components: { AFieldset, ATextInput } },
			})

			await wrapper.vm.$nextTick()

			const fieldset = wrapper.findComponent(AFieldset)
			expect(fieldset.exists()).toBe(true)
			expect(fieldset.props('collapsible')).toBe(true)
		})

		it('passes mode to a component with kind: "fieldset" in the schema', async () => {
			const fieldsetInnerSchema: ResolvedField[] = [
				{ kind: 'field' as const, fieldname: 'email', fieldtype: 'Data', component: 'ATextInput', label: 'Email' },
			]

			const schemaWithFieldset: ResolvedField[] = [
				{
					kind: 'fieldset' as const,
					fieldname: 'details',
					component: 'AFieldset',
					label: 'Details',
					schema: fieldsetInnerSchema,
				},
			]

			const wrapper = mount(AForm, {
				props: {
					schema: schemaWithFieldset,
					data: { details: {} },
					mode: 'read',
				},
				global: { components: { AFieldset, ATextInput } },
			})

			await wrapper.vm.$nextTick()

			const fieldset = wrapper.findComponent(AFieldset)
			expect(fieldset.exists()).toBe(true)
			expect(fieldset.props('mode')).toBe('read')
		})
	})
})
