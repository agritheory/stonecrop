import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ATable from '@/components/ATable.vue'
import data from './data/http_logs.json'

describe('table modal component', () => {
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

	it('spawn modal component', async () => {
		const wrapper = mount(ATable, { props })

		// spawn modal component
		const dataCells = wrapper.findAll('td')
		const cellElement = dataCells.at(3)
		cellElement!.trigger('click')
		await wrapper.vm.$nextTick()

		expect(wrapper.vm.tableData.modal.visible).toBe(true)
	})

	it('click inside to keep modal component alive', async () => {
		const wrapper = mount(ATable, { props })

		// spawn modal component
		const dataCells = wrapper.findAll('td')
		const cellElement = dataCells.at(3)
		cellElement!.trigger('click')
		await wrapper.vm.$nextTick()

		// click inside
		const $table = wrapper.find('.atable')
		$table.trigger('click')
		expect(wrapper.vm.tableData.modal.visible).toBe(true)
	})

	it('click outside to dismiss modal component', async () => {
		const wrapper = mount(ATable, { props })

		// spawn modal component
		const dataCells = wrapper.findAll('td')
		const cellElement = dataCells.at(3)
		cellElement!.trigger('click')
		await wrapper.vm.$nextTick()

		// click outside
		window.dispatchEvent(new MouseEvent('click'))
		expect(wrapper.vm.tableData.modal.visible).toBe(false)
	})

	it('press escape to dismiss modal component', async () => {
		const wrapper = mount(ATable, { props })

		// spawn modal component
		const dataCells = wrapper.findAll('td')
		const cellElement = dataCells.at(3)
		cellElement!.trigger('click')
		await wrapper.vm.$nextTick()

		// press escape
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
		expect(wrapper.vm.tableData.modal.visible).toBe(false)
	})
})
