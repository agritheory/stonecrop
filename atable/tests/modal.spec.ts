import { config, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import data from './data/http_logs.json'
import ACell from '../src/components/ACell.vue'
import ARow from '../src/components/ARow.vue'
import ATable from '../src/components/ATable.vue'
import ATableModal from '../src/components/ATableModal.vue'
import { createTableStore } from '../src/stores/table'
import type { TableColumn, TableConfig } from '../src/types'

// Mock useElementBounding from VueUse
vi.mock('@vueuse/core', () => ({
	useElementBounding: vi.fn(() => ({
		width: { value: 200 },
		height: { value: 100 },
	})),
	useDebounceFn: vi.fn(fn => fn),
}))

describe('table modal component', { tags: ['component'] }, () => {
	config.global.components = { ACell, ARow }

	const columns: TableColumn[] = [
		{
			label: 'Home Page',
			name: 'home_page',
			fieldtype: 'Data',
			align: 'left',
			edit: false,
			width: '35ch',
			format: (value: { title: string }) => value.title,
		},
		{
			label: 'HTTP Method',
			name: 'http_method',
			fieldtype: 'Data',
			align: 'left',
			edit: true,
			width: '20ch',
		},
		{
			label: 'Report Date',
			name: 'report_date',
			fieldtype: 'Date',
			align: 'center',
			edit: true,
			width: '25ch',
			modalComponent: 'DateInput',
			format: (value: string | number) => new Date(value).toLocaleDateString('en-US'),
		},
	]

	const props = {
		rows: data,
		columns,
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

describe('ATableModal', { tags: ['component'] }, () => {
	let store: ReturnType<typeof createTableStore>

	beforeEach(() => {
		setActivePinia(createPinia())
		store = createTableStore({
			columns: [
				{ name: 'id', label: 'ID' },
				{ name: 'name', label: 'Name' },
			],
			rows: [{ id: 1, name: 'Test' }],
		})

		// Reset modal state
		store.modal = {
			cell: null,
			height: 0,
			width: 0,
			left: 0,
			bottom: 0,
		}
	})

	it('should render correctly with slot content', () => {
		const wrapper = mount(ATableModal, {
			props: { store },
			slots: {
				default: '<div>Modal Content</div>',
			},
		})

		expect(wrapper.find('.amodal')).toBeTruthy()
		expect(wrapper.html()).toContain('Modal Content')
		expect(wrapper.attributes('tabindex')).toBe('-1')
	})

	it('should render without styles when modal data is incomplete', () => {
		const wrapper = mount(ATableModal, {
			props: { store },
			slots: {
				default: '<div>Modal Content</div>',
			},
		})

		// Modal should render but without positioning styles
		expect(wrapper.find('.amodal').exists()).toBe(true)
		expect(wrapper.find('.amodal').attributes('style')).toBeFalsy()
	})

	it('should stop click and input event propagation', async () => {
		const wrapper = mount(ATableModal, {
			props: { store },
		})

		// Test click event stopping
		const clickEvent = new Event('click', { bubbles: true })
		const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation')

		wrapper.find('.amodal').element.dispatchEvent(clickEvent)
		expect(stopPropagationSpy).toHaveBeenCalled()

		// Test input event stopping
		const inputEvent = new Event('input', { bubbles: true })
		const inputStopSpy = vi.spyOn(inputEvent, 'stopPropagation')

		wrapper.find('.amodal').element.dispatchEvent(inputEvent)
		expect(inputStopSpy).toHaveBeenCalled()
	})

	it('should calculate modal position when all modal data is available', () => {
		// Create a mock cell element
		const mockCell = {
			offsetTop: 50,
			offsetLeft: 100,
			closest: vi.fn(() => ({
				offsetHeight: 500,
				offsetWidth: 800,
				querySelector: vi.fn(() => ({ offsetHeight: 30 })), // header height
			})),
		} as any

		// Set up modal data
		store.modal = {
			cell: mockCell,
			height: 40,
			width: 150,
			left: 100,
			bottom: 50,
		}

		const wrapper = mount(ATableModal, {
			props: { store },
		})

		const modalElement = wrapper.find('.amodal')
		const style = modalElement.attributes('style')

		// Should have positioning styles
		expect(style).toContain('left:')
		expect(style).toContain('top:')
	})

	it('should position modal correctly when it fits within table bounds', () => {
		const mockTable = {
			offsetHeight: 500,
			offsetWidth: 800,
			querySelector: vi.fn(() => ({ offsetHeight: 30 })), // header height
		}

		const mockCell = {
			offsetTop: 50,
			offsetLeft: 100,
			closest: vi.fn(() => mockTable),
		} as any

		store.modal = {
			cell: mockCell,
			height: 40,
			width: 150,
			left: 100,
			bottom: 50,
		}

		const wrapper = mount(ATableModal, {
			props: { store },
		})

		const modalElement = wrapper.find('.amodal')
		const style = modalElement.attributes('style')

		// Modal should be positioned at cell position + header height
		expect(style).toContain('left: 100px') // cell offsetLeft
		expect(style).toContain('top: 80px') // cell offsetTop + header height
	})

	it('should adjust modal position when it would overflow table bottom', () => {
		const mockTable = {
			offsetHeight: 200, // Small table height
			offsetWidth: 800,
			querySelector: vi.fn(() => ({ offsetHeight: 30 })),
		}

		const mockCell = {
			offsetTop: 150, // Near bottom of table
			offsetLeft: 100,
			closest: vi.fn(() => mockTable),
		} as any

		store.modal = {
			cell: mockCell,
			height: 40,
			width: 150,
			left: 100,
			bottom: 50,
		}

		const wrapper = mount(ATableModal, {
			props: { store },
		})

		const modalElement = wrapper.find('.amodal')
		const style = modalElement.attributes('style')

		// Modal Y should be adjusted to prevent overflow
		// modalY = 180 (cell + header) - (100 modal height + 40 cell height) = 40
		expect(style).toContain('top: 40px')
	})

	it('should adjust modal position when it would overflow table right', () => {
		const mockTable = {
			offsetHeight: 500,
			offsetWidth: 300, // Small table width
			querySelector: vi.fn(() => ({ offsetHeight: 30 })),
		}

		const mockCell = {
			offsetTop: 50,
			offsetLeft: 250, // Near right edge of table
			closest: vi.fn(() => mockTable),
		} as any

		store.modal = {
			cell: mockCell,
			height: 40,
			width: 150,
			left: 100,
			bottom: 50,
		}

		const wrapper = mount(ATableModal, {
			props: { store },
		})

		const modalElement = wrapper.find('.amodal')
		const style = modalElement.attributes('style')

		// Modal X should be adjusted to prevent overflow
		// modalX = 250 - (200 modal width - 150 cell width) = 200
		expect(style).toContain('left: 200px')
	})

	it('should handle missing header element gracefully', () => {
		const mockTable = {
			offsetHeight: 500,
			offsetWidth: 800,
			querySelector: vi.fn(() => null), // No header found
		}

		const mockCell = {
			offsetTop: 50,
			offsetLeft: 100,
			closest: vi.fn(() => mockTable),
		} as any

		store.modal = {
			cell: mockCell,
			height: 40,
			width: 150,
			left: 100,
			bottom: 50,
		}

		const wrapper = mount(ATableModal, {
			props: { store },
		})

		const modalElement = wrapper.find('.amodal')
		const style = modalElement.attributes('style')

		// Should use 0 for header height
		expect(style).toContain('top: 50px') // cell offsetTop + 0 header height
	})

	it('should have correct CSS classes and attributes', () => {
		const wrapper = mount(ATableModal, {
			props: { store },
		})

		const modalElement = wrapper.find('.amodal')
		expect(modalElement.classes()).toContain('amodal')
		expect(modalElement.attributes('tabindex')).toBe('-1')
	})

	it('should handle edge case with zero dimensions', () => {
		const mockTable = {
			offsetHeight: 0,
			offsetWidth: 0,
			querySelector: vi.fn(() => ({ offsetHeight: 0 })),
		}

		const mockCell = {
			offsetTop: 0,
			offsetLeft: 0,
			closest: vi.fn(() => mockTable),
		} as any

		store.modal = {
			cell: mockCell,
			height: 40,
			width: 150,
			left: 100,
			bottom: 50,
		}

		const wrapper = mount(ATableModal, {
			props: { store },
		})

		// Should not throw error and should render
		expect(wrapper.find('.amodal').exists()).toBe(true)
	})
})
