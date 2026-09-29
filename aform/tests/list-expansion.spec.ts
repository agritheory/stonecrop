import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import AForm from '../src/components/AForm.vue'
import ATextInput from '../src/components/form/ATextInput.vue'
import type { ResolvedField } from '../src/types'

/*
A `list-expansion` table renders each expanded row as a nested AForm: the table's columns that
declare a component become that form's fields, and an edit writes back into that one row.
*/

// Renders the expansion slot for every row, as ATable does for an expanded row.
const ExpandingTable = defineComponent({
	name: 'ExpandingTable',
	props: ['rows', 'schema', 'config', 'label', 'fieldname', 'data', 'mode', 'kind'],
	template: `<div class="expanding-table">
		<div v-for="(row, rowIndex) in rows" :key="rowIndex" class="expanded-row">
			<slot name="content" :row="row" :row-index="rowIndex" />
		</div>
	</div>`,
})

const lines = {
	kind: 'table',
	fieldname: 'lines',
	component: 'ExpandingTable',
	label: 'Lines',
	config: { view: 'list-expansion' },
	schema: [
		{ fieldname: 'sku', label: 'SKU', component: 'ATextInput', width: '12ch', align: 'left' },
		{ fieldname: 'computed_total', label: 'Total', align: 'right' },
	],
} as unknown as ResolvedField

const mountForm = (config: Record<string, unknown> = { view: 'list-expansion' }) =>
	mount(AForm, {
		props: {
			schema: [{ ...lines, config } as ResolvedField],
			data: {
				lines: [
					{ sku: 'A-1', computed_total: 10 },
					{ sku: 'B-2', computed_total: 20 },
				],
			},
		},
		global: { components: { ExpandingTable, ATextInput } },
	})

describe('AForm list-expansion rows', { tags: ['component'] }, () => {
	it('renders each expanded row as a form of the columns that declare a component', () => {
		const nested = mountForm()
			.findAllComponents(AForm)
			.filter(form => form.classes('aform-table-expansion'))

		expect(nested.map(form => form.props('data'))).toEqual([
			{ sku: 'A-1', computed_total: 10 },
			{ sku: 'B-2', computed_total: 20 },
		])
		for (const form of nested) {
			expect(form.props('schema')).toEqual([
				{ kind: 'field', fieldname: 'sku', component: 'ATextInput', label: 'SKU', width: '12ch', align: 'left' },
			])
		}
	})

	it('writes an edit back into its own row only', async () => {
		const wrapper = mountForm()
		await wrapper.findAll('.aform-table-expansion').at(1)!.find('input').setValue('B-9')

		const emitted = wrapper.emitted('update:data')!
		expect(emitted.at(-1)![0]).toEqual({
			lines: [
				{ sku: 'A-1', computed_total: 10 },
				{ sku: 'B-9', computed_total: 20 },
			],
		})
	})

	it('renders no expansion form for any other table view', () => {
		expect(mountForm({ view: 'list' }).findAll('.aform-table-expansion')).toHaveLength(0)
	})
})
