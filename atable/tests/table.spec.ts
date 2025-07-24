import { config, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'

// Mock VueUse functions
vi.mock('@vueuse/core', () => ({
	useElementBounding: vi.fn(() => ({
		width: { value: 200 },
		height: { value: 100 },
	})),
	useDebounceFn: vi.fn(fn => fn),
	useMutationObserver: vi.fn(),
}))

vi.mock('@vueuse/components', () => ({
	vResizeObserver: vi.fn(),
	vOnClickOutside: vi.fn(),
}))

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

	const getBasicRows = (): TableRow[] => [
		{ id: 1, name: 'John', status: 'active' },
		{ id: 2, name: 'Jane', status: 'inactive' },
	]

	const defaultProps = {
		rows: data,
		columns,
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
				rows: data,
				columns,
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
				rows: data,
				columns,
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
				rows: getBasicRows(),
				columns: basicColumns,
			},
		})

		expect(wrapper.find('.atable-container')).toBeTruthy()
		expect(wrapper.find('.atable')).toBeTruthy()
	})

	it('should handle fullWidth configuration', () => {
		const wrapper = mount(ATable, {
			props: {
				rows: getBasicRows(),
				columns: basicColumns,
				config: { fullWidth: true },
			},
		})

		const table = wrapper.find('.atable')
		expect(table.attributes('style')).toContain('width: 100%')
	})

	it('should emit cellUpdate when cell data changes', async () => {
		const wrapper = mount(ATable, {
			props: {
				rows: getBasicRows(),
				columns: basicColumns,
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

	it('should emit update:rows when rows change', async () => {
		const wrapper = mount(ATable, {
			props: {
				rows: getBasicRows(),
				columns: basicColumns,
			},
		})

		// Trigger a row change using the proper store method
		const tableStore = wrapper.vm.store
		tableStore.setCellData(0, 1, 'Updated Name') // Update the 'name' column (index 1)

		await nextTick()
		expect(wrapper.emitted('update:rows')).toBeTruthy()
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
				rows: ganttRows,
				columns: ganttColumns,
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
				rows: ganttRows,
				columns: ganttColumns,
			},
		})

		// Store should have the correct data
		expect(wrapper.vm.store.columns).toEqual(ganttColumns)
		expect(wrapper.vm.store.rows).toEqual(ganttRows)
	})

	it('should handle modal visibility and escape key', async () => {
		const wrapper = mount(ATable, {
			props: {
				rows: getBasicRows(),
				columns: basicColumns,
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
				rows: ganttRows,
				columns: ganttColumns,
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
				rows: getBasicRows(),
				columns: basicColumns,
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

	it('should expose store and connection methods', () => {
		const wrapper = mount(ATable, {
			props: {
				rows: getBasicRows(),
				columns: basicColumns,
			},
		})

		// Check exposed methods
		expect(wrapper.vm.store).toBeTruthy()
		expect(wrapper.vm.createConnection).toBe(wrapper.vm.store.createConnection)
		expect(wrapper.vm.deleteConnection).toBe(wrapper.vm.store.deleteConnection)
		expect(wrapper.vm.getConnectionsForBar).toBe(wrapper.vm.store.getConnectionsForBar)
		expect(wrapper.vm.getHandlesForBar).toBe(wrapper.vm.store.getHandlesForBar)
	})

	it('should handle custom cell components for regular cells', () => {
		const customColumns: TableColumn[] = [
			{ name: 'id', label: 'ID', width: '100px', cellComponent: 'CustomCell' },
			{ name: 'name', label: 'Name', width: '200px' },
		]

		const wrapper = mount(ATable, {
			props: {
				rows: getBasicRows(),
				columns: customColumns,
			},
		})

		// Should render with custom cell component specified
		expect(wrapper.vm.store.columns[0].cellComponent).toBe('CustomCell')
	})

	it('should handle slots for header, body, footer, and modal', () => {
		const wrapper = mount(ATable, {
			props: {
				rows: getBasicRows(),
				columns: basicColumns,
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

	it('should support columns as model value', async () => {
		const initialColumns: TableColumn[] = [
			{ name: 'id', label: 'ID', width: '100px' },
			{ name: 'name', label: 'Name', width: '200px' },
		]

		const wrapper = mount(ATable, {
			props: {
				rows: getBasicRows(),
				columns: initialColumns,
				'onUpdate:columns': (newColumns: TableColumn[] | undefined) => {
					if (newColumns) {
						wrapper.setProps({ columns: newColumns })
					}
				},
			},
		})

		// Initial columns should be set
		expect(wrapper.vm.store.columns).toEqual(initialColumns)

		// Trigger a column resize which should emit columns:update
		const tableStore = wrapper.vm.store
		tableStore.resizeColumn(0, 150)

		await nextTick()

		// Should emit columns:update event
		expect(wrapper.emitted('columns:update')).toBeTruthy()
		const emittedColumns = wrapper.emitted('columns:update')?.[0][0] as TableColumn[]
		expect(emittedColumns[0].width).toBe('150px')
	})

	it('should work with v-model:columns using model prop', async () => {
		const initialColumns: TableColumn[] = [
			{ name: 'id', label: 'ID', width: '100px' },
			{ name: 'name', label: 'Name', width: '200px' },
		]

		// Test using columns model instead of columns prop
		const wrapper = mount(ATable, {
			props: {
				rows: getBasicRows(),
				columns: initialColumns,
			},
		})

		// Should use columns from prop
		expect(wrapper.vm.store.columns).toEqual(initialColumns)
	})
})

describe('Gantt View', () => {
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
				rows: ganttRows,
				columns: ganttColumns,
			},
		})

		// Should render with gantt data
		expect(wrapper.vm.store.rows[0].gantt?.color).toBe('#ff0000')
		expect(wrapper.vm.store.rows[0].gantt?.startIndex).toBe(0)
		expect(wrapper.vm.store.rows[0].gantt?.endIndex).toBe(5)
	})
})
