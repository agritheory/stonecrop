import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

import AGanttConnection from '../../src/components/AGanttConnection.vue'
import { createTableStore } from '../../src/stores/table'
import type { ConnectionPath, GanttBarInfo, ConnectionHandle } from '../../src/types'

describe('AGanttConnection', { tags: ['component'] }, () => {
	let store: ReturnType<typeof createTableStore>

	beforeEach(() => {
		setActivePinia(createPinia())
		store = createTableStore({
			columns: [
				{ name: 'id', label: 'ID' },
				{ name: 'task', label: 'Task' },
			],
			rows: [
				{ id: '1', task: 'Task 1' },
				{ id: '2', task: 'Task 2' },
			],
		})
	})

	it('should render correctly with empty connections', () => {
		const wrapper = mount(AGanttConnection, {
			props: { store },
		})

		expect(wrapper.find('.gantt-connection-overlay')).toBeTruthy()
		expect(wrapper.find('.connection-svg')).toBeTruthy()
		expect(wrapper.find('defs marker#arrowhead')).toBeTruthy()
		expect(wrapper.findAll('.connection-path')).toHaveLength(0)
	})

	it('should render connections when they exist', () => {
		// Set up gantt bars
		const bar1: Partial<GanttBarInfo> = {
			id: 'bar1',
			position: { x: ref(10), y: ref(10) },
			color: ref('#ff0000'),
		}
		const bar2: Partial<GanttBarInfo> = {
			id: 'bar2',
			position: { x: ref(120), y: ref(40) },
			color: ref('#00ff00'),
		}

		store.ganttBars = [bar1, bar2]

		// Set up connection handles
		const handle1: Partial<ConnectionHandle> = {
			barId: 'bar1',
			side: 'right',
			position: { x: ref(110), y: ref(20) },
		}
		const handle2: Partial<ConnectionHandle> = {
			barId: 'bar2',
			side: 'left',
			position: { x: ref(120), y: ref(50) },
		}

		store.connectionHandles = [handle1, handle2]

		// Create a connection
		const connection: ConnectionPath = {
			id: 'conn1',
			from: { barId: 'bar1', side: 'right' },
			to: { barId: 'bar2', side: 'left' },
		}

		store.connectionPaths = [connection]

		const wrapper = mount(AGanttConnection, {
			props: { store },
		})

		expect(wrapper.findAll('.connection-path')).toHaveLength(1)
		expect(wrapper.findAll('.connection-hitbox')).toHaveLength(1)
	})

	it('should filter out connections with missing bars', () => {
		// Create connection without corresponding bars
		const connection: ConnectionPath = {
			id: 'conn1',
			from: { barId: 'nonexistent1', side: 'right' },
			to: { barId: 'nonexistent2', side: 'left' },
		}

		store.connectionPaths = [connection]

		const wrapper = mount(AGanttConnection, {
			props: { store },
		})

		expect(wrapper.findAll('.connection-path')).toHaveLength(0)
	})

	it('should generate correct path data for connections', () => {
		// Set up gantt bars and handles
		const bar1: Partial<GanttBarInfo> = {
			id: 'bar1',
			position: { x: ref(0), y: ref(0) },
		}
		const bar2: Partial<GanttBarInfo> = {
			id: 'bar2',
			position: { x: ref(120), y: ref(30) },
		}

		store.ganttBars = [bar1, bar2]

		const handle1: Partial<ConnectionHandle> = {
			barId: 'bar1',
			side: 'right',
			position: { x: ref(100), y: ref(10) },
		}
		const handle2: Partial<ConnectionHandle> = {
			barId: 'bar2',
			side: 'left',
			position: { x: ref(120), y: ref(40) },
		}

		store.connectionHandles = [handle1, handle2]

		const connection: ConnectionPath = {
			id: 'conn1',
			from: { barId: 'bar1', side: 'right' },
			to: { barId: 'bar2', side: 'left' },
		}

		store.connectionPaths = [connection]

		const wrapper = mount(AGanttConnection, {
			props: { store },
		})

		const pathElement = wrapper.find('.connection-path')
		expect(pathElement.exists()).toBe(true)

		// Path should be a bezier curve from handle1 to handle2
		const pathData = pathElement.attributes('d')
		expect(pathData).toMatch(/^M \d+\.?\d* \d+\.?\d* Q .+/)
	})

	it('should handle connection deletion on double click', async () => {
		// Set up complete connection scenario
		const bar1: Partial<GanttBarInfo> = {
			id: 'bar1',
			position: { x: ref(0), y: ref(0) },
		}
		const bar2: Partial<GanttBarInfo> = {
			id: 'bar2',
			position: { x: ref(120), y: ref(30) },
		}

		store.ganttBars = [bar1, bar2]

		const handle1: Partial<ConnectionHandle> = {
			barId: 'bar1',
			side: 'right',
			position: { x: ref(100), y: ref(10) },
		}
		const handle2: Partial<ConnectionHandle> = {
			barId: 'bar2',
			side: 'left',
			position: { x: ref(120), y: ref(40) },
		}

		store.connectionHandles = [handle1, handle2]

		const connection: ConnectionPath = {
			id: 'conn1',
			from: { barId: 'bar1', side: 'right' },
			to: { barId: 'bar2', side: 'left' },
		}

		store.connectionPaths = [connection]

		// Mock the deleteConnection method
		const deleteConnectionSpy = vi.spyOn(store, 'deleteConnection').mockReturnValue(true)

		const wrapper = mount(AGanttConnection, {
			props: { store },
		})

		// Test double-click on connection path
		await wrapper.find('.connection-path').trigger('dblclick')

		expect(deleteConnectionSpy).toHaveBeenCalledWith('conn1')
		expect(wrapper.emitted('connection:delete')).toBeTruthy()
		expect(wrapper.emitted('connection:delete')?.[0][0]).toEqual(connection)
	})

	it('should handle connection deletion on hitbox double click', async () => {
		// Set up complete connection scenario
		const bar1: Partial<GanttBarInfo> = {
			id: 'bar1',
			position: { x: ref(0), y: ref(0) },
		}
		const bar2: Partial<GanttBarInfo> = {
			id: 'bar2',
			position: { x: ref(120), y: ref(30) },
		}

		store.ganttBars = [bar1, bar2]

		const handle1: Partial<ConnectionHandle> = {
			barId: 'bar1',
			side: 'right',
			position: { x: ref(100), y: ref(10) },
		}
		const handle2: Partial<ConnectionHandle> = {
			barId: 'bar2',
			side: 'left',
			position: { x: ref(120), y: ref(40) },
		}

		store.connectionHandles = [handle1, handle2]

		const connection: ConnectionPath = {
			id: 'conn1',
			from: { barId: 'bar1', side: 'right' },
			to: { barId: 'bar2', side: 'left' },
		}

		store.connectionPaths = [connection]

		// Mock the deleteConnection method
		const deleteConnectionSpy = vi.spyOn(store, 'deleteConnection').mockReturnValue(true)

		const wrapper = mount(AGanttConnection, {
			props: { store },
		})

		// Test double-click on connection hitbox
		await wrapper.find('.connection-hitbox').trigger('dblclick')

		expect(deleteConnectionSpy).toHaveBeenCalledWith('conn1')
		expect(wrapper.emitted('connection:delete')).toBeTruthy()
		expect(wrapper.emitted('connection:delete')?.[0][0]).toEqual(connection)
	})

	it('should not emit event if connection deletion fails', async () => {
		// Set up complete connection scenario
		const bar1: Partial<GanttBarInfo> = {
			id: 'bar1',
			position: { x: ref(0), y: ref(0) },
		}
		const bar2: Partial<GanttBarInfo> = {
			id: 'bar2',
			position: { x: ref(120), y: ref(30) },
		}

		store.ganttBars = [bar1, bar2]

		const handle1: Partial<ConnectionHandle> = {
			barId: 'bar1',
			side: 'right',
			position: { x: ref(100), y: ref(10) },
		}
		const handle2: Partial<ConnectionHandle> = {
			barId: 'bar2',
			side: 'left',
			position: { x: ref(120), y: ref(40) },
		}

		store.connectionHandles = [handle1, handle2]

		const connection: ConnectionPath = {
			id: 'conn1',
			from: { barId: 'bar1', side: 'right' },
			to: { barId: 'bar2', side: 'left' },
		}

		store.connectionPaths = [connection]

		// Mock the deleteConnection method to return false
		const deleteConnectionSpy = vi.spyOn(store, 'deleteConnection').mockReturnValue(false)

		const wrapper = mount(AGanttConnection, {
			props: { store },
		})

		await wrapper.find('.connection-path').trigger('dblclick')

		expect(deleteConnectionSpy).toHaveBeenCalledWith('conn1')
		expect(wrapper.emitted('connection:delete')).toBeFalsy()
	})

	it('should handle connections with custom styles', () => {
		// Set up gantt bars and handles
		const bar1: Partial<GanttBarInfo> = {
			id: 'bar1',
			position: { x: ref(0), y: ref(0) },
		}
		const bar2: Partial<GanttBarInfo> = {
			id: 'bar2',
			position: { x: ref(120), y: ref(30) },
		}

		store.ganttBars = [bar1, bar2]

		const handle1: Partial<ConnectionHandle> = {
			barId: 'bar1',
			side: 'right',
			position: { x: ref(100), y: ref(10) },
		}
		const handle2: Partial<ConnectionHandle> = {
			barId: 'bar2',
			side: 'left',
			position: { x: ref(120), y: ref(40) },
		}

		store.connectionHandles = [handle1, handle2]

		const connection: ConnectionPath = {
			id: 'conn1',
			from: { barId: 'bar1', side: 'right' },
			to: { barId: 'bar2', side: 'left' },
			style: {
				color: '#ff0000',
				width: 4,
			},
		}

		store.connectionPaths = [connection]

		const wrapper = mount(AGanttConnection, {
			props: { store },
		})

		const pathElement = wrapper.find('.connection-path')
		expect(pathElement.attributes('stroke')).toBe('#ff0000')
		expect(pathElement.attributes('stroke-width')).toBe('4')

		const hitboxElement = wrapper.find('.connection-hitbox')
		expect(hitboxElement.attributes('stroke-width')).toBe('14') // 4 + 10
	})

	it('should return empty path data for missing handles', () => {
		// Register the bars so visibleConnections includes this connection
		store.registerGanttBar({ id: 'bar1', rowIndex: 0, colIndex: 0, start: 0, end: 2 } as GanttBarInfo)
		store.registerGanttBar({ id: 'bar2', rowIndex: 1, colIndex: 0, start: 3, end: 5 } as GanttBarInfo)

		const connection: ConnectionPath = {
			id: 'conn1',
			from: { barId: 'bar1', side: 'right' },
			to: { barId: 'bar2', side: 'left' },
		}

		store.connectionPaths = [connection]
		store.connectionHandles = []

		const wrapper = mount(AGanttConnection, {
			props: { store },
		})

		// Connection is visible but has no handles — path should render with empty d attribute
		const pathElement = wrapper.find('.connection-path')
		expect(pathElement.exists()).toBe(true)
		expect(pathElement.attributes('d')).toBe('')
	})

	it('should apply correct SVG styling', () => {
		const wrapper = mount(AGanttConnection, {
			props: { store },
		})

		const svg = wrapper.find('.connection-svg')
		const style = svg.attributes('style')

		expect(style).toContain('position: absolute')
		expect(style).toContain('top: 0')
		expect(style).toContain('left: 0')
		expect(style).toContain('width: 100%')
		expect(style).toContain('height: 100%')
		expect(style).toContain('pointer-events: none')
		expect(style).toContain('z-index: 1')
	})
})
