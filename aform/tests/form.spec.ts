import { describe, it, expect } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

import AForm from '../src/components/AForm.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { SchemaTypes, FormSchema } from '../src/types'

describe('AForm Component', () => {
	const wrapper = mount(AForm, {
		props: {
			schema: [
				{
					fieldname: 'first_name',
					fieldtype: 'Data',
					component: 'ATextInput',
					label: 'First Name',
				},
			] as SchemaTypes[],
			data: {},
		},
		components: {
			ATextInput,
		},
	})

	it('AForm v-model should update when the input is changed', async () => {
		await wrapper.vm.$nextTick()
		const aTextInputWrapper = wrapper.findComponent(ATextInput)
		await aTextInputWrapper.find('input').setValue('Steve')
		await wrapper.vm.$nextTick()

		const updateDataEvents = wrapper.emitted('update:data')
		expect(updateDataEvents).toBeTruthy()
		expect((updateDataEvents![updateDataEvents!.length - 1][0] as Record<string, any>).first_name).toBe('Steve')
	})

	it('passes rows from dataModel to a component that has columns but no rows in schema', async () => {
		const MockTable = defineComponent({
			name: 'MockTable',
			props: ['columns', 'rows', 'label', 'fieldname', 'schema', 'data', 'mode'],
			template: '<div class="mock-table"></div>',
		})

		const wrapper = mount(AForm, {
			props: {
				schema: [
					{
						fieldname: 'items',
						component: 'MockTable',
						label: 'Items',
						columns: [{ name: 'id', label: 'ID', fieldtype: 'Int' }],
						// intentionally no 'rows' key — rows should come from dataModel
					},
				] as SchemaTypes[],
				data: { items: [{ id: 1 }, { id: 2 }] },
			},
			global: { components: { MockTable } },
		})

		await wrapper.vm.$nextTick()

		const mockTable = wrapper.findComponent(MockTable)
		expect(mockTable.exists()).toBe(true)
		expect(mockTable.props('rows')).toEqual([{ id: 1 }, { id: 2 }])
	})

	it('should handle componentProps with rows data for nested tables', () => {
		const wrapperWithTable = mount(AForm, {
			props: {
				schema: [
					{
						fieldname: 'items',
						component: 'ATable',
						label: 'Items',
						rows: [],
					},
				] as SchemaTypes[],
				data: {
					items: [
						{ id: 1, name: 'Item 1' },
						{ id: 2, name: 'Item 2' },
					],
				},
			},
		})

		expect(wrapperWithTable.vm).toBeTruthy()
	})

	it('should handle componentProps when rows is not empty', () => {
		const wrapperWithData = mount(AForm, {
			props: {
				schema: [
					{
						fieldname: 'items',
						component: 'ATable',
						label: 'Items',
						rows: [{ id: 1, name: 'Existing' }],
					},
				] as SchemaTypes[],
				data: {
					items: [
						{ id: 1, name: 'Item 1' },
						{ id: 2, name: 'Item 2' },
					],
				},
			},
		})

		expect(wrapperWithData.vm).toBeTruthy()
	})

	describe('kind: table row injection', () => {
		it('passes rows from dataModel to a component with kind: "table" and no columns', async () => {
			const MockTable = defineComponent({
				name: 'MockTable',
				props: ['rows', 'schema', 'label', 'fieldname', 'data', 'mode', 'kind'],
				template: '<div class="mock-table"></div>',
			})

			const wrapper = mount(AForm, {
				props: {
					schema: [
						{
							fieldname: 'items',
							component: 'MockTable',
							label: 'Items',
							kind: 'table',
							schema: [{ fieldname: 'qty', fieldtype: 'Int', label: 'Qty' }],
						},
					] as any[],
					data: { items: [{ qty: 1 }, { qty: 2 }] },
				},
				global: { components: { MockTable } },
			})

			await wrapper.vm.$nextTick()

			const mockTable = wrapper.findComponent(MockTable)
			expect(mockTable.exists()).toBe(true)
			expect(mockTable.props('rows')).toEqual([{ qty: 1 }, { qty: 2 }])
		})
	})

	it('should handle mode prop', () => {
		const modeWrapper = mount(AForm, {
			props: {
				schema: [
					{
						fieldname: 'first_name',
						fieldtype: 'Data',
						component: 'ATextInput',
						label: 'First Name',
					},
				] as SchemaTypes[],
				data: {},
				mode: 'read',
			},
			components: {
				ATextInput,
			},
		})

		expect(modeWrapper.vm).toBeTruthy()
	})

	describe('hidden field behavior', () => {
		it('does not render a field with hidden: true', async () => {
			const wrapper = mount(AForm, {
				props: {
					schema: [
						{
							fieldname: 'visible_field',
							fieldtype: 'Data',
							component: 'ATextInput',
							label: 'Visible',
						},
						{
							fieldname: 'hidden_field',
							fieldtype: 'Data',
							component: 'ATextInput',
							label: 'Hidden',
							hidden: true,
						},
					] as SchemaTypes[],
					data: {},
				},
				components: { ATextInput },
			})

			await wrapper.vm.$nextTick()
			expect(wrapper.findAllComponents(ATextInput)).toHaveLength(1)
		})

		it('renders a field with hidden: false', async () => {
			const wrapper = mount(AForm, {
				props: {
					schema: [
						{
							fieldname: 'visible_field',
							fieldtype: 'Data',
							component: 'ATextInput',
							label: 'Visible',
							hidden: false,
						},
					] as SchemaTypes[],
					data: {},
				},
				components: { ATextInput },
			})

			await wrapper.vm.$nextTick()
			expect(wrapper.findComponent(ATextInput).exists()).toBe(true)
		})
	})

	describe('schema-driven mask', () => {
		it('passes mask from schema field to ATextInput', async () => {
			const schema: SchemaTypes[] = [
				{
					fieldname: 'phone',
					fieldtype: 'Data',
					component: 'ATextInput',
					label: 'Phone',
					mask: '(###) ### - ####',
				} as FormSchema,
			]

			const wrapper = mount(AForm, {
				props: { schema, data: {} },
				components: { ATextInput },
			})

			await wrapper.vm.$nextTick()
			const textInput = wrapper.findComponent(ATextInput)
			expect(textInput.props('mask')).toBe('(###) ### - ####')
		})

		it('applies mask directive to input when mask is in schema', async () => {
			const schema: SchemaTypes[] = [
				{
					fieldname: 'phone',
					fieldtype: 'Data',
					component: 'ATextInput',
					label: 'Phone',
					mask: '###-###-####',
				} as FormSchema,
			]

			const wrapper = mount(AForm, {
				props: { schema, data: { phone: '5551234567' } },
				components: { ATextInput },
			})

			await wrapper.vm.$nextTick()
			const input = wrapper.find('input')
			// mask length is 12, and the value is fully masked so maxlength is set
			expect(input.attributes('maxlength')).toBe('12')
		})

		it('does not set maxlength when no mask is in schema', async () => {
			const schema: SchemaTypes[] = [
				{
					fieldname: 'first_name',
					fieldtype: 'Data',
					component: 'ATextInput',
					label: 'First Name',
				} as FormSchema,
			]

			const wrapper = mount(AForm, {
				props: { schema, data: {} },
				components: { ATextInput },
			})

			await wrapper.vm.$nextTick()
			const input = wrapper.find('input')
			expect(input.attributes('maxlength')).toBeUndefined()
		})
	})

	describe('width schema property', () => {
		it('applies flex-basis and width style when width is set in schema', async () => {
			const MockField = defineComponent({
				name: 'MockField',
				props: ['label', 'mode', 'schema', 'data'],
				template: '<div class="aform_form-element mock-field"></div>',
			})

			const wrapper = mount(AForm, {
				props: {
					schema: [
						{
							fieldname: 'canvas',
							component: 'MockField',
							label: 'Canvas',
							fieldtype: 'Display',
							width: '100%',
						},
					] as SchemaTypes[],
					data: {},
				},
				global: { components: { MockField } },
			})

			await wrapper.vm.$nextTick()
			const field = wrapper.findComponent(MockField)
			expect(field.element.style.flexBasis).toBe('100%')
			expect(field.element.style.width).toBe('100%')
		})

		it('does not apply width style when width is absent in schema', async () => {
			const MockField = defineComponent({
				name: 'MockField',
				props: ['label', 'mode', 'schema', 'data'],
				template: '<div class="aform_form-element mock-field"></div>',
			})

			const wrapper = mount(AForm, {
				props: {
					schema: [
						{
							fieldname: 'name',
							component: 'MockField',
							label: 'Name',
							fieldtype: 'Data',
						},
					] as SchemaTypes[],
					data: {},
				},
				global: { components: { MockField } },
			})

			await wrapper.vm.$nextTick()
			const field = wrapper.findComponent(MockField)
			expect(field.element.style.flexBasis).toBe('')
			expect(field.element.style.width).toBe('')
		})
	})
})
