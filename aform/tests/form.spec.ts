import { describe, it, expect } from 'vitest'
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

	it('should handle componentProps with rows data for nested tables', () => {
		const wrapperWithTable = mount(AForm, {
			props: {
				schema: [
					{
						fieldname: 'items',
						fieldtype: 'Doctype',
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
						fieldtype: 'Doctype',
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
})
