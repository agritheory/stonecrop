import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { config, mount } from '@vue/test-utils'

import data from './data/http_logs.json'
import ACell from '../src/components/ACell.vue'
import ARow from '../src/components/ARow.vue'
import ATable from '../src/components/ATable.vue'
import type { TableColumn, TableConfig } from '../src/types'

describe('table modal component', () => {
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
			format: (value: string | number) => new Date(value).toLocaleDateString('en-US'),
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

	it('spawn modal component', async () => {
		const wrapper = mount(ATable, { props, global: { components: { ACell } } })
		expect(wrapper.vm.store.modal.visible).toBe(false)

		// spawn modal component
		const cells = wrapper.findAllComponents(ACell)
		const cellElement = cells.at(2) // data cell with modal component
		expect(cellElement?.exists()).toBe(true)

		await cellElement!.trigger('click')
		expect(wrapper.vm.store.modal.visible).toBe(true)
	})

	it('click inside to keep modal component alive', async () => {
		const wrapper = mount(ATable, { props, global: { components: { ACell } } })
		expect(wrapper.vm.store.modal.visible).toBe(false)

		// spawn modal component
		const cells = wrapper.findAllComponents(ACell)
		const cellElement = cells.at(2) // data cell with modal component
		await cellElement!.trigger('click')
		expect(wrapper.vm.store.modal.visible).toBe(true)
	})

	it('click outside to dismiss modal component', async () => {
		const wrapper = mount(ATable, { props, global: { components: { ACell } } })
		expect(wrapper.vm.store.modal.visible).toBe(false)

		// spawn modal component
		const cells = wrapper.findAllComponents(ACell)
		const cellElement = cells.at(2) // data cell with modal component
		await cellElement!.trigger('click')
		expect(wrapper.vm.store.modal.visible).toBe(true)

		// click outside
		window.dispatchEvent(new MouseEvent('click'))
		expect(wrapper.vm.store.modal.visible).toBe(false)
	})

	it('press escape to dismiss modal component', async () => {
		const wrapper = mount(ATable, { props, global: { components: { ACell } } })
		expect(wrapper.vm.store.modal.visible).toBe(false)

		// spawn modal component
		const cells = wrapper.findAllComponents(ACell)
		const cellElement = cells.at(2) // data cell with modal component
		await cellElement!.trigger('click')
		expect(wrapper.vm.store.modal.visible).toBe(true)

		// press escape
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
		expect(wrapper.vm.store.modal.visible).toBe(false)
	})
})
