import { config, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import type { ColumnSchema } from '@stonecrop/schema'

// Mock VueUse functions
vi.mock('@vueuse/core', async importOriginal => ({
	// Partial mock: spread the real module so exports pulled in by dependencies (e.g.
	// @stonecrop/utilities' focus composables) stay intact — a full-replacement mock breaks
	// whenever the dependency graph needs an export the mock didn't list.
	...(await importOriginal<typeof import('@vueuse/core')>()),
	// The real composable always returns all of these; omitting left/bottom made the mock a shape
	// the library never produces, which is how a TypeError in ACell's $patch went unnoticed.
	useElementBounding: vi.fn(() => ({
		left: { value: 10 },
		bottom: { value: 60 },
		width: { value: 200 },
		height: { value: 100 },
	})),
	useDebounceFn: vi.fn(fn => fn),
	useMutationObserver: vi.fn(),
	useResizeObserver: vi.fn(),
	onClickOutside: vi.fn(),
}))

vi.mock('@vueuse/components', () => ({
	vResizeObserver: vi.fn(),
	vOnClickOutside: vi.fn(),
}))

import data from './data/http_logs.json'
import ACell from '../src/components/ACell.vue'
import ARow from '../src/components/ARow.vue'
import ATable from '../src/components/ATable.vue'
import type { GanttOptions, RowClickEvent, TableColumn, TableConfig, TableRow } from '../src/types'

function getBasicRows(): TableRow[] {
	return [
		{ id: 1, name: 'John', status: 'active' },
		{ id: 2, name: 'Jane', status: 'inactive' },
	]
}

describe('table component', { tags: ['component'] }, () => {
	config.global.components = { ACell, ARow }

	const columns: TableColumn[] = [
		{
			label: 'Home Page',
			name: 'home_page',
			component: 'ATextInput',
			align: 'left',
			edit: false,
			width: '35ch',
			format: (value: { title: string }) => value.title,
		},
		{
			label: 'HTTP Method',
			name: 'http_method',
			component: 'ATextInput',
			align: 'left',
			edit: true,
			width: '20ch',
		},
		{
			label: 'Report Date',
			name: 'report_date',
			component: 'ADate',
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
		const testColumns: TableColumn[] = [
			{
				label: 'Home Page',
				name: 'home_page',
				component: 'ATextInput',
				align: 'left',
				edit: false,
				width: '35ch',
				format: '(value) => {\n\t\t\t\treturn value.title\n\t\t\t}',
			},
			{
				label: 'HTTP Method',
				name: 'http_method',
				component: 'ATextInput',
				align: 'left',
				edit: true,
				width: '20ch',
			},
			{
				label: 'Report Date',
				name: 'report_date',
				component: 'ADate',
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
				columns: testColumns,
				config: { view: 'list' },
			},
		})

		const dataCells = wrapper.findAllComponents(ACell)
		expect(dataCells.length).toBe(testColumns.length * data.length) // +1 for the row number column

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
		const testColumns: TableColumn[] = [
			{
				label: 'Home Page',
				name: 'home_page',
				component: 'ATextInput',
				align: 'left',
				edit: false,
				width: '35ch',
			},
			{
				label: 'HTTP Method',
				name: 'http_method',
				component: 'ATextInput',
				align: 'left',
				edit: true,
				width: '20ch',
			},
			{
				label: 'Report Date',
				name: 'report_date',
				component: 'ADate',
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
				columns: testColumns,
				config: { view: 'list' },
			},
		})

		const dataCells = wrapper.findAllComponents(ACell)
		expect(dataCells.length).toBe(testColumns.length * data.length)

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

	it('should handle gantt view with dependency graph disabled', () => {
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
				config: { view: 'gantt', dependencyGraph: false },
			},
		})

		// Should NOT render AGanttConnection component when dependency graph is disabled
		expect(wrapper.findComponent({ name: 'AGanttConnection' }).exists()).toBe(false)
		// Should still be a gantt view
		expect(wrapper.vm.store.isGanttView).toBe(true)
		// Should have dependency graph disabled
		expect(wrapper.vm.store.isDependencyGraphEnabled).toBe(false)
	})

	it('should handle tree-gantt view with dependency graph disabled', () => {
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
				config: { view: 'tree-gantt', dependencyGraph: false },
			},
		})

		// Should NOT render AGanttConnection component when dependency graph is disabled
		expect(wrapper.findComponent({ name: 'AGanttConnection' }).exists()).toBe(false)
		// Should still be a gantt view and tree view
		expect(wrapper.vm.store.isGanttView).toBe(true)
		expect(wrapper.vm.store.isTreeView).toBe(true)
		// Should have dependency graph disabled
		expect(wrapper.vm.store.isDependencyGraphEnabled).toBe(false)
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

	it('should emit row:click when a row is clicked', async () => {
		const rows = getBasicRows()
		const wrapper = mount(ATable, {
			props: {
				rows,
				columns: basicColumns,
			},
		})

		await nextTick()

		const tr = wrapper.find('tbody tr')
		await tr.trigger('click')

		expect(wrapper.emitted('row:click')).toBeTruthy()
		const event = wrapper.emitted('row:click')?.[0][0] as RowClickEvent
		expect(event.rowIndex).toBe(0)
		expect(event.row).toEqual(rows[0])
	})

	it('should add atable-row-clickable class when config.clickable is true', async () => {
		const wrapper = mount(ATable, {
			props: {
				rows: getBasicRows(),
				columns: basicColumns,
				config: { clickable: true },
			},
		})

		await nextTick()

		const tr = wrapper.find('tbody tr')
		expect(tr.classes()).toContain('atable-row-clickable')
	})

	it('should emit row:open when open row action is triggered', async () => {
		const rows = getBasicRows()
		const wrapper = mount(ATable, {
			props: {
				rows,
				columns: basicColumns,
				config: {
					rowActions: {
						enabled: true,
						actions: { open: true },
					},
				},
			},
		})

		await nextTick()

		// Trigger open action via store directly (simulate what ARowActions does)
		const tableStore = wrapper.vm.store
		// Manually invoke handleRowAction through the exposed store event mechanism
		tableStore.$onAction(() => {
			// no-op listener to ensure watchers fire
		})

		// Trigger via the row:action event on ARow
		const aRow = wrapper.findComponent(ARow)
		aRow.vm.$emit('row:action', 'open', 0, undefined)
		await nextTick()

		expect(wrapper.emitted('row:open')).toBeTruthy()
		const event = wrapper.emitted('row:open')?.[0][0] as RowClickEvent
		expect(event.rowIndex).toBe(0)
		expect(event.row).toEqual(rows[0])
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

	it('shows pagination footer when getRecords is provided', async () => {
		const getRecords = vi.fn().mockResolvedValue({
			data: [{ id: 1, name: 'John', status: 'active' }],
			hasMore: true,
		})

		const wrapper = mount(ATable, {
			props: {
				rows: getBasicRows(),
				columns: basicColumns,
				getRecords,
				sourceKey: 'people',
			},
		})

		await vi.waitFor(() => expect(getRecords).toHaveBeenCalledWith(undefined))
		expect(wrapper.find('.atable-pagination').exists()).toBe(true)
		expect(wrapper.find('.truncation-note').exists()).toBe(true)
	})

	it('does not show pagination footer without getRecords or pageSize', () => {
		const wrapper = mount(ATable, {
			props: {
				rows: getBasicRows(),
				columns: basicColumns,
			},
		})

		expect(wrapper.find('.atable-pagination').exists()).toBe(false)
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
				'onUpdate:columns': async (newColumns: TableColumn[] | undefined) => {
					if (newColumns) {
						await wrapper.setProps({ columns: newColumns })
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

	it('keeps the resolved columns when the columns model is cleared', async () => {
		// `columns` is a defineModel, so it is optional and a consumer can bind it to undefined.
		// The watcher spread it unguarded, throwing "newColumns is not iterable".
		const initialColumns: TableColumn[] = [
			{ name: 'id', label: 'ID', width: '100px' },
			{ name: 'name', label: 'Name', width: '200px' },
		]

		const wrapper = mount(ATable, {
			props: { rows: getBasicRows(), columns: initialColumns },
		})
		expect(wrapper.vm.store.columns).toEqual(initialColumns)

		await wrapper.setProps({ columns: undefined })

		// Nothing to sync from, so the store keeps what it already resolved.
		expect(wrapper.vm.store.columns).toEqual(initialColumns)
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

describe('Gantt View', { tags: ['component'] }, () => {
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

describe('Sorting and Filtering', { tags: ['component'] }, () => {
	beforeEach(() => {
		setActivePinia(createPinia())
	})

	describe('Sorting functionality', () => {
		it('should sort rows by column in ascending order', async () => {
			const sortableColumns: TableColumn[] = [
				{ name: 'id', label: 'ID', width: '100px', sortable: true },
				{ name: 'name', label: 'Name', width: '200px', sortable: true },
			]

			const rows: TableRow[] = [
				{ id: 3, name: 'Charlie' },
				{ id: 1, name: 'Alice' },
				{ id: 2, name: 'Bob' },
			]

			const wrapper = mount(ATable, {
				props: {
					rows,
					columns: sortableColumns,
				},
			})

			const store = wrapper.vm.store

			// Sort by ID column
			store.sortByColumn(0)
			await nextTick()

			expect(store.sortState.column).toBe(0)
			expect(store.sortState.direction).toBe('asc')
			expect(store.filteredRows[0].id).toBe(1)
			expect(store.filteredRows[1].id).toBe(2)
			expect(store.filteredRows[2].id).toBe(3)
		})

		it('should sort rows by column in descending order', async () => {
			const sortableColumns: TableColumn[] = [
				{ name: 'id', label: 'ID', width: '100px', sortable: true },
				{ name: 'name', label: 'Name', width: '200px', sortable: true },
			]

			const rows: TableRow[] = [
				{ id: 3, name: 'Charlie' },
				{ id: 1, name: 'Alice' },
				{ id: 2, name: 'Bob' },
			]

			const wrapper = mount(ATable, {
				props: {
					rows,
					columns: sortableColumns,
				},
			})

			const store = wrapper.vm.store

			// Sort ascending first, then descending
			store.sortByColumn(0)
			store.sortByColumn(0)
			await nextTick()

			expect(store.sortState.direction).toBe('desc')
			expect(store.filteredRows[0].id).toBe(3)
			expect(store.filteredRows[1].id).toBe(2)
			expect(store.filteredRows[2].id).toBe(1)
		})

		it('should toggle sort direction on multiple clicks', async () => {
			const sortableColumns: TableColumn[] = [{ name: 'id', label: 'ID', width: '100px', sortable: true }]

			const rows: TableRow[] = [
				{ id: 3, name: 'Charlie' },
				{ id: 1, name: 'Alice' },
			]

			const wrapper = mount(ATable, {
				props: {
					rows,
					columns: sortableColumns,
				},
			})

			const store = wrapper.vm.store

			// First click: asc
			store.sortByColumn(0)
			expect(store.sortState.direction).toBe('asc')

			// Second click: desc
			store.sortByColumn(0)
			expect(store.sortState.direction).toBe('desc')

			// Third click: back to asc
			store.sortByColumn(0)
			expect(store.sortState.direction).toBe('asc')
		})

		it('should reset sort when clicking different column', async () => {
			const sortableColumns: TableColumn[] = [
				{ name: 'id', label: 'ID', width: '100px', sortable: true },
				{ name: 'name', label: 'Name', width: '200px', sortable: true },
			]

			const rows: TableRow[] = [
				{ id: 3, name: 'Charlie' },
				{ id: 1, name: 'Alice' },
			]

			const wrapper = mount(ATable, {
				props: {
					rows,
					columns: sortableColumns,
				},
			})

			const store = wrapper.vm.store

			// Sort by first column
			store.sortByColumn(0)
			expect(store.sortState.column).toBe(0)
			expect(store.sortState.direction).toBe('asc')

			// Sort by second column should reset to asc
			store.sortByColumn(1)
			expect(store.sortState.column).toBe(1)
			expect(store.sortState.direction).toBe('asc')
		})
	})

	describe('Filtering functionality', () => {
		it('should filter text columns', async () => {
			const filterableColumns: TableColumn[] = [
				{ name: 'name', label: 'Name', width: '200px', filterable: true, filterType: 'text' },
				{ name: 'status', label: 'Status', width: '150px' },
			]

			const rows: TableRow[] = [
				{ id: 1, name: 'Alice', status: 'active' },
				{ id: 2, name: 'Bob', status: 'inactive' },
				{ id: 3, name: 'Charlie', status: 'active' },
			]

			const wrapper = mount(ATable, {
				props: {
					rows,
					columns: filterableColumns,
				},
			})

			const store = wrapper.vm.store

			// Filter by name
			store.setFilter(0, { value: 'ali' })
			await nextTick()

			expect(store.filteredRows.length).toBe(1)
			expect(store.filteredRows[0].name).toBe('Alice')
		})

		it('should filter number columns', async () => {
			const filterableColumns: TableColumn[] = [
				{ name: 'id', label: 'ID', width: '100px', filterable: true, filterType: 'number' },
				{ name: 'name', label: 'Name', width: '200px' },
			]

			const rows: TableRow[] = [
				{ id: 1, name: 'Alice' },
				{ id: 2, name: 'Bob' },
				{ id: 3, name: 'Charlie' },
			]

			const wrapper = mount(ATable, {
				props: {
					rows,
					columns: filterableColumns,
				},
			})

			const store = wrapper.vm.store

			// Filter by id
			store.setFilter(0, { value: '2' })
			await nextTick()

			expect(store.filteredRows.length).toBe(1)
			expect(store.filteredRows[0].id).toBe(2)
		})

		it('should filter select columns', async () => {
			const filterableColumns: TableColumn[] = [
				{ name: 'name', label: 'Name', width: '200px' },
				{ name: 'status', label: 'Status', width: '150px', filterable: true, filterType: 'select' },
			]

			const rows: TableRow[] = [
				{ id: 1, name: 'Alice', status: 'active' },
				{ id: 2, name: 'Bob', status: 'inactive' },
				{ id: 3, name: 'Charlie', status: 'active' },
			]

			const wrapper = mount(ATable, {
				props: {
					rows,
					columns: filterableColumns,
				},
			})

			const store = wrapper.vm.store

			// Filter by status
			store.setFilter(1, { value: 'active' })
			await nextTick()

			expect(store.filteredRows.length).toBe(2)
			expect(store.filteredRows[0].name).toBe('Alice')
			expect(store.filteredRows[1].name).toBe('Charlie')
		})

		it('should filter date columns', async () => {
			const filterableColumns: TableColumn[] = [
				{ name: 'name', label: 'Name', width: '200px' },
				{ name: 'date', label: 'Date', width: '150px', filterable: true, filterType: 'date' },
			]

			const rows: TableRow[] = [
				{ id: 1, name: 'Alice', date: '2024-01-15' },
				{ id: 2, name: 'Bob', date: '2024-02-20' },
				{ id: 3, name: 'Charlie', date: '2024-03-10' },
			]

			const wrapper = mount(ATable, {
				props: {
					rows,
					columns: filterableColumns,
				},
			})

			const store = wrapper.vm.store

			// Filter by date
			store.setFilter(1, { value: '2024-02-20' })
			await nextTick()

			expect(store.filteredRows.length).toBe(1)
			expect(store.filteredRows[0].name).toBe('Bob')
		})

		it('should filter dateRange columns', async () => {
			const filterableColumns: TableColumn[] = [
				{ name: 'name', label: 'Name', width: '200px' },
				{ name: 'date', label: 'Date', width: '150px', filterable: true, filterType: 'dateRange' },
			]

			const rows: TableRow[] = [
				{ id: 1, name: 'Alice', date: '2024-01-15' },
				{ id: 2, name: 'Bob', date: '2024-02-20' },
				{ id: 3, name: 'Charlie', date: '2024-03-10' },
			]

			const wrapper = mount(ATable, {
				props: {
					rows,
					columns: filterableColumns,
				},
			})

			const store = wrapper.vm.store

			// Filter by date range
			store.setFilter(1, { startValue: '2024-01-01', endValue: '2024-02-28' })
			await nextTick()

			expect(store.filteredRows.length).toBe(2)
			expect(store.filteredRows[0].name).toBe('Alice')
			expect(store.filteredRows[1].name).toBe('Bob')
		})

		it('should filter checkbox columns', async () => {
			const filterableColumns: TableColumn[] = [
				{ name: 'name', label: 'Name', width: '200px' },
				{ name: 'active', label: 'Active', width: '100px', filterable: true, filterType: 'checkbox' },
			]

			const rows: TableRow[] = [
				{ id: 1, name: 'Alice', active: true },
				{ id: 2, name: 'Bob', active: false },
				{ id: 3, name: 'Charlie', active: true },
			]

			const wrapper = mount(ATable, {
				props: {
					rows,
					columns: filterableColumns,
				},
			})

			const store = wrapper.vm.store

			// Filter by checkbox
			store.setFilter(1, { value: true })
			await nextTick()

			expect(store.filteredRows.length).toBe(2)
			expect(store.filteredRows[0].name).toBe('Alice')
			expect(store.filteredRows[1].name).toBe('Charlie')
		})

		it('should clear filter', async () => {
			const filterableColumns: TableColumn[] = [
				{ name: 'name', label: 'Name', width: '200px', filterable: true, filterType: 'text' },
			]

			const rows: TableRow[] = [
				{ id: 1, name: 'Alice' },
				{ id: 2, name: 'Bob' },
			]

			const wrapper = mount(ATable, {
				props: {
					rows,
					columns: filterableColumns,
				},
			})

			const store = wrapper.vm.store

			// Apply filter
			store.setFilter(0, { value: 'ali' })
			await nextTick()
			expect(store.filteredRows.length).toBe(1)

			// Clear filter
			store.clearFilter(0)
			await nextTick()
			expect(store.filteredRows.length).toBe(2)
		})

		it('should combine multiple filters', async () => {
			const filterableColumns: TableColumn[] = [
				{ name: 'name', label: 'Name', width: '200px', filterable: true, filterType: 'text' },
				{ name: 'status', label: 'Status', width: '150px', filterable: true, filterType: 'select' },
			]

			const rows: TableRow[] = [
				{ id: 1, name: 'Alice', status: 'active' },
				{ id: 2, name: 'Bob', status: 'inactive' },
				{ id: 3, name: 'Charlie', status: 'active' },
				{ id: 4, name: 'Anna', status: 'inactive' },
			]

			const wrapper = mount(ATable, {
				props: {
					rows,
					columns: filterableColumns,
				},
			})

			const store = wrapper.vm.store

			// Apply both filters
			store.setFilter(0, { value: 'a' }) // Names containing 'a'
			store.setFilter(1, { value: 'active' }) // Status = active
			await nextTick()

			expect(store.filteredRows.length).toBe(2)
			expect(store.filteredRows[0].name).toBe('Alice')
			expect(store.filteredRows[1].name).toBe('Charlie')
		})
	})

	describe('Combined sorting and filtering', () => {
		it('should filter first, then sort', async () => {
			const columns: TableColumn[] = [
				{ name: 'name', label: 'Name', width: '200px', filterable: true, filterType: 'text', sortable: true },
				{ name: 'status', label: 'Status', width: '150px', filterable: true, filterType: 'select' },
			]

			const rows: TableRow[] = [
				{ id: 1, name: 'Charlie', status: 'active' },
				{ id: 2, name: 'Alice', status: 'active' },
				{ id: 3, name: 'Bob', status: 'inactive' },
				{ id: 4, name: 'David', status: 'active' },
			]

			const wrapper = mount(ATable, {
				props: {
					rows,
					columns,
				},
			})

			const store = wrapper.vm.store

			// Filter by status first
			store.setFilter(1, { value: 'active' })
			await nextTick()

			// Then sort by name
			store.sortByColumn(0)
			await nextTick()

			expect(store.filteredRows.length).toBe(3)
			expect(store.filteredRows[0].name).toBe('Alice')
			expect(store.filteredRows[1].name).toBe('Charlie')
			expect(store.filteredRows[2].name).toBe('David')
		})

		it('should maintain sort when filter changes', async () => {
			const columns: TableColumn[] = [
				{ name: 'name', label: 'Name', width: '200px', filterable: true, filterType: 'text', sortable: true },
				{ name: 'age', label: 'Age', width: '100px', sortable: true },
			]

			const rows: TableRow[] = [
				{ id: 1, name: 'Charlie', age: 30 },
				{ id: 2, name: 'Alice', age: 25 },
				{ id: 3, name: 'Bob', age: 35 },
			]

			const wrapper = mount(ATable, {
				props: {
					rows,
					columns,
				},
			})

			const store = wrapper.vm.store

			// Sort by name first
			store.sortByColumn(0)
			await nextTick()

			expect(store.filteredRows[0].name).toBe('Alice')

			// Apply filter - sort should persist
			store.setFilter(0, { value: 'a' })
			await nextTick()

			expect(store.filteredRows.length).toBe(2)
			expect(store.filteredRows[0].name).toBe('Alice') // Still sorted
			expect(store.filteredRows[1].name).toBe('Charlie')
		})
	})
})

describe('Schema-driven columns', { tags: ['component'] }, () => {
	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('renders columns derived from schema when no columns prop is provided', () => {
		const schema: ColumnSchema[] = [
			{ fieldname: 'name', component: 'ATextInput', label: 'Name', width: '200px' },
			{ fieldname: 'status', component: 'ATextInput', label: 'Status', width: '150px' },
		]
		const wrapper = mount(ATable, {
			props: {
				rows: [{ name: 'Alice', status: 'active' }],
				schema,
				config: { view: 'list' },
			},
		})
		// schema has 2 fields → 2 data columns + 1 row-index column (list view)
		const headerCells = wrapper.findAll('th')
		expect(headerCells.length).toBe(schema.length + 1)
		expect(wrapper.vm.store.columns).toHaveLength(schema.length)
		expect(wrapper.vm.store.columns[0].name).toBe('name')
		expect(wrapper.vm.store.columns[1].name).toBe('status')
	})

	it('excludes hidden fields from derived columns', () => {
		const schema: ColumnSchema[] = [
			{ fieldname: 'name', component: 'ATextInput', label: 'Name' },
			{ fieldname: 'secret', component: 'ATextInput', label: 'Secret', hidden: true },
		]
		const wrapper = mount(ATable, {
			props: {
				rows: [{ name: 'Alice', secret: 'hidden' }],
				schema,
				config: { view: 'list' },
			},
		})
		// only 1 visible column + 1 row-index column (list view)
		const headerCells = wrapper.findAll('th')
		expect(headerCells.length).toBe(2)
		expect(wrapper.vm.store.columns).toHaveLength(1)
		expect(wrapper.vm.store.columns[0].name).toBe('name')
	})

	it('explicit columns prop takes precedence over schema when both are provided', () => {
		const schema: ColumnSchema[] = [{ fieldname: 'name', component: 'ATextInput', label: 'Name from Schema' }]
		const explicitColumns: TableColumn[] = [
			{ name: 'id', label: 'ID', width: '100px' },
			{ name: 'name', label: 'Name from Columns', width: '200px' },
		]
		const wrapper = mount(ATable, {
			props: {
				rows: [{ id: 1, name: 'Alice' }],
				columns: explicitColumns,
				schema,
			},
		})
		expect(wrapper.vm.store.columns).toEqual(explicitColumns)
		expect(wrapper.vm.store.columns).toHaveLength(2)
	})
})
