import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ATable from '@/components/ATable.vue'
import listData from '../stories/sample_data/http_logs.json'

describe('table row component', () => {
	const columns = [
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

	it('verify no expand symbol on list table config', async () => {
		const wrapper = mount(ATable, {
			props: {
				columns,
				modelValue: listData,
				config: { view: 'list' },
			},
		})

		const rowWrapper = wrapper.findComponent({ name: 'ARow' })
		expect(rowWrapper.exists()).toBe(true)

		const listColumns = rowWrapper.findAll('.list-index')
		const treeColumns = rowWrapper.findAll('.tree-index')
		expect(listColumns.length).toBe(1) // since only one instance of a row is retrieved
		expect(treeColumns.length).toBe(0)
	})

	it('verify expand symbol on tree table config', async () => {
		const wrapper = mount(ATable, {
			props: {
				columns,
				modelValue: listData,
				config: { view: 'tree' },
			},
		})

		const rowWrapper = wrapper.findComponent({ name: 'ARow' })
		expect(rowWrapper.exists()).toBe(true)

		const listColumns = rowWrapper.findAll('.list-index')
		const treeColumns = rowWrapper.findAll('.tree-index')
		expect(listColumns.length).toBe(0)
		expect(treeColumns.length).toBe(1) // since only one instance of a row is retrieved
	})
})
