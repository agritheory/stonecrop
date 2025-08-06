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
		rows: data,
		columns,
		'onUpdate:rows': () => {},
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

		expect(wrapper.emitted('update:rows')).toBeTruthy()

		vi.useRealTimers()
	})

	it('should select all text content when cell is focused', async () => {
		// Mock the Selection API
		const mockSelection = {
			removeAllRanges: vi.fn(),
			addRange: vi.fn(),
		} as unknown as Selection
		const mockRange = {
			selectNodeContents: vi.fn(),
		} as unknown as Range

		const originalGetSelection = window.getSelection
		const originalCreateRange = document.createRange

		window.getSelection = vi.fn(() => mockSelection)
		document.createRange = vi.fn(() => mockRange)

		const wrapper = mount(ATable, { props, global: { components: { ACell } } })

		const dataCells = wrapper.findAllComponents(ACell)
		const editableCell = dataCells.at(1) // This is an editable cell
		expect(editableCell?.exists()).toBe(true)

		// Trigger focus on an editable cell
		await editableCell!.trigger('focus')

		// Verify that the Selection API was called to select all text
		expect(mockRange.selectNodeContents).toHaveBeenCalledWith(editableCell!.element)
		expect(mockSelection.removeAllRanges).toHaveBeenCalled()
		expect(mockSelection.addRange).toHaveBeenCalledWith(mockRange)

		// Restore original functions
		window.getSelection = originalGetSelection
		document.createRange = originalCreateRange
	})

	it('should select all text content when editable cell is clicked', async () => {
		// Mock the Selection API
		const mockSelection = {
			removeAllRanges: vi.fn(),
			addRange: vi.fn(),
		} as unknown as Selection
		const mockRange = {
			selectNodeContents: vi.fn(),
		} as unknown as Range

		const originalGetSelection = window.getSelection
		const originalCreateRange = document.createRange

		window.getSelection = vi.fn(() => mockSelection)
		document.createRange = vi.fn(() => mockRange)

		const wrapper = mount(ATable, { props, global: { components: { ACell } } })

		const dataCells = wrapper.findAllComponents(ACell)
		const editableCell = dataCells.at(1) // This is an editable cell
		expect(editableCell?.exists()).toBe(true)

		// Trigger click on an editable cell
		await editableCell!.trigger('click')

		// Verify that the Selection API was called to select all text
		expect(mockRange.selectNodeContents).toHaveBeenCalledWith(editableCell!.element)
		expect(mockSelection.removeAllRanges).toHaveBeenCalled()
		expect(mockSelection.addRange).toHaveBeenCalledWith(mockRange)

		// Restore original functions
		window.getSelection = originalGetSelection
		document.createRange = originalCreateRange
	})

	it('should preserve cursor position during debounced updates', async () => {
		vi.useFakeTimers()

		// Mock Selection API for cursor position testing
		const mockRange = {
			cloneRange: vi.fn(() => ({
				selectNodeContents: vi.fn(),
				setEnd: vi.fn(),
				toString: vi.fn(() => 'test text'),
			})),
			endContainer: {} as Node,
			endOffset: 5,
		}

		const mockSelection = {
			rangeCount: 1,
			getRangeAt: vi.fn(() => mockRange),
			removeAllRanges: vi.fn(),
			addRange: vi.fn(),
		}

		const mockTreeWalker = {
			nextNode: vi.fn().mockReturnValueOnce({ textContent: 'test text' }).mockReturnValue(null),
		}

		const originalGetSelection = window.getSelection
		const originalCreateRange = document.createRange
		const originalCreateTreeWalker = document.createTreeWalker

		window.getSelection = vi.fn(() => mockSelection)
		document.createRange = vi.fn(() => ({
			setStart: vi.fn(),
			setEnd: vi.fn(),
		}))
		document.createTreeWalker = vi.fn(() => mockTreeWalker)

		const wrapper = mount(ATable, { props, global: { components: { ACell } } })

		const dataCells = wrapper.findAllComponents(ACell)
		const editableCell = dataCells.at(1)
		expect(editableCell?.exists()).toBe(true)

		// Focus the cell and simulate typing
		await editableCell!.trigger('focus')
		editableCell!.element.textContent = 'new text'
		await editableCell!.trigger('input')

		// Fast-forward time to trigger debounced function
		vi.advanceTimersByTime(300)
		await wrapper.vm.$nextTick()

		// Verify that cursor position functions were called
		expect(mockSelection.getRangeAt).toHaveBeenCalled()
		expect(mockRange.cloneRange).toHaveBeenCalled()

		// Restore original functions
		window.getSelection = originalGetSelection
		document.createRange = originalCreateRange
		document.createTreeWalker = originalCreateTreeWalker

		vi.useRealTimers()
	})
})
