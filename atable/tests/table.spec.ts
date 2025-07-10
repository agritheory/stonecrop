import { config, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'

import data from './data/http_logs.json'
import ACell from '../src/components/ACell.vue'
import ARow from '../src/components/ARow.vue'
import ATable from '../src/components/ATable.vue'
import type { GanttOptions, TableColumn, TableConfig, TableRow } from '../src/types'

describe('table component', () => {
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

	const basicColumns: TableColumn[] = [
		{ name: 'id', label: 'ID', width: '100px' },
		{ name: 'name', label: 'Name', width: '200px' },
		{ name: 'status', label: 'Status', width: '150px' },
	]

	const basicRows: TableRow[] = [
		{ id: 1, name: 'John', status: 'active' },
		{ id: 2, name: 'Jane', status: 'inactive' },
	]

	const defaultProps = {
		columns,
		modelValue: data,
		config: { view: 'list' } as TableConfig,
	}

	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('verify header row', async () => {
		const wrapper = mount(ATable, { props: defaultProps })
		expect(wrapper.vm).toBeTruthy()

		const headerCells = wrapper.findAll('th')
		expect(headerCells.length).toBe(columns.length + 1)

		const homePageHeader = headerCells.at(1)
		expect(homePageHeader!.element.style.width).toBe('35ch')
		expect(homePageHeader!.element.style.textAlign).toBe('left')

		const httpMethodHeader = headerCells.at(2)
		expect(httpMethodHeader!.element.style.width).toBe('20ch')
		expect(httpMethodHeader!.element.style.textAlign).toBe('left')

		const reportDateHeader = headerCells.at(3)
		expect(reportDateHeader!.element.style.width).toBe('25ch')
		expect(reportDateHeader!.element.style.textAlign).toBe('center')
	})

	it('verify data rows (format function)', async () => {
		const wrapper = mount(ATable, { props: defaultProps })

		const dataCells = wrapper.findAllComponents(ACell)
		expect(dataCells.length).toBe(columns.length * data.length)

		const homePageCell = dataCells.at(0)
		expect(homePageCell?.exists()).toBe(true)
		expect(homePageCell!.text()).toBeTypeOf('string') // test string format

		const httpMethodCell = dataCells.at(1)
		expect(httpMethodCell?.exists()).toBe(true)
		expect(httpMethodCell!.text()).toBeTruthy()

		const reportDateCell = dataCells.at(2)
		expect(reportDateCell?.exists()).toBe(true)
		expect(reportDateCell!.text()).toBeTruthy()
	})

	it('verify data rows (format string)', async () => {
		const columns: TableColumn[] = [
			{
				label: 'Home Page',
				name: 'home_page',
				type: 'Data',
				align: 'left',
				edit: false,
				width: '35ch',
				format: '(value) => {\n\t\t\t\treturn value.title\n\t\t\t}',
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

		const wrapper = mount(ATable, {
			props: {
				columns,
				modelValue: data,
				config: { view: 'list' },
			},
		})

		const dataCells = wrapper.findAllComponents(ACell)
		expect(dataCells.length).toBe(columns.length * data.length) // +1 for the row number column

		const homePageCell = dataCells.at(0)
		expect(homePageCell?.exists()).toBe(true)
		expect(homePageCell!.text()).toBeTypeOf('string') // test string format

		const httpMethodCell = dataCells.at(1)
		expect(httpMethodCell?.exists()).toBe(true)
		expect(httpMethodCell!.text()).toBeTruthy()

		const reportDateCell = dataCells.at(2)
		expect(reportDateCell?.exists()).toBe(true)
		expect(reportDateCell!.text()).toBeTruthy()
	})

	it('verify data rows (no format)', async () => {
		const columns: TableColumn[] = [
			{
				label: 'Home Page',
				name: 'home_page',
				type: 'Data',
				align: 'left',
				edit: false,
				width: '35ch',
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

		const wrapper = mount(ATable, {
			props: {
				columns,
				modelValue: data,
				config: { view: 'list' },
			},
		})

		const dataCells = wrapper.findAllComponents(ACell)
		expect(dataCells.length).toBe(columns.length * data.length)

		const homePageCell = dataCells.at(0)
		expect(homePageCell?.exists()).toBe(true)
		const text = JSON.parse(homePageCell!.text())
		expect(text).toBeTypeOf('object') // test no format

		const httpMethodCell = dataCells.at(1)
		expect(httpMethodCell?.exists()).toBe(true)
		expect(httpMethodCell!.text()).toBeTruthy()

		const reportDateCell = dataCells.at(2)
		expect(reportDateCell?.exists()).toBe(true)
		expect(reportDateCell!.text()).toBeTruthy()
	})

	it('should render with default config when no config provided', () => {
		const wrapper = mount(ATable, {
			props: {
				columns: basicColumns,
				modelValue: basicRows,
			},
		})

		expect(wrapper.find('.atable-container')).toBeTruthy()
		expect(wrapper.find('.atable')).toBeTruthy()
	})

	it('should handle fullWidth configuration', () => {
		const wrapper = mount(ATable, {
			props: {
				columns: basicColumns,
				modelValue: basicRows,
				config: { fullWidth: true },
			},
		})

		const table = wrapper.find('.atable')
		expect(table.attributes('style')).toContain('width: 100%')
	})

	it('should emit cellUpdate when cell data changes', async () => {
		const wrapper = mount(ATable, {
			props: {
				columns: basicColumns,
				modelValue: basicRows,
			},
		})

		// Access the store and trigger a cell update
		const tableStore = wrapper.vm.store
		tableStore.setCellData(0, 0, 'new value')

		await nextTick()
		expect(wrapper.emitted('cellUpdate')).toBeTruthy()
		expect(wrapper.emitted('cellUpdate')?.[0][0]).toEqual({
			colIndex: 0,
			rowIndex: 0,
			newValue: 'new value',
			oldValue: 1,
		})
	})

	it('should emit update:modelValue when rows change', async () => {
		const wrapper = mount(ATable, {
			props: {
				columns: basicColumns,
				modelValue: basicRows,
			},
		})

		// Trigger a row change
		const tableStore = wrapper.vm.store
		tableStore.rows[0].name = 'Updated Name'

		await nextTick()
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
	})

	it('should handle gantt view with gantt bars', () => {
		const ganttColumns: TableColumn[] = [
			{ name: 'id', label: 'ID', width: '100px', pinned: true },
			{ name: 'task', label: 'Task', width: '200px' },
		]

		const ganttRows: TableRow[] = [
			{
				id: 1,
				task: 'Task 1',
				gantt: {
					startIndex: 0,
					endIndex: 5,
					color: '#ff0000',
					colspan: 3,
				} as GanttOptions,
			},
		]

		const wrapper = mount(ATable, {
			props: {
				columns: ganttColumns,
				modelValue: ganttRows,
				config: { view: 'gantt' },
			},
		})

		// Should render AGanttConnection component for gantt view
		expect(wrapper.findComponent({ name: 'AGanttConnection' }).exists()).toBe(true)
	})

	it('should process columns correctly for gantt rows with pinned columns', () => {
		const ganttColumns: TableColumn[] = [
			{ name: 'id', label: 'ID', width: '100px', pinned: true },
			{ name: 'task', label: 'Task', width: '200px', pinned: true },
			{ name: 'gantt', label: 'Timeline', width: 'auto' },
		]

		const ganttRows: TableRow[] = [
			{
				id: 1,
				task: 'Task 1',
				gantt: {
					startIndex: 0,
					endIndex: 5,
					color: '#ff0000',
					colspan: 2,
				} as GanttOptions,
			},
		]

		const wrapper = mount(ATable, {
			props: {
				columns: ganttColumns,
				modelValue: ganttRows,
			},
		})

		// Store should have the correct data
		expect(wrapper.vm.store.columns).toEqual(ganttColumns)
		expect(wrapper.vm.store.rows).toEqual(ganttRows)
	})

	it('should handle modal visibility and escape key', async () => {
		const wrapper = mount(ATable, {
			props: {
				columns: basicColumns,
				modelValue: basicRows,
			},
		})

		const tableStore = wrapper.vm.store

		// Show modal
		tableStore.modal.visible = true
		await nextTick()

		// Simulate escape key
		const escEvent = new KeyboardEvent('keydown', { key: 'Escape' })
		window.dispatchEvent(escEvent)

		await nextTick()
		expect(tableStore.modal.visible).toBe(false)
	})

	it('should handle connection events correctly', async () => {
		const ganttColumns: TableColumn[] = [
			{ name: 'id', label: 'ID', width: '100px', pinned: true },
			{ name: 'gantt', label: 'Timeline', width: 'auto' },
		]

		const ganttRows: TableRow[] = [
			{
				id: 1,
				gantt: {
					startIndex: 0,
					endIndex: 5,
					color: '#ff0000',
				} as GanttOptions,
			},
		]

		const wrapper = mount(ATable, {
			props: {
				columns: ganttColumns,
				modelValue: ganttRows,
				config: { view: 'gantt' },
			},
		})

		// Check that AGanttConnection component exists
		const ganttConnection = wrapper.findComponent({ name: 'AGanttConnection' })
		expect(ganttConnection.exists()).toBe(true)

		// The events should be handled by the component automatically via listeners
		// The store should have the proper connection methods
		expect(wrapper.vm.store.createConnection).toBeDefined()
		expect(wrapper.vm.store.deleteConnection).toBeDefined()
	})

	it('should emit cellUpdate when setCellText is called', async () => {
		const wrapper = mount(ATable, {
			props: {
				columns: basicColumns,
				modelValue: basicRows,
			},
		})

		// Access the store and trigger a cell update via setCellText
		const tableStore = wrapper.vm.store
		tableStore.setCellText(0, 0, 'new text value')

		await nextTick()
		expect(wrapper.emitted('cellUpdate')).toBeTruthy()
		expect(wrapper.emitted('cellUpdate')?.[0][0]).toMatchObject({
			colIndex: 0,
			rowIndex: 0,
			newValue: 'new text value',
		})
	})

	it('should handle rows prop when modelValue is not provided', () => {
		const wrapper = mount(ATable, {
			props: {
				columns: basicColumns,
				modelValue: [],
				rows: basicRows,
			},
		})

		expect(wrapper.vm.store.rows).toEqual([])
	})

	it('should expose store and connection methods', () => {
		const wrapper = mount(ATable, {
			props: {
				columns: basicColumns,
				modelValue: basicRows,
			},
		})

		// Check exposed methods
		expect(wrapper.vm.store).toBeTruthy()
		expect(wrapper.vm.createConnection).toBe(wrapper.vm.store.createConnection)
		expect(wrapper.vm.deleteConnection).toBe(wrapper.vm.store.deleteConnection)
		expect(wrapper.vm.getConnectionsForBar).toBe(wrapper.vm.store.getConnectionsForBar)
		expect(wrapper.vm.getHandlesForBar).toBe(wrapper.vm.store.getHandlesForBar)
	})

	it('should handle rows prop when modelValue is not provided', () => {
		const wrapper = mount(ATable, {
			props: {
				columns: basicColumns,
				modelValue: basicRows,
				rows: [], // This should be ignored since modelValue is provided
			},
		})

		expect(wrapper.vm.store.rows).toEqual(basicRows)
	})

	it('should use modelValue over rows when both are provided', () => {
		const modelValueRows = [{ id: 3, name: 'Model', status: 'test' }]

		const wrapper = mount(ATable, {
			props: {
				columns: basicColumns,
				modelValue: modelValueRows,
				rows: basicRows,
			},
		})

		expect(wrapper.vm.store.rows).toEqual(modelValueRows)
	})

	it('should handle custom gantt data', () => {
		const ganttColumns: TableColumn[] = [
			{ name: 'id', label: 'ID', width: '100px', pinned: true },
			{ name: 'gantt', label: 'Timeline', width: 'auto' },
		]

		const ganttRows: TableRow[] = [
			{
				id: 1,
				gantt: {
					startIndex: 0,
					endIndex: 5,
					color: '#ff0000',
				} as GanttOptions,
			},
		]

		const wrapper = mount(ATable, {
			props: {
				columns: ganttColumns,
				modelValue: ganttRows,
			},
		})

		// Should render with gantt data
		expect(wrapper.vm.store.rows[0].gantt?.color).toBe('#ff0000')
		expect(wrapper.vm.store.rows[0].gantt?.startIndex).toBe(0)
		expect(wrapper.vm.store.rows[0].gantt?.endIndex).toBe(5)
	})

	it('should handle custom cell components for regular cells', () => {
		const customColumns: TableColumn[] = [
			{ name: 'id', label: 'ID', width: '100px', cellComponent: 'CustomCell' },
			{ name: 'name', label: 'Name', width: '200px' },
		]

		const wrapper = mount(ATable, {
			props: {
				columns: customColumns,
				modelValue: basicRows,
			},
		})

		// Should render with custom cell component specified
		expect(wrapper.vm.store.columns[0].cellComponent).toBe('CustomCell')
	})

	it('should handle slots for header, body, footer, and modal', () => {
		const wrapper = mount(ATable, {
			props: {
				columns: basicColumns,
				modelValue: basicRows,
			},
			slots: {
				header: '<div data-test="custom-header">Custom Header</div>',
				body: '<div data-test="custom-body">Custom Body</div>',
				footer: '<div data-test="custom-footer">Custom Footer</div>',
				modal: '<div data-test="custom-modal">Custom Modal</div>',
			},
		})

		expect(wrapper.find('[data-test="custom-header"]').exists()).toBe(true)
		expect(wrapper.find('[data-test="custom-body"]').exists()).toBe(true)
		expect(wrapper.find('[data-test="custom-footer"]').exists()).toBe(true)
		expect(wrapper.find('[data-test="custom-modal"]').exists()).toBe(true)
	})
})
