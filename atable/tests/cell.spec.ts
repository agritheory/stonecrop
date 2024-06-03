import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ATable from '@/components/ATable.vue'
import data from '../stories/sample_data/http_logs.json'

describe('table cell component', () => {
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

	const props = {
		columns,
		modelValue: data,
		config: { view: 'list' },
	}

	it('update data when cell is focused', async () => {
		const wrapper = mount(ATable, { props })

		const cellWrapper = wrapper.findComponent({ name: 'ACell' })
		await cellWrapper.trigger('focus')
		expect(cellWrapper.vm.currentData).toEqual(cellWrapper!.text())
	})

	it('emit update event when cell is edited', async () => {
		const wrapper = mount(ATable, { props })

		const dataCells = wrapper.findAll('td')
		const cellElement = dataCells.at(2)
		await cellElement!.trigger('click')
		// can't use `wrapper.setValue` so hack to change the value
		cellElement!.element.textContent = 'POST'
		await cellElement!.trigger('input')

		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
	})
})
