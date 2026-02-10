import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AForm from '../src/components/AForm.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { SchemaTypes } from '../src/types'

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

		const updateEvents = wrapper.emitted('update:schema')
		expect(updateEvents).toBeTruthy()
		expect(updateEvents![0]).toEqual([
			[
				{
					fieldname: 'first_name',
					fieldtype: 'Data',
					component: 'ATextInput',
					label: 'First Name',
					value: 'Steve',
				},
			],
		])
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

	it('should handle readonly prop', () => {
		const readonlyWrapper = mount(AForm, {
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
				readOnly: true,
			},
			components: {
				ATextInput,
			},
		})

		expect(readonlyWrapper.vm).toBeTruthy()
	})
})
