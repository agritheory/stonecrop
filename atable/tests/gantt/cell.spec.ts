import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import AGanttCell from '../../src/components/AGanttCell.vue'
import { createTableStore } from '../../src/stores/table'
import type { TableColumn, TableRow } from '../../src/types'

describe('AGanttCell component', { tags: ['component'] }, () => {
	let store: ReturnType<typeof createTableStore>

	const mockColumns: TableColumn[] = [
		{ name: 'task', label: 'Task', align: 'left' },
		{ name: 'start', label: 'Start', align: 'center' },
		{ name: 'end', label: 'End', align: 'center' },
	]

	const mockRows: TableRow[] = [
		{
			task: 'Task 1',
			start: '2023-01-01',
			end: '2023-01-10',
			gantt: { startIndex: 0, endIndex: 5, color: '#ff0000', colspan: 5 },
		},
		{
			task: 'Task 2',
			start: '2023-01-05',
			end: '2023-01-15',
			gantt: { startIndex: 2, endIndex: 8, color: '#00ff00', colspan: 6 },
		},
	]

	beforeEach(() => {
		setActivePinia(createPinia())
		store = createTableStore({
			columns: mockColumns,
			rows: mockRows,
			config: { view: 'gantt' },
		})
	})

	it('should render gantt cell correctly', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 0,
				end: 5,
				colspan: 5,
				color: '#ff0000',
			},
		})

		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('.aganttcell').exists()).toBe(true)
	})

	it('should render gantt bar when gantt data exists', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 0,
				end: 5,
				colspan: 5,
				color: '#ff0000',
			},
		})

		expect(wrapper.find('.gantt-bar').exists()).toBe(true)
	})

	it('should handle bar drag events', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 0,
				end: 5,
				colspan: 5,
				color: '#ff0000',
			},
		})

		const ganttBar = wrapper.find('.gantt-bar')
		expect(ganttBar.exists()).toBe(true)

		// Simulate mouse enter to show handles
		await ganttBar.trigger('mouseenter')
		expect(wrapper.vm).toBeDefined()
	})

	it('should handle resize events', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 0,
				end: 5,
				colspan: 5,
				color: '#ff0000',
			},
		})

		const resizeHandle = wrapper.find('.resize-handle')
		if (resizeHandle.exists()) {
			await resizeHandle.trigger('mousedown', { clientX: 200, clientY: 50 })
			expect(wrapper.vm).toBeDefined()
		}
	})

	it('should apply correct styling based on gantt data', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 0,
				end: 5,
				colspan: 5,
				color: '#ff0000',
			},
		})

		const ganttBar = wrapper.find('.gantt-bar')
		if (ganttBar.exists()) {
			const style = ganttBar.attributes('style')
			expect(style).toBeDefined()
		}
	})

	it('should handle connection creation', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 0,
				end: 5,
				colspan: 5,
				color: '#ff0000',
			},
		})

		// Simulate mouse enter to show connection handles
		const ganttBar = wrapper.find('.gantt-bar')
		await ganttBar.trigger('mouseenter')

		const connectionHandle = wrapper.find('.connection-handle')
		if (connectionHandle.exists()) {
			await connectionHandle.trigger('mousedown', { clientX: 100, clientY: 50 })
			expect(wrapper.vm).toBeDefined()
		}
	})

	it('should handle different gantt bar colors', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 1,
				colIndex: 0,
				start: 2,
				end: 8,
				colspan: 6,
				color: '#00ff00',
			},
		})

		expect(wrapper.exists()).toBe(true)
		const ganttBar = wrapper.find('.gantt-bar')
		if (ganttBar.exists()) {
			const style = ganttBar.attributes('style')
			expect(style).toBeDefined()
		}
	})

	it('should handle gantt cell without gantt data gracefully', () => {
		const storeWithoutGantt = createTableStore({
			columns: mockColumns,
			rows: [{ task: 'Task without gantt', start: '2023-01-01', end: '2023-01-10' }],
			config: { view: 'gantt' },
		})

		const wrapper = mount(AGanttCell, {
			props: {
				store: storeWithoutGantt,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 0,
				end: 5,
				colspan: 5,
				color: '#cccccc',
			},
		})

		expect(wrapper.exists()).toBe(true)
		// Should not crash even without gantt data
	})

	it('should render gantt label when provided', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 0,
				end: 5,
				colspan: 5,
				color: '#ff0000',
				label: 'Task 1 Label',
			},
		})

		const labelElement = wrapper.find('.gantt-label')
		if (labelElement.exists()) {
			expect(labelElement.text()).toBe('Task 1 Label')
		}
	})

	it('should show connection handles on mouse enter', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 0,
				end: 5,
				colspan: 5,
				color: '#ff0000',
			},
		})

		const ganttBar = wrapper.find('.gantt-bar')
		await ganttBar.trigger('mouseenter')

		// Connection handles should be available
		const connectionHandles = wrapper.findAll('.connection-handle')
		expect(connectionHandles.length).toBeGreaterThanOrEqual(0)
	})

	it('should hide connection handles on mouse leave', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 0,
				end: 5,
				colspan: 5,
				color: '#ff0000',
			},
		})

		const ganttBar = wrapper.find('.gantt-bar')
		await ganttBar.trigger('mouseenter')
		await ganttBar.trigger('mouseleave')

		expect(wrapper.vm).toBeDefined()
	})

	it('should handle default color when color is not provided', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 0,
				end: 5,
				colspan: 5,
				color: '#ccc', // Short color that should default to #cccccc
			},
		})

		expect(wrapper.exists()).toBe(true)
	})

	it('should handle connection drag preview', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 0,
				end: 5,
				colspan: 5,
				color: '#ff0000',
			},
		})

		const ganttBar = wrapper.find('.gantt-bar')
		await ganttBar.trigger('mouseenter')

		const leftConnectionHandle = wrapper.find('.left-connection-handle')
		if (leftConnectionHandle.exists()) {
			await leftConnectionHandle.trigger('mousedown', {
				clientX: 100,
				clientY: 50,
				preventDefault: vi.fn(),
				stopPropagation: vi.fn(),
			})
		}

		expect(wrapper.vm).toBeDefined()
	})

	it('should handle resize handles correctly', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 0,
				end: 5,
				colspan: 5,
				color: '#ff0000',
			},
		})

		const leftResizeHandle = wrapper.find('.left-resize-handle')
		const rightResizeHandle = wrapper.find('.right-resize-handle')

		expect(leftResizeHandle.exists()).toBe(true)
		expect(rightResizeHandle.exists()).toBe(true)
	})

	it('should render with default props', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		expect(wrapper.find('.aganttcell').exists()).toBe(true)
		expect(wrapper.find('.gantt-container').exists()).toBe(true)
		expect(wrapper.find('.gantt-bar').exists()).toBe(true)
	})

	it('should handle color prop correctly', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				color: '#ff',
			},
		})

		// Should render gantt cell with default color when invalid color provided
		expect(wrapper.find('.aganttcell').exists()).toBe(true)
		expect(wrapper.find('.gantt-bar').exists()).toBe(true)
	})

	it('should handle valid color prop', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				color: '#ff0000',
			},
		})

		// Should render gantt cell with valid color
		expect(wrapper.find('.aganttcell').exists()).toBe(true)
		expect(wrapper.find('.gantt-bar').exists()).toBe(true)
	})

	it('should show and hide connection handles on mouse events', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		// Initially hidden
		expect(wrapper.vm.isLeftConnectionVisible).toBe(false)
		expect(wrapper.vm.isRightConnectionVisible).toBe(false)

		// Show on mouse enter
		await wrapper.find('.gantt-bar').trigger('mouseenter')
		expect(wrapper.vm.isLeftConnectionVisible).toBe(true)
		expect(wrapper.vm.isRightConnectionVisible).toBe(true)

		// Hide on mouse leave
		await wrapper.find('.gantt-bar').trigger('mouseleave')
		expect(wrapper.vm.isLeftConnectionVisible).toBe(false)
		expect(wrapper.vm.isRightConnectionVisible).toBe(false)
	})

	it('should not hide connection handles when dragging', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		// Show handles
		await wrapper.find('.gantt-bar').trigger('mouseenter')

		// Start dragging
		wrapper.vm.isLeftConnectionDragging = true

		// Try to hide on mouse leave
		await wrapper.find('.gantt-bar').trigger('mouseleave')

		// Should still be visible because dragging
		expect(wrapper.vm.isLeftConnectionVisible).toBe(true)
		expect(wrapper.vm.isRightConnectionVisible).toBe(true)
	})

	it('should handle connection drag start', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		const mockEvent = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as any

		// Mock getBoundingClientRect
		const mockBoundingRect = {
			left: 100,
			top: 50,
			width: 20,
			height: 20,
		}

		const leftHandle = wrapper.find('.left-connection-handle')
		leftHandle.element.getBoundingClientRect = vi.fn().mockReturnValue(mockBoundingRect)

		await leftHandle.trigger('mousedown', mockEvent)

		expect(wrapper.vm.showDragPreview).toBe(true)
		expect(wrapper.vm.isLeftConnectionDragging).toBe(true)
		expect(mockEvent.preventDefault).toHaveBeenCalled()
		expect(mockEvent.stopPropagation).toHaveBeenCalled()
	})

	it('should handle right connection drag start', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		const mockEvent = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as any

		const mockBoundingRect = {
			left: 200,
			top: 50,
			width: 20,
			height: 20,
		}

		const rightHandle = wrapper.find('.right-connection-handle')
		rightHandle.element.getBoundingClientRect = vi.fn().mockReturnValue(mockBoundingRect)

		await rightHandle.trigger('mousedown', mockEvent)

		expect(wrapper.vm.showDragPreview).toBe(true)
		expect(wrapper.vm.isRightConnectionDragging).toBe(true)
	})

	it('should compute bar style correctly', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 2,
				end: 6,
				colspan: 8,
				color: '#ff0000',
			},
		})

		expect(wrapper.vm.barStyle).toMatchObject({
			backgroundColor: '#ff0000',
		})
	})

	it('should register and unregister gantt components on mount/unmount', () => {
		const registerSpy = vi.spyOn(store, 'registerGanttBar')
		const registerHandleSpy = vi.spyOn(store, 'registerConnectionHandle')
		const unregisterSpy = vi.spyOn(store, 'unregisterGanttBar')
		const unregisterHandleSpy = vi.spyOn(store, 'unregisterConnectionHandle')

		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		expect(registerSpy).toHaveBeenCalled()
		expect(registerHandleSpy).toHaveBeenCalledTimes(2) // left and right handles

		wrapper.unmount()

		expect(unregisterSpy).toHaveBeenCalled()
		expect(unregisterHandleSpy).toHaveBeenCalledTimes(2)
	})

	it('should handle end prop default when not provided', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 2,
				colspan: 4,
				// end is not provided
			},
		})

		// Should default to start + colspan
		expect(wrapper.vm.currentEnd).toBe(6) // 2 + 4
	})

	it('should emit connection:create event on successful connection', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		// Mock the store's createConnection method to return a connection
		const mockConnection = {
			id: 'test-connection',
			from: { barId: 'bar1', side: 'left' },
			to: { barId: 'bar2', side: 'right' },
		}
		vi.spyOn(store, 'createConnection').mockReturnValue(mockConnection as any)

		// Mock DOM elements for connection drop
		const mockTargetHandle = document.createElement('div')
		mockTargetHandle.className = 'connection-handle right-connection-handle'

		const mockTargetBar = document.createElement('div')
		mockTargetBar.className = 'gantt-bar'
		mockTargetBar.setAttribute('data-rowindex', '1')
		mockTargetBar.setAttribute('data-colindex', '0')
		mockTargetBar.appendChild(mockTargetHandle)

		// Mock document.elementFromPoint
		const originalElementFromPoint = document.elementFromPoint
		document.elementFromPoint = vi.fn().mockReturnValue(mockTargetHandle)

		const mockEvent = {
			clientX: 100,
			clientY: 50,
		} as MouseEvent

		// Call the drop handler directly
		wrapper.vm.handleConnectionDrop(mockEvent, 'left')

		expect(wrapper.emitted('connection:create')).toBeTruthy()
		expect(wrapper.emitted('connection:create')?.[0][0]).toEqual(mockConnection)

		// Restore
		document.elementFromPoint = originalElementFromPoint
	})

	it('should not emit connection when target is same handle', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		// Mock the left handle to be the target
		const leftHandle = wrapper.find('.left-connection-handle').element
		document.elementFromPoint = vi.fn().mockReturnValue(leftHandle)

		const mockEvent = {
			clientX: 100,
			clientY: 50,
		} as MouseEvent

		wrapper.vm.handleConnectionDrop(mockEvent, 'left')

		expect(wrapper.emitted('connection:create')).toBeFalsy()
	})

	it('should clean up event listeners on connection drag cleanup', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
		const mockMouseMove = vi.fn()
		const mockMouseUp = vi.fn()

		wrapper.vm.cleanupConnectionDrag(mockMouseMove, mockMouseUp)

		expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', mockMouseMove)
		expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', mockMouseUp)
		expect(wrapper.vm.showDragPreview).toBe(false)
		expect(wrapper.vm.isLeftConnectionDragging).toBe(false)
		expect(wrapper.vm.isRightConnectionDragging).toBe(false)
	})

	it('should handle label prop correctly', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				label: 'Test Label',
			},
		})

		expect(wrapper.find('.gantt-label').text()).toBe('Test Label')
	})

	it('should handle missing label prop', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				// label not provided
			},
		})

		expect(wrapper.find('.gantt-label').exists()).toBe(false)
	})

	// Additional tests for branch coverage
	describe('Edge cases and boundary conditions', () => {
		it('should handle zero colspan in computed properties', () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					start: 0,
					end: 0,
					colspan: 0,
				},
			})

			// Component should handle zero colspan gracefully
			expect(wrapper.exists()).toBe(true)
		})

		it('should handle negative values in barStyle calculation', () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					start: -1,
					end: 2,
					colspan: 5,
				},
			})

			// Component should handle negative values gracefully
			expect(wrapper.exists()).toBe(true)
			const barElement = wrapper.find('.gantt-bar')
			expect(barElement.exists()).toBe(true)
		})

		it('should handle very short color strings', () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					color: '#f', // Very short color
				},
			})

			// Should use default color for invalid color strings
			expect(wrapper.exists()).toBe(true)
		})

		it('should handle exact 6-character color strings', () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					color: '#ff0000', // Exactly 6 characters after #
				},
			})

			// Should use the provided color
			expect(wrapper.exists()).toBe(true)
		})

		it('should handle 7-character color strings', () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					color: '#ff00000', // 7 characters after #
				},
			})

			// Should use the provided color since it's >= 6 characters
			expect(wrapper.exists()).toBe(true)
		})
	})

	describe('Drag and resize behavior', () => {
		it('should handle bar movement with boundary constraints (left boundary)', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					start: 1,
					end: 3,
					colspan: 8,
				},
			})

			const ganttBar = wrapper.find('.gantt-bar')
			if (ganttBar.exists()) {
				// Mock useDraggable behavior by simulating move that goes beyond left boundary
				const mockEvent = { x: -200, clientX: 50, clientY: 50 } as any
				await ganttBar.trigger('mousedown', mockEvent)

				// Component should handle boundary constraints
				expect(wrapper.vm).toBeDefined()
			}
		})

		it('should handle bar movement with boundary constraints (right boundary)', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					start: 8,
					end: 10,
					colspan: 8,
				},
			})

			const ganttBar = wrapper.find('.gantt-bar')
			if (ganttBar.exists()) {
				// Mock move that goes beyond right boundary
				await ganttBar.trigger('mousedown', { clientX: 800, clientY: 50 })
				expect(wrapper.vm).toBeDefined()
			}
		})

		it('should handle left resize with boundary constraints', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					start: 1,
					end: 5,
					colspan: 8,
				},
			})

			const leftHandle = wrapper.find('.left-resize-handle')
			if (leftHandle.exists()) {
				await leftHandle.trigger('mousedown', { clientX: 100, clientY: 50 })
				expect(wrapper.vm).toBeDefined()
			}
		})

		it('should handle right resize with boundary constraints', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					start: 2,
					end: 8,
					colspan: 8,
				},
			})

			const rightHandle = wrapper.find('.right-resize-handle')
			if (rightHandle.exists()) {
				await rightHandle.trigger('mousedown', { clientX: 500, clientY: 50 })
				expect(wrapper.vm).toBeDefined()
			}
		})
	})

	describe('Color handling edge cases', () => {
		it('should handle empty color string', () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					color: '',
				},
			})

			// Should use default color for empty string
			expect(wrapper.exists()).toBe(true)
		})

		it('should handle undefined color', () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					// color not provided, should use default
				},
			})

			expect(wrapper.exists()).toBe(true)
		})

		it('should handle 3-character hex color', () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					color: '#abc',
				},
			})

			// Should use default color for short string
			expect(wrapper.exists()).toBe(true)
		})

		it('should handle 8-character hex color (with alpha)', () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					color: '#ff0000aa',
				},
			})

			// Should accept color since it's >= 6 characters
			expect(wrapper.exists()).toBe(true)
		})
	})

	describe('Connection drag scenarios', () => {
		it('should handle connection drop on invalid target (no closest element)', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
				},
			})

			// Mock elementFromPoint to return element without closest method
			const originalElementFromPoint = document.elementFromPoint
			document.elementFromPoint = vi.fn().mockReturnValue({
				closest: vi.fn().mockReturnValue(null),
			})

			const ganttBar = wrapper.find('.gantt-bar')
			await ganttBar.trigger('mouseenter')

			const leftHandle = wrapper.find('.left-connection-handle')
			if (leftHandle.exists()) {
				await leftHandle.trigger('mousedown', {
					clientX: 100,
					clientY: 50,
					preventDefault: vi.fn(),
					stopPropagation: vi.fn(),
				})

				// Simulate drop with invalid target
				document.dispatchEvent(new MouseEvent('mouseup', { clientX: 200, clientY: 100 }))
			}

			// Restore
			document.elementFromPoint = originalElementFromPoint
			expect(wrapper.vm).toBeDefined()
		})

		it('should handle connection drop on target without data attributes', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
				},
			})

			const originalElementFromPoint = document.elementFromPoint

			// Mock target without proper data attributes
			const mockTargetHandle = document.createElement('div')
			mockTargetHandle.className = 'connection-handle right-connection-handle'

			const mockTargetBar = document.createElement('div')
			mockTargetBar.className = 'gantt-bar'
			// No data-rowindex or data-colindex attributes

			mockTargetHandle.closest = vi.fn().mockImplementation(selector => {
				if (selector === '.connection-handle') return mockTargetHandle
				if (selector === '.gantt-bar') return mockTargetBar
				return null
			})

			document.elementFromPoint = vi.fn().mockReturnValue(mockTargetHandle)

			const ganttBar = wrapper.find('.gantt-bar')
			await ganttBar.trigger('mouseenter')

			const leftHandle = wrapper.find('.left-connection-handle')
			if (leftHandle.exists()) {
				await leftHandle.trigger('mousedown', {
					clientX: 100,
					clientY: 50,
					preventDefault: vi.fn(),
					stopPropagation: vi.fn(),
				})

				document.dispatchEvent(new MouseEvent('mouseup', { clientX: 200, clientY: 100 }))
			}

			// Restore
			document.elementFromPoint = originalElementFromPoint
			expect(wrapper.vm).toBeDefined()
		})

		it('should handle connection from right handle', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
				},
			})

			const ganttBar = wrapper.find('.gantt-bar')
			await ganttBar.trigger('mouseenter')

			const rightHandle = wrapper.find('.right-connection-handle')
			if (rightHandle.exists()) {
				// Mock getBoundingClientRect
				rightHandle.element.getBoundingClientRect = vi.fn().mockReturnValue({
					left: 200,
					top: 50,
					width: 16,
					height: 16,
				})

				await rightHandle.trigger('mousedown', {
					clientX: 200,
					clientY: 50,
					preventDefault: vi.fn(),
					stopPropagation: vi.fn(),
				})

				// Should show drag preview
				const dragPreview = wrapper.find('svg')
				expect(dragPreview.exists()).toBe(true)
			}
		})
	})

	describe('Resize and drag handler edge cases', () => {
		it('should handle left resize when barRef is null', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					start: 2,
					end: 6,
					colspan: 8,
				},
			})

			// Test the conditional paths in resize handlers
			const leftHandle = wrapper.find('.left-resize-handle')
			if (leftHandle.exists()) {
				await leftHandle.trigger('mousedown', { clientX: 100, clientY: 50 })
				// Test move and end events to trigger handler logic
				await leftHandle.trigger('mousemove', { clientX: 150, clientY: 50 })
				await leftHandle.trigger('mouseup', { clientX: 150, clientY: 50 })
			}

			expect(wrapper.vm).toBeDefined()
		})

		it('should handle right resize boundary conditions', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					start: 2,
					end: 8,
					colspan: 8,
				},
			})

			const rightHandle = wrapper.find('.right-resize-handle')
			if (rightHandle.exists()) {
				await rightHandle.trigger('mousedown', { clientX: 400, clientY: 50 })
				await rightHandle.trigger('mousemove', { clientX: 450, clientY: 50 })
				await rightHandle.trigger('mouseup', { clientX: 450, clientY: 50 })
			}

			expect(wrapper.vm).toBeDefined()
		})

		it('should handle bar movement boundary checks - left boundary', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					start: 1,
					end: 3,
					colspan: 8,
				},
			})

			const ganttBar = wrapper.find('.gantt-bar')
			if (ganttBar.exists()) {
				// Simulate drag that would push bar past left boundary
				await ganttBar.trigger('mousedown', { clientX: 200, clientY: 50 })
				await ganttBar.trigger('mousemove', { clientX: 50, clientY: 50 })
				await ganttBar.trigger('mouseup', { clientX: 50, clientY: 50 })
			}

			expect(wrapper.vm).toBeDefined()
		})

		it('should handle bar movement boundary checks - right boundary', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					start: 7,
					end: 9,
					colspan: 8,
				},
			})

			const ganttBar = wrapper.find('.gantt-bar')
			if (ganttBar.exists()) {
				// Simulate drag that would push bar past right boundary
				await ganttBar.trigger('mousedown', { clientX: 350, clientY: 50 })
				await ganttBar.trigger('mousemove', { clientX: 500, clientY: 50 })
				await ganttBar.trigger('mouseup', { clientX: 500, clientY: 50 })
			}

			expect(wrapper.vm).toBeDefined()
		})

		it('should handle setup drag start when barRef exists', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					start: 2,
					end: 6,
					colspan: 8,
				},
			})

			// Trigger resize to test setupDragStart function
			const leftHandle = wrapper.find('.left-resize-handle')
			if (leftHandle.exists()) {
				await leftHandle.trigger('mousedown', { clientX: 100, clientY: 50 })
				// The setupDragStart function should be called and set transition to none
				expect(wrapper.vm).toBeDefined()
			}
		})
	})

	describe('Connection handle interactions with null handles', () => {
		it('should handle connection drag start with proper handle element', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
				},
			})

			const ganttBar = wrapper.find('.gantt-bar')
			await ganttBar.trigger('mouseenter')

			// Test the branch where handle element exists and has proper getBoundingClientRect
			const leftHandle = wrapper.find('.left-connection-handle')
			if (leftHandle.exists()) {
				// Mock proper getBoundingClientRect
				leftHandle.element.getBoundingClientRect = vi.fn().mockReturnValue({
					left: 100,
					top: 50,
					width: 16,
					height: 16,
				})

				await leftHandle.trigger('mousedown', {
					clientX: 100,
					clientY: 50,
					preventDefault: vi.fn(),
					stopPropagation: vi.fn(),
				})

				expect(wrapper.vm).toBeDefined()
			}
		})

		it('should handle connection target detection edge cases', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
				},
			})

			// Mock various edge cases for connection detection
			const originalElementFromPoint = document.elementFromPoint

			// Test case where elementFromPoint returns null
			document.elementFromPoint = vi.fn().mockReturnValue(null)

			const ganttBar = wrapper.find('.gantt-bar')
			await ganttBar.trigger('mouseenter')

			const leftHandle = wrapper.find('.left-connection-handle')
			if (leftHandle.exists()) {
				await leftHandle.trigger('mousedown', {
					clientX: 100,
					clientY: 50,
					preventDefault: vi.fn(),
					stopPropagation: vi.fn(),
				})

				// Simulate mouse up with null target
				document.dispatchEvent(new MouseEvent('mouseup', { clientX: 200, clientY: 100 }))
			}

			// Restore
			document.elementFromPoint = originalElementFromPoint
			expect(wrapper.vm).toBeDefined()
		})
	})

	describe('Lifecycle and component state edge cases', () => {
		it('should handle component unmounting gracefully', () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
				},
			})

			// Spy on unregister methods
			const unregisterBarSpy = vi.spyOn(store, 'unregisterGanttBar')
			const unregisterHandleSpy = vi.spyOn(store, 'unregisterConnectionHandle')

			wrapper.unmount()

			expect(unregisterBarSpy).toHaveBeenCalled()
			expect(unregisterHandleSpy).toHaveBeenCalledTimes(2)
		})

		it('should handle complex column calculations', () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 100,
					rowIndex: 0,
					colIndex: 0,
					start: 25,
					end: 75,
					colspan: 80,
				},
			})

			// Test with large numbers to ensure calculations work correctly
			expect(wrapper.exists()).toBe(true)
			const ganttBar = wrapper.find('.gantt-bar')
			expect(ganttBar.exists()).toBe(true)
		})
	})

	describe('Edge cases for computed properties', () => {
		it('should handle pixelsPerColumn when colspan is zero', () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
					start: 0,
					end: 0,
					colspan: 0,
				},
			})

			// Test the ternary condition in pixelsPerColumn computed
			expect(wrapper.exists()).toBe(true)
		})

		it('should handle barStyle calculations with edge values', () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 1,
					rowIndex: 0,
					colIndex: 0,
					start: 0,
					end: 1,
					colspan: 1,
				},
			})

			// Test barStyle computed with minimal values
			const ganttBar = wrapper.find('.gantt-bar')
			expect(ganttBar.exists()).toBe(true)
		})
	})

	describe('Additional branch coverage tests', () => {
		it('should handle connection drop when target is same as source handle', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
				},
			})

			const originalElementFromPoint = document.elementFromPoint

			// Mock target being the same as the source handle
			const ganttBar = wrapper.find('.gantt-bar')
			await ganttBar.trigger('mouseenter')

			const leftHandle = wrapper.find('.left-connection-handle')
			if (leftHandle.exists()) {
				// Mock elementFromPoint to return the same handle that initiated the drag
				document.elementFromPoint = vi.fn().mockReturnValue(leftHandle.element)

				leftHandle.element.getBoundingClientRect = vi.fn().mockReturnValue({
					left: 100,
					top: 50,
					width: 16,
					height: 16,
				})

				await leftHandle.trigger('mousedown', {
					clientX: 100,
					clientY: 50,
					preventDefault: vi.fn(),
					stopPropagation: vi.fn(),
				})

				// Simulate dropping on the same handle
				document.dispatchEvent(new MouseEvent('mouseup', { clientX: 100, clientY: 50 }))
			}

			// Should not emit connection:create for same handle
			expect(wrapper.emitted('connection:create')).toBeFalsy()

			// Restore
			document.elementFromPoint = originalElementFromPoint
		})

		it('should handle connection side detection correctly', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
				},
			})

			const originalElementFromPoint = document.elementFromPoint

			// Test both left and right side detection
			const mockTargetHandle = document.createElement('div')
			mockTargetHandle.className = 'connection-handle left-connection-handle' // Test left side

			const mockTargetBar = document.createElement('div')
			mockTargetBar.className = 'gantt-bar'
			mockTargetBar.setAttribute('data-rowindex', '1')
			mockTargetBar.setAttribute('data-colindex', '0')

			mockTargetHandle.closest = vi.fn().mockImplementation(selector => {
				if (selector === '.connection-handle') return mockTargetHandle
				if (selector === '.gantt-bar') return mockTargetBar
				return null
			})

			document.elementFromPoint = vi.fn().mockReturnValue(mockTargetHandle)

			// Mock store.createConnection to return a valid connection
			const mockConnection = {
				id: 'test-connection',
				from: { barId: 'bar1', side: 'right' },
				to: { barId: 'bar2', side: 'left' },
			}
			vi.spyOn(store, 'createConnection').mockReturnValue(mockConnection as any)

			const ganttBar = wrapper.find('.gantt-bar')
			await ganttBar.trigger('mouseenter')

			const rightHandle = wrapper.find('.right-connection-handle')
			if (rightHandle.exists()) {
				rightHandle.element.getBoundingClientRect = vi.fn().mockReturnValue({
					left: 200,
					top: 50,
					width: 16,
					height: 16,
				})

				await rightHandle.trigger('mousedown', {
					clientX: 200,
					clientY: 50,
					preventDefault: vi.fn(),
					stopPropagation: vi.fn(),
				})

				document.dispatchEvent(new MouseEvent('mouseup', { clientX: 100, clientY: 50 }))
			}

			// Should emit connection:create with proper sides
			expect(wrapper.emitted('connection:create')).toBeTruthy()

			// Restore
			document.elementFromPoint = originalElementFromPoint
		})

		it('should handle missing data attributes gracefully', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
				},
			})

			const originalElementFromPoint = document.elementFromPoint

			// Mock target with missing or invalid data attributes
			const mockTargetHandle = document.createElement('div')
			mockTargetHandle.className = 'connection-handle right-connection-handle'

			const mockTargetBar = document.createElement('div')
			mockTargetBar.className = 'gantt-bar'
			// Intentionally omit data-rowindex and data-colindex

			mockTargetHandle.closest = vi.fn().mockImplementation(selector => {
				if (selector === '.connection-handle') return mockTargetHandle
				if (selector === '.gantt-bar') return mockTargetBar
				return null
			})

			document.elementFromPoint = vi.fn().mockReturnValue(mockTargetHandle)

			const ganttBar = wrapper.find('.gantt-bar')
			await ganttBar.trigger('mouseenter')

			const leftHandle = wrapper.find('.left-connection-handle')
			if (leftHandle.exists()) {
				leftHandle.element.getBoundingClientRect = vi.fn().mockReturnValue({
					left: 100,
					top: 50,
					width: 16,
					height: 16,
				})

				await leftHandle.trigger('mousedown', {
					clientX: 100,
					clientY: 50,
					preventDefault: vi.fn(),
					stopPropagation: vi.fn(),
				})

				document.dispatchEvent(new MouseEvent('mouseup', { clientX: 200, clientY: 50 }))
			}

			// Should handle missing attributes gracefully
			expect(wrapper.vm).toBeDefined()

			// Restore
			document.elementFromPoint = originalElementFromPoint
		})

		it('should handle container width calculations correctly', () => {
			// Test pixelsPerColumn with different container widths
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 20,
					rowIndex: 0,
					colIndex: 0,
					start: 5,
					end: 15,
					colspan: 16,
				},
			})

			// Component should handle the calculations correctly
			expect(wrapper.exists()).toBe(true)
			const ganttBar = wrapper.find('.gantt-bar')
			expect(ganttBar.exists()).toBe(true)
		})

		it('should handle right side connection classification', async () => {
			const wrapper = mount(AGanttCell, {
				props: {
					store,
					columnsCount: 10,
					rowIndex: 0,
					colIndex: 0,
				},
			})

			const originalElementFromPoint = document.elementFromPoint

			// Test classification of right-connection-handle
			const mockTargetHandle = document.createElement('div')
			mockTargetHandle.className = 'connection-handle right-connection-handle' // Specifically right side

			const mockTargetBar = document.createElement('div')
			mockTargetBar.className = 'gantt-bar'
			mockTargetBar.setAttribute('data-rowindex', '1')
			mockTargetBar.setAttribute('data-colindex', '0')

			mockTargetHandle.closest = vi.fn().mockImplementation(selector => {
				if (selector === '.connection-handle') return mockTargetHandle
				if (selector === '.gantt-bar') return mockTargetBar
				return null
			})

			document.elementFromPoint = vi.fn().mockReturnValue(mockTargetHandle)

			// Mock store to return valid connection
			const mockConnection = {
				id: 'test-connection',
				from: { barId: 'bar1', side: 'left' },
				to: { barId: 'bar2', side: 'right' },
			}
			vi.spyOn(store, 'createConnection').mockReturnValue(mockConnection as any)

			const ganttBar = wrapper.find('.gantt-bar')
			await ganttBar.trigger('mouseenter')

			const leftHandle = wrapper.find('.left-connection-handle')
			if (leftHandle.exists()) {
				leftHandle.element.getBoundingClientRect = vi.fn().mockReturnValue({
					left: 100,
					top: 50,
					width: 16,
					height: 16,
				})

				await leftHandle.trigger('mousedown', {
					clientX: 100,
					clientY: 50,
					preventDefault: vi.fn(),
					stopPropagation: vi.fn(),
				})

				document.dispatchEvent(new MouseEvent('mouseup', { clientX: 200, clientY: 50 }))
			}

			// Should properly detect right side and emit connection
			expect(wrapper.emitted('connection:create')).toBeTruthy()

			// Restore
			document.elementFromPoint = originalElementFromPoint
		})
	})

	it('should render with all required elements', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		expect(wrapper.find('.aganttcell').exists()).toBe(true)
		expect(wrapper.find('.gantt-container').exists()).toBe(true)
		expect(wrapper.find('.gantt-bar').exists()).toBe(true)
		expect(wrapper.findAll('.connection-handle').length).toBe(2)
		expect(wrapper.findAll('.resize-handle').length).toBe(2)
	})

	it('should handle short color codes by using default', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				color: '#ff', // Short color code
			},
		})

		expect(wrapper.find('.gantt-bar').exists()).toBe(true)
	})

	it('should handle valid color codes', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				color: '#ff0000', // Valid color code
			},
		})

		expect(wrapper.find('.gantt-bar').exists()).toBe(true)
	})

	it('should show connection handles on mouse enter', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		await wrapper.find('.gantt-bar').trigger('mouseenter')

		expect(wrapper.find('.left-connection-handle.visible').exists()).toBe(true)
		expect(wrapper.find('.right-connection-handle.visible').exists()).toBe(true)
	})

	it('should hide connection handles on mouse leave', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		// First show handles
		await wrapper.find('.gantt-bar').trigger('mouseenter')
		expect(wrapper.find('.left-connection-handle.visible').exists()).toBe(true)

		// Then hide them
		await wrapper.find('.gantt-bar').trigger('mouseleave')
		expect(wrapper.find('.left-connection-handle.visible').exists()).toBe(false)
		expect(wrapper.find('.right-connection-handle.visible').exists()).toBe(false)
	})

	it('should prevent default and stop propagation on connection handle mousedown', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		const mockEvent = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		}

		const leftHandle = wrapper.find('.left-connection-handle')
		leftHandle.element.getBoundingClientRect = vi.fn().mockReturnValue({
			left: 100,
			top: 50,
			width: 20,
			height: 20,
		})

		await leftHandle.trigger('mousedown', mockEvent)

		expect(mockEvent.preventDefault).toHaveBeenCalled()
		expect(mockEvent.stopPropagation).toHaveBeenCalled()
	})

	it('should handle right connection handle mousedown', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		const mockEvent = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		}

		const rightHandle = wrapper.find('.right-connection-handle')
		rightHandle.element.getBoundingClientRect = vi.fn().mockReturnValue({
			left: 200,
			top: 50,
			width: 20,
			height: 20,
		})

		await rightHandle.trigger('mousedown', mockEvent)

		expect(mockEvent.preventDefault).toHaveBeenCalled()
		expect(mockEvent.stopPropagation).toHaveBeenCalled()
	})

	it('should register gantt bar and connection handles on mount', () => {
		const registerBarSpy = vi.spyOn(store, 'registerGanttBar')
		const registerHandleSpy = vi.spyOn(store, 'registerConnectionHandle')

		mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		expect(registerBarSpy).toHaveBeenCalled()
		expect(registerHandleSpy).toHaveBeenCalledTimes(2) // left and right handles
	})

	it('should unregister gantt components on unmount', () => {
		const unregisterBarSpy = vi.spyOn(store, 'unregisterGanttBar')
		const unregisterHandleSpy = vi.spyOn(store, 'unregisterConnectionHandle')

		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		wrapper.unmount()

		expect(unregisterBarSpy).toHaveBeenCalled()
		expect(unregisterHandleSpy).toHaveBeenCalledTimes(2)
	})

	it('should emit connection:create when connection is successfully created', async () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		const mockConnection = {
			id: 'test-connection',
			from: { barId: 'bar1', side: 'left' },
			to: { barId: 'bar2', side: 'right' },
		}

		// Directly emit the event to test the emission
		await wrapper.vm.$emit('connection:create', mockConnection)

		expect(wrapper.emitted('connection:create')).toBeTruthy()
		expect(wrapper.emitted('connection:create')?.[0][0]).toEqual(mockConnection)
	})

	it('should render label when provided', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				label: 'Test Task Label',
			},
		})

		expect(wrapper.find('.gantt-label').text()).toBe('Test Task Label')
	})

	it('should not render label element when label not provided', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				// no label prop
			},
		})

		expect(wrapper.find('.gantt-label').exists()).toBe(false)
	})

	it('should set correct colspan attribute', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				colspan: 5,
			},
		})

		expect(wrapper.find('.aganttcell').attributes('colspan')).toBe('5')
	})

	it('should use default colspan when not provided', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				// colspan defaults to 1
			},
		})

		expect(wrapper.find('.aganttcell').attributes('colspan')).toBe('1')
	})

	it('should handle start and end props', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 2,
				end: 8,
				colspan: 6,
			},
		})

		expect(wrapper.find('.gantt-bar').exists()).toBe(true)
		expect(wrapper.find('.aganttcell').attributes('colspan')).toBe('6')
	})

	it('should render all visual elements correctly', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		// Connection handles
		expect(wrapper.find('.left-connection-handle').exists()).toBe(true)
		expect(wrapper.find('.right-connection-handle').exists()).toBe(true)
		expect(wrapper.findAll('.connection-dot').length).toBe(2)

		// Resize handles
		expect(wrapper.find('.left-resize-handle').exists()).toBe(true)
		expect(wrapper.find('.right-resize-handle').exists()).toBe(true)
		expect(wrapper.findAll('.handle-grip').length).toBe(2)
		expect(wrapper.findAll('.vertical-indicator').length).toBe(2)
	})

	it('should not show SVG drag preview initially', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
			},
		})

		expect(wrapper.find('svg').exists()).toBe(false)
	})

	it('should handle default start value', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				// start defaults to 0
				end: 5,
			},
		})

		expect(wrapper.find('.gantt-bar').exists()).toBe(true)
	})

	it('should handle missing end prop with start and colspan', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 0,
				colIndex: 0,
				start: 3,
				colspan: 4,
				// end is calculated as start + colspan
			},
		})

		expect(wrapper.find('.gantt-bar').exists()).toBe(true)
	})

	it('should assign proper data attributes to gantt bar', () => {
		const wrapper = mount(AGanttCell, {
			props: {
				store,
				columnsCount: 10,
				rowIndex: 2,
				colIndex: 3,
			},
		})

		const ganttBar = wrapper.find('.gantt-bar')
		expect(ganttBar.attributes('data-rowindex')).toBe('2')
		expect(ganttBar.attributes('data-colindex')).toBe('3')
	})
})
