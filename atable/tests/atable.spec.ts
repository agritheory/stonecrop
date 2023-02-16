import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ATable from '@/components/ATable.vue'
import ACell from '@/components/ACell.vue'
import { ref } from 'vue'

import { TableColumn } from 'types'
import data from '../stories/sample_data/http_logs.json'

const columns: TableColumn[] = [
	{
		label: 'Home Page',
		name: 'home_page',
		type: 'Data',
		align: 'left',
		edit: false,
		width: '35ch',
		format: (value: { title?: string; value?: any }) => {
			return value.title
		},
	},
	{
		label: 'HTTP Method',
		name: 'http_method',
		type: 'Data',
		align: 'left',
		edit: true,
		width: '20ch',
	},
	{
		label: 'Report Date',
		name: 'report_date',
		type: 'component',
		align: 'center',
		edit: true,
		width: '25ch',
		modalComponent: 'ADate',
		format: (value: number) => {
			return new Date(Number(value)).toLocaleDateString('en-US')
		},
	},
]

const http_logs = ref({
	rows: data,
	columns,
	config: { view: 'list' },
})

describe('ATable Component', () => {
	const wrapper = mount(ATable, {
		props: {
			columns: http_logs.value.columns,
			modelValue: http_logs.value.rows,
			config: http_logs.value.config,
		},
		components: {
			ACell,
		},
	})

	it('model update event should emit when cell is edited', async () => {
		await wrapper.vm.$nextTick()

		const aCellWrapper = wrapper.findComponent(ACell)
		await aCellWrapper.findAll('input')
		await wrapper.vm.$nextTick()

		const tds = wrapper.findAll('td')

		const tdElement = tds.at(2)
		tdElement.trigger('click')
		tdElement.element.textContent = 'FETCH'
		tdElement.trigger('input')

		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
	})
})
