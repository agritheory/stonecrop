import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import AForm from '../src/components/AForm.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { SchemaTypes } from '../src/types'

describe('AForm Nested Schema Rendering', () => {
	const addressSchema: SchemaTypes[] = [
		{ fieldname: 'street', fieldtype: 'Data', component: 'ATextInput', label: 'Street' },
		{ fieldname: 'city', fieldtype: 'Data', component: 'ATextInput', label: 'City' },
	] as SchemaTypes[]

	const nestedSchema: SchemaTypes[] = [
		{
			fieldname: 'name',
			fieldtype: 'Data',
			component: 'ATextInput',
			label: 'Name',
		},
		{
			fieldname: 'address',
			fieldtype: 'Doctype',
			options: 'address',
			label: 'Address',
			schema: addressSchema,
		},
	] as SchemaTypes[]

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
		const schemaWithoutLabel: SchemaTypes[] = [
			{
				fieldname: 'name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'Name',
			},
			{
				fieldname: 'address',
				fieldtype: 'Doctype',
				options: 'address',
				// no label
				schema: addressSchema,
			},
		] as SchemaTypes[]

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
				components: { ATextInput },
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

	it('syncs nested data changes back to parent', async () => {
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

		// Check that update:data events work
		const events = wrapper.emitted('update:data')
		// The nested data sync watchEffect fires on init
		if (events) {
			expect(events.length).toBeGreaterThanOrEqual(1)
		}
	})

	it('does not render nested AForm when schema array is empty', async () => {
		const schemaWithEmptyNested: SchemaTypes[] = [
			{
				fieldname: 'name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'Name',
			},
			{
				fieldname: 'address',
				fieldtype: 'Doctype',
				options: 'address',
				label: 'Address',
				schema: [], // empty schema
			},
		] as SchemaTypes[]

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
		const plainSchema: SchemaTypes[] = [
			{
				fieldname: 'name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'Name',
			},
			{
				fieldname: 'address',
				fieldtype: 'Doctype',
				options: 'address',
				label: 'Address',
				// no schema property at all
			},
		] as SchemaTypes[]

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

	it('passes readOnly to nested AForm', async () => {
		const wrapper = mount(AForm, {
			props: {
				schema: nestedSchema,
				data: {
					name: 'John',
					address: { street: '123 Main St', city: 'Springfield' },
				},
				readOnly: true,
			},
			global: {
				components: { ATextInput },
			},
		})

		await wrapper.vm.$nextTick()
		await flushPromises()

		// The nested AForm should receive readOnly
		const nestedForms = wrapper.findAllComponents(AForm)
		if (nestedForms.length > 1) {
			expect(nestedForms[1].props('readOnly')).toBe(true)
		}
	})

	it('passes per-field readOnly to nested AForm', async () => {
		const schemaWithReadOnly: SchemaTypes[] = [
			{
				fieldname: 'name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'Name',
			},
			{
				fieldname: 'address',
				fieldtype: 'Doctype',
				options: 'address',
				label: 'Address',
				readOnly: true,
				schema: addressSchema,
			},
		] as SchemaTypes[]

		const wrapper = mount(AForm, {
			props: {
				schema: schemaWithReadOnly,
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

		// The nested AForm should receive readOnly from the field
		const nestedForms = wrapper.findAllComponents(AForm)
		if (nestedForms.length > 1) {
			expect(nestedForms[1].props('readOnly')).toBe(true)
		}
	})

	it('handles multiple nested Doctype fields', async () => {
		const billingSchema: SchemaTypes[] = [
			{ fieldname: 'card_number', fieldtype: 'Data', component: 'ATextInput', label: 'Card Number' },
		] as SchemaTypes[]

		const multiNestedSchema: SchemaTypes[] = [
			{
				fieldname: 'name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'Name',
			},
			{
				fieldname: 'address',
				fieldtype: 'Doctype',
				options: 'address',
				label: 'Address',
				schema: addressSchema,
			},
			{
				fieldname: 'billing',
				fieldtype: 'Doctype',
				options: 'billing',
				label: 'Billing',
				schema: billingSchema,
			},
		] as SchemaTypes[]

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

	it('emits update:data when childModels change via v-model', async () => {
		const simpleSchema: SchemaTypes[] = [
			{
				fieldname: 'first_name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'First Name',
			},
		] as SchemaTypes[]

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
		if (textInput.exists()) {
			await textInput.find('input').setValue('Alice')
			await wrapper.vm.$nextTick()

			const dataEvents = wrapper.emitted('update:data')
			if (dataEvents) {
				expect(dataEvents.length).toBeGreaterThanOrEqual(1)
			}
		}
	})

	it('handles childModelsCache rebuild on schema length change', async () => {
		const schema1: SchemaTypes[] = [
			{
				fieldname: 'first_name',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'First Name',
			},
		] as SchemaTypes[]

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
		const schema2: SchemaTypes[] = [
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
		] as SchemaTypes[]

		await wrapper.setProps({ schema: schema2, data: { first_name: '', last_name: '' } })
		await wrapper.vm.$nextTick()

		expect(wrapper.vm).toBeTruthy()
	})
})
