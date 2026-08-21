import { describe, it, expect } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

import AForm from '../src/components/AForm.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { ResolvedField } from '../src/types'

describe('AForm Component', { tags: ['component'] }, () => {
	const wrapper = mount(AForm, {
		props: {
			schema: [
				{
					fieldname: 'first_name',
					component: 'ATextInput',
					label: 'First Name',
				},
			] as ResolvedField[],
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

	it('does not inject rows for a columns-shaped field without kind: "table"', async () => {
		// `columns` is the *authoring* key (TableField); AForm consumes the *resolved* shape,
		// where a table is `kind: 'table'` + `schema`. A field carrying `columns` never went
		// through the registry, so AForm must not treat it as a table — leaving `rows`
		// unset makes ATable's required-prop check fail loudly instead of silently
		// rendering an empty table.
		const MockTable = defineComponent({
			name: 'MockTable',
			props: ['columns', 'rows', 'label', 'fieldname', 'schema', 'data', 'mode'],
			template: '<div class="mock-table"></div>',
		})

		const localWrapper = mount(AForm, {
			props: {
				schema: [
					{
						fieldname: 'items',
						component: 'MockTable',
						label: 'Items',
						columns: [{ name: 'id', label: 'ID' }],
					},
				] as unknown as ResolvedField[],
				data: { items: [{ id: 1 }, { id: 2 }] },
			},
			global: { components: { MockTable } },
		})

		await localWrapper.vm.$nextTick()

		const mockTable = localWrapper.findComponent(MockTable)
		expect(mockTable.exists()).toBe(true)
		expect(mockTable.props('rows')).toBeUndefined()
	})

	// Was two tests differing only in a `rows` key on the *schema*, one empty and one populated.
	// AForm never reads that key — a table sources its rows from the data model, keyed on `kind`
	// (AForm.vue) — so the two fixtures were identical as far as the component was concerned, and
	// `rows` was not on ResolvedField either. What they actually covered is this: a field naming a
	// table component but carrying no `kind` still mounts. The rows themselves are asserted by the
	// `kind: table row injection` block below.
	it('mounts a field that names a table component but declares no kind', () => {
		const wrapperWithTable = mount(AForm, {
			props: {
				schema: [
					{
						fieldname: 'items',
						component: 'ATable',
						label: 'Items',
					},
				] as ResolvedField[],
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

	describe('kind: table row injection', () => {
		it('passes rows from dataModel to a component with kind: "table" and no columns', async () => {
			const MockTable = defineComponent({
				name: 'MockTable',
				props: ['rows', 'schema', 'label', 'fieldname', 'data', 'mode', 'kind'],
				template: '<div class="mock-table"></div>',
			})

			const localWrapper = mount(AForm, {
				props: {
					schema: [
						{
							fieldname: 'items',
							component: 'MockTable',
							label: 'Items',
							kind: 'table',
							schema: [{ fieldname: 'qty', label: 'Qty' }],
						},
					] as any[],
					data: { items: [{ qty: 1 }, { qty: 2 }] },
				},
				global: { components: { MockTable } },
			})

			await localWrapper.vm.$nextTick()

			const mockTable = localWrapper.findComponent(MockTable)
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
						component: 'ATextInput',
						label: 'First Name',
					},
				] as ResolvedField[],
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
			const localWrapper = mount(AForm, {
				props: {
					schema: [
						{
							fieldname: 'visible_field',
							component: 'ATextInput',
							label: 'Visible',
						},
						{
							fieldname: 'hidden_field',
							component: 'ATextInput',
							label: 'Hidden',
							hidden: true,
						},
					] as ResolvedField[],
					data: {},
				},
				components: { ATextInput },
			})

			await localWrapper.vm.$nextTick()
			expect(localWrapper.findAllComponents(ATextInput)).toHaveLength(1)
		})

		it('renders a field with hidden: false', async () => {
			const localWrapper = mount(AForm, {
				props: {
					schema: [
						{
							fieldname: 'visible_field',
							component: 'ATextInput',
							label: 'Visible',
							hidden: false,
						},
					] as ResolvedField[],
					data: {},
				},
				components: { ATextInput },
			})

			await localWrapper.vm.$nextTick()
			expect(localWrapper.findComponent(ATextInput).exists()).toBe(true)
		})
	})

	describe('schema-driven mask', () => {
		it('passes mask from schema field to ATextInput', async () => {
			const schema: ResolvedField[] = [
				{
					fieldname: 'phone',
					component: 'ATextInput',
					label: 'Phone',
					mask: '(###) ### - ####',
				} as ResolvedField,
			]

			const localWrapper = mount(AForm, {
				props: { schema, data: {} },
				components: { ATextInput },
			})

			await localWrapper.vm.$nextTick()
			const textInput = localWrapper.findComponent(ATextInput)
			expect(textInput.props('mask')).toBe('(###) ### - ####')
		})

		it('applies mask directive to input when mask is in schema', async () => {
			const schema: ResolvedField[] = [
				{
					fieldname: 'phone',
					component: 'ATextInput',
					label: 'Phone',
					mask: '###-###-####',
				} as ResolvedField,
			]

			const localWrapper = mount(AForm, {
				props: { schema, data: { phone: '5551234567' } },
				components: { ATextInput },
			})

			await localWrapper.vm.$nextTick()
			const input = localWrapper.find('input')
			// mask length is 12, and the value is fully masked so maxlength is set
			expect(input.attributes('maxlength')).toBe('12')
		})

		it('does not set maxlength when no mask is in schema', async () => {
			const schema: ResolvedField[] = [
				{
					fieldname: 'first_name',
					component: 'ATextInput',
					label: 'First Name',
				} as ResolvedField,
			]

			const localWrapper = mount(AForm, {
				props: { schema, data: {} },
				components: { ATextInput },
			})

			await localWrapper.vm.$nextTick()
			const input = localWrapper.find('input')
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

			const localWrapper = mount(AForm, {
				props: {
					schema: [
						{
							kind: 'field' as const,
							fieldname: 'canvas',
							component: 'MockField',
							label: 'Canvas',
							width: '100%',
						},
					] as ResolvedField[],
					data: {},
				},
				global: { components: { MockField } },
			})

			await localWrapper.vm.$nextTick()
			const field = localWrapper.findComponent(MockField)
			expect(field.element.style.flexBasis).toBe('100%')
			expect(field.element.style.width).toBe('100%')
		})

		it('does not apply width style when width is absent in schema', async () => {
			const MockField = defineComponent({
				name: 'MockField',
				props: ['label', 'mode', 'schema', 'data'],
				template: '<div class="aform_form-element mock-field"></div>',
			})

			const localWrapper = mount(AForm, {
				props: {
					schema: [
						{
							fieldname: 'name',
							component: 'MockField',
							label: 'Name',
						},
					] as ResolvedField[],
					data: {},
				},
				global: { components: { MockField } },
			})

			await localWrapper.vm.$nextTick()
			const field = localWrapper.findComponent(MockField)
			expect(field.element.style.flexBasis).toBe('')
			expect(field.element.style.width).toBe('')
		})
	})

	describe('height schema property', () => {
		it('applies the height style — and the flex properties that let it take effect — when set', async () => {
			const MockField = defineComponent({
				name: 'MockField',
				props: ['label', 'mode', 'schema', 'data'],
				template: '<div class="aform_form-element mock-field"></div>',
			})

			const localWrapper = mount(AForm, {
				props: {
					schema: [
						{
							kind: 'field' as const,
							fieldname: 'planner',
							component: 'MockField',
							label: 'Planner',
							height: '40vh',
						},
					] as ResolvedField[],
					data: {},
				},
				global: { components: { MockField } },
			})

			await localWrapper.vm.$nextTick()
			const field = localWrapper.findComponent(MockField)
			expect(field.element.style.height).toBe('40vh')
			// A bare height is inert inside the form's flex row: the wrapper still has to be allowed
			// to grow and stretch, and to shrink below its content.
			expect(field.element.style.minHeight).toBe('0px')
			expect(field.element.style.flexGrow).toBe('1')
			expect(field.element.style.alignSelf).toBe('stretch')
		})

		it('does not apply height style when height is absent in schema', async () => {
			const MockField = defineComponent({
				name: 'MockField',
				props: ['label', 'mode', 'schema', 'data'],
				template: '<div class="aform_form-element mock-field"></div>',
			})

			const localWrapper = mount(AForm, {
				props: {
					schema: [
						{
							kind: 'field' as const,
							fieldname: 'name',
							component: 'MockField',
							label: 'Name',
							width: '20ch',
						},
					] as ResolvedField[],
					data: {},
				},
				global: { components: { MockField } },
			})

			await localWrapper.vm.$nextTick()
			const field = localWrapper.findComponent(MockField)
			expect(field.element.style.height).toBe('')
			expect(field.element.style.alignSelf).toBe('')
		})

		it('is not forwarded to the field component as a prop', async () => {
			const MockField = defineComponent({
				name: 'MockField',
				props: ['label', 'mode', 'schema', 'data'],
				template: '<div class="aform_form-element mock-field"></div>',
			})

			const localWrapper = mount(AForm, {
				props: {
					schema: [
						{
							kind: 'field' as const,
							fieldname: 'planner',
							component: 'MockField',
							label: 'Planner',
							height: '100%',
						},
					] as ResolvedField[],
					data: {},
				},
				global: { components: { MockField } },
			})

			await localWrapper.vm.$nextTick()
			// `height` drives the wrapper style only — leaking it as an attr would stamp a bare
			// height="100%" onto whatever element the field renders.
			expect(localWrapper.findComponent(MockField).attributes('height')).toBeUndefined()
		})
	})
})

describe('AForm mode forwarding', { tags: ['component'] }, () => {
	it('passes mode prop to a component with kind: "table" in the schema', async () => {
		const MockTable = defineComponent({
			name: 'MockTable',
			props: ['schema', 'rows', 'label', 'fieldname', 'data', 'mode'],
			template: '<div class="mock-table"></div>',
		})

		const tableSchema: ResolvedField[] = [
			{
				kind: 'table' as const,
				fieldname: 'line_items',
				component: 'MockTable',
				label: 'Line Items',
				schema: [{ fieldname: 'qty' }],
				config: { view: 'list' as const },
			},
		]

		const wrapper = mount(AForm, {
			props: {
				schema: tableSchema,
				data: { line_items: [] },
				mode: 'read',
			},
			global: { components: { MockTable } },
		})

		await wrapper.vm.$nextTick()

		const table = wrapper.findComponent(MockTable)
		expect(table.exists()).toBe(true)
		expect(table.props('mode')).toBe('read')
	})
})
