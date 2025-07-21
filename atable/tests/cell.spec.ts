import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { config, mount } from '@vue/test-utils'

import data from './data/http_logs.json'
import ACell from '../src/components/ACell.vue'
import ARow from '../src/components/ARow.vue'
import ATable from '../src/components/ATable.vue'
import type { TableColumn, TableConfig } from '../src/types'

describe('table cell component', () => {
	config.global.components = { ACell, ARow }

	const columns: TableColumn[] = [
		{
			label: 'Home Page',
			name: 'home_page',
			type: 'Data',
			align: 'left',
			edit: false,
			width: '35ch',
			format: (value: { title: string }) => value.title,
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
			modalComponent: 'DateInput',
			format: (value: number) => new Date(value).toLocaleDateString('en-US'),
		},
	]

	const props = {
		columns,
		modelValue: data,
		config: { view: 'list' } as TableConfig,
	}

	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('update data when cell is focused', async () => {
		const wrapper = mount(ATable, { props, global: { components: { ACell } } })

		const rowWrapper = wrapper.findComponent({ name: 'ARow' })
		expect(rowWrapper.exists()).toBe(true)
		const cellWrapper = rowWrapper.findComponent(ACell)
		expect(cellWrapper.exists()).toBe(true)

		await cellWrapper.trigger('focus')
		expect(cellWrapper.vm.currentData).toEqual(cellWrapper.text())
	})

	it('emit update event when cell is edited', async () => {
		vi.useFakeTimers()

		const wrapper = mount(ATable, { props, global: { components: { ACell } } })

		const dataCells = wrapper.findAllComponents(ACell)
		const cellElement = dataCells.at(1)
		expect(cellElement?.exists()).toBe(true)

		// can't use `wrapper.setValue` so hack to change the value
		await cellElement!.trigger('click')
		cellElement!.element.textContent = 'POST'
		await cellElement!.trigger('input')

		// Fast-forward time to trigger debounced function
		vi.advanceTimersByTime(300)
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()

		vi.useRealTimers()
	})
})
