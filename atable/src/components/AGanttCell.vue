<template>
	<td class="aganttcell" :colspan="colspan">
		<div ref="container" class="gantt-container">
			<!-- Draggable gantt bar -->
			<div
				ref="bar"
				:data-rowindex="rowIndex"
				:data-colindex="colIndex"
				class="gantt-bar"
				:class="{ 'is-dragging': isAnyDragging }"
				:style="barStyle"
				@mouseenter="showConnectionHandles"
				@mouseleave="hideConnectionHandles">
				<!-- Connection handles for linking bars - only show if dependency graph is enabled -->
				<div
					v-if="store.isDependencyGraphEnabled"
					ref="leftConnectionHandle"
					class="connection-handle left-connection-handle"
					:class="{ visible: isLeftConnectionVisible, 'is-dragging': isLeftConnectionDragging }"
					@mousedown.stop="startConnectionDrag('left', $event)">
					<div class="connection-dot"></div>
				</div>

				<div
					v-if="store.isDependencyGraphEnabled"
					ref="rightConnectionHandle"
					class="connection-handle right-connection-handle"
					:class="{ visible: isRightConnectionVisible, 'is-dragging': isRightConnectionDragging }"
					@mousedown.stop="startConnectionDrag('right', $event)">
					<div class="connection-dot"></div>
				</div>

				<!-- Resize handles for changing bar length -->
				<div ref="leftResizeHandle" class="resize-handle left-resize-handle" :class="{ 'is-dragging': isLeftResizing }">
					<div class="handle-grip"></div>
					<div class="vertical-indicator left-indicator"></div>
				</div>

				<label v-if="label" class="gantt-label">{{ label }}</label>

				<div
					ref="rightResizeHandle"
					class="resize-handle right-resize-handle"
					:class="{ 'is-dragging': isRightResizing }">
					<div class="handle-grip"></div>
					<div class="vertical-indicator right-indicator"></div>
				</div>
			</div>
		</div>

		<!-- Connection drag preview line - only show if dependency graph is enabled -->
		<svg v-if="store.isDependencyGraphEnabled && showDragPreview" :style="connectionDragStyle">
			<line
				:x1="dragPreview.startX"
				:y1="dragPreview.startY"
				:x2="dragPreview.endX"
				:y2="dragPreview.endY"
				stroke="#2196f3"
				stroke-width="2"
				stroke-dasharray="5,5" />
		</svg>
	</td>
</template>

<script setup lang="ts">
import { useDraggable, useElementBounding } from '@vueuse/core'
import { ref, computed, onMounted, onUnmounted, useTemplateRef, type StyleValue } from 'vue'

import { createTableStore } from '../stores/table'
import type { ConnectionPath } from '../types'

const {
	store,
	columnsCount,
	rowIndex,
	colIndex,
	start = 0,
	end = 0,
	colspan = 1,
	label = '',
	color = '#cccccc',
} = defineProps<{
	store: ReturnType<typeof createTableStore>
	columnsCount: number
	rowIndex: number
	colIndex: number
	start?: number
	end?: number
	colspan?: number
	label?: string
	color?: string
}>()

const emit = defineEmits<{
	'connection:create': [connection: ConnectionPath]
}>()

// Core refs and state
const barColor = ref(color.length >= 6 ? color : '#cccccc')
const barId = `gantt-bar-row-${rowIndex}-col-${colIndex}`

// Template refs
const containerRef = useTemplateRef<HTMLDivElement>('container')
const barRef = useTemplateRef<HTMLDivElement>('bar')
const leftResizeHandleRef = useTemplateRef<HTMLDivElement>('leftResizeHandle')
const rightResizeHandleRef = useTemplateRef<HTMLDivElement>('rightResizeHandle')
const leftConnectionHandleRef = useTemplateRef<HTMLDivElement>('leftConnectionHandle')
const rightConnectionHandleRef = useTemplateRef<HTMLDivElement>('rightConnectionHandle')

// Position tracking
const { width: totalBarWidth } = useElementBounding(containerRef)
const { left: barLeft, right: barRight } = useElementBounding(barRef)

// Bar positioning
const currentStart = ref(start)
const currentEnd = ref(end || currentStart.value + colspan)

// Drag states
const isLeftConnectionVisible = ref(false)
const isRightConnectionVisible = ref(false)
const isLeftConnectionDragging = ref(false)
const isRightConnectionDragging = ref(false)
const showDragPreview = ref(false)
const dragPreview = ref({ startX: 0, startY: 0, endX: 0, endY: 0 })

// Computed properties
const isAnyDragging = computed(() => isBarDragging.value || isLeftResizing.value || isRightResizing.value)

const pixelsPerColumn = computed(() => (colspan > 0 ? totalBarWidth.value / colspan : 0))

const barStyle = computed((): StyleValue => {
	const startPercent = (currentStart.value / colspan) * 100
	const endPercent = (currentEnd.value / colspan) * 100
	return {
		left: `${startPercent}%`,
		width: `${endPercent - startPercent}%`,
		backgroundColor: barColor.value,
	}
})

const connectionDragStyle = computed(
	(): StyleValue => ({
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		pointerEvents: 'none',
		zIndex: 1000,
	})
)

// Drag setup data
const dragStartData = ref({ startX: 0, startPos: 0 })

// Left resize handle dragging
const { isDragging: isLeftResizing } = useDraggable(leftResizeHandleRef, {
	axis: 'x',
	onStart: () => setupDragStart(barLeft.value, currentStart.value),
	onMove: ({ x }) => handleLeftResize(x),
	onEnd: ({ x }) => finishLeftResize(x),
})

// Right resize handle dragging
const { isDragging: isRightResizing } = useDraggable(rightResizeHandleRef, {
	axis: 'x',
	onStart: () => setupDragStart(barRight.value, currentEnd.value),
	onMove: ({ x }) => handleRightResize(x),
	onEnd: ({ x }) => finishRightResize(x),
})

// Bar movement dragging
const { isDragging: isBarDragging } = useDraggable(barRef, {
	exact: true,
	axis: 'x',
	onStart: () => setupDragStart(barLeft.value, currentStart.value),
	onMove: ({ x }) => handleBarMove(x),
	onEnd: ({ x }) => finishBarMove(x),
})

// Lifecycle
onMounted(() => {
	registerGanttComponents()
})

onUnmounted(() => {
	unregisterGanttComponents()
})

// Helper functions
function setupDragStart(startX: number, startPos: number) {
	if (barRef.value) barRef.value.style.transition = 'none'
	dragStartData.value = { startX, startPos }
}

function handleLeftResize(x: number) {
	if (!isLeftResizing.value || !barRef.value) return

	const deltaX = x - dragStartData.value.startX
	const deltaColumns = deltaX / pixelsPerColumn.value
	const newStart = Math.max(0, Math.min(currentEnd.value - 1, dragStartData.value.startPos + deltaColumns))

	barRef.value.style.left = `${(newStart / colspan) * 100}%`
	barRef.value.style.width = `${((currentEnd.value - newStart) / colspan) * 100}%`
}

function finishLeftResize(x: number) {
	if (!barRef.value) return

	const deltaX = x - dragStartData.value.startX
	const deltaColumns = Math.round(deltaX / pixelsPerColumn.value)
	const oldStart = currentStart.value
	const newStart = Math.max(0, Math.min(currentEnd.value - 1, dragStartData.value.startPos + deltaColumns))

	currentStart.value = newStart
	store.updateGanttBar({
		rowIndex,
		colIndex,
		type: 'resize',
		edge: 'start',
		oldStart,
		newStart,
		end: currentEnd.value,
		delta: deltaColumns,
		oldColspan: currentEnd.value - oldStart,
		newColspan: currentEnd.value - newStart,
	})
}

function handleRightResize(x: number) {
	if (!isRightResizing.value || !barRef.value) return

	const deltaX = x - dragStartData.value.startX
	const deltaColumns = deltaX / pixelsPerColumn.value
	const newEnd = Math.max(currentStart.value + 1, Math.min(columnsCount, dragStartData.value.startPos + deltaColumns))

	barRef.value.style.width = `${((newEnd - currentStart.value) / colspan) * 100}%`
}

function finishRightResize(x: number) {
	if (!barRef.value) return

	const deltaX = x - dragStartData.value.startX
	const deltaColumns = Math.round(deltaX / pixelsPerColumn.value)
	const oldEnd = currentEnd.value
	const newEnd = Math.max(currentStart.value + 1, Math.min(columnsCount, dragStartData.value.startPos + deltaColumns))

	currentEnd.value = newEnd
	store.updateGanttBar({
		rowIndex,
		colIndex,
		type: 'resize',
		edge: 'end',
		oldEnd,
		newEnd,
		start: currentStart.value,
		delta: deltaColumns,
		oldColspan: oldEnd - currentStart.value,
		newColspan: newEnd - currentStart.value,
	})
}

function handleBarMove(x: number) {
	if (!isBarDragging.value || !barRef.value) return

	const deltaX = x - dragStartData.value.startX
	const deltaColumns = deltaX / pixelsPerColumn.value
	const barWidth = currentEnd.value - currentStart.value
	const newStart = Math.max(0, Math.min(dragStartData.value.startPos + deltaColumns, columnsCount - barWidth))

	barRef.value.style.left = `${(newStart / colspan) * 100}%`
}

function finishBarMove(x: number) {
	if (!barRef.value) return

	const deltaX = x - dragStartData.value.startX
	const deltaColumns = Math.round(deltaX / pixelsPerColumn.value)
	const barWidth = currentEnd.value - currentStart.value

	const oldStart = currentStart.value
	const oldEnd = currentEnd.value
	let newStart = dragStartData.value.startPos + deltaColumns
	let newEnd = newStart + barWidth

	// Boundary checks
	if (newStart < 0) {
		newStart = 0
		newEnd = barWidth
	} else if (newEnd > columnsCount) {
		newEnd = columnsCount
		newStart = newEnd - barWidth
	}

	currentStart.value = newStart
	currentEnd.value = newEnd

	store.updateGanttBar({
		rowIndex,
		colIndex,
		type: 'bar',
		oldStart,
		oldEnd,
		newStart,
		newEnd,
		delta: deltaColumns,
		colspan: newEnd - newStart,
	})
}

function registerGanttComponents() {
	const { x: barX, y: barY } = useElementBounding(barRef)
	const { x: leftX, y: leftY } = useElementBounding(leftConnectionHandleRef)
	const { x: rightX, y: rightY } = useElementBounding(rightConnectionHandleRef)

	store.registerGanttBar({
		id: barId,
		rowIndex,
		colIndex,
		startIndex: currentStart,
		endIndex: currentEnd,
		color: barColor,
		label,
		position: { x: barX, y: barY },
	})

	// Only register connection handles if dependency graph is enabled
	if (store.isDependencyGraphEnabled) {
		store.registerConnectionHandle({
			id: `${barId}-connection-left`,
			rowIndex,
			colIndex,
			side: 'left',
			position: { x: leftX, y: leftY },
			visible: isLeftConnectionVisible,
			barId,
		})

		store.registerConnectionHandle({
			id: `${barId}-connection-right`,
			rowIndex,
			colIndex,
			side: 'right',
			position: { x: rightX, y: rightY },
			visible: isRightConnectionVisible,
			barId,
		})
	}
}

function unregisterGanttComponents() {
	store.unregisterGanttBar(barId)
	// Only unregister connection handles if dependency graph is enabled
	if (store.isDependencyGraphEnabled) {
		store.unregisterConnectionHandle(`${barId}-connection-left`)
		store.unregisterConnectionHandle(`${barId}-connection-right`)
	}
}

function showConnectionHandles() {
	// Only show connection handles if dependency graph is enabled
	if (store.isDependencyGraphEnabled) {
		isLeftConnectionVisible.value = true
		isRightConnectionVisible.value = true
	}
}

function hideConnectionHandles() {
	if (!isLeftConnectionDragging.value && !isRightConnectionDragging.value) {
		isLeftConnectionVisible.value = false
		isRightConnectionVisible.value = false
	}
}

function startConnectionDrag(side: 'left' | 'right', event: MouseEvent) {
	event.preventDefault()
	event.stopPropagation()

	showDragPreview.value = true
	if (side === 'left') {
		isLeftConnectionDragging.value = true
	} else {
		isRightConnectionDragging.value = true
	}

	// Set initial drag preview position
	const handle = side === 'left' ? leftConnectionHandleRef.value : rightConnectionHandleRef.value
	if (handle) {
		const handleRect = handle.getBoundingClientRect()
		const centerX = handleRect.left + handleRect.width / 2
		const centerY = handleRect.top + handleRect.height / 2
		dragPreview.value = { startX: centerX, startY: centerY, endX: centerX, endY: centerY }
	}

	const handleMouseMove = (moveEvent: MouseEvent) => {
		dragPreview.value.endX = moveEvent.clientX
		dragPreview.value.endY = moveEvent.clientY
	}

	const handleMouseUp = (event: MouseEvent) => {
		handleConnectionDrop(event, side)
		cleanupConnectionDrag(handleMouseMove, handleMouseUp)
	}

	document.addEventListener('mousemove', handleMouseMove)
	document.addEventListener('mouseup', handleMouseUp)
}

function handleConnectionDrop(upEvent: MouseEvent, sourceSide: 'left' | 'right') {
	const targetElement = document.elementFromPoint(upEvent.clientX, upEvent.clientY)
	const targetHandle = targetElement?.closest('.connection-handle')

	if (
		targetHandle &&
		targetHandle !== (sourceSide === 'left' ? leftConnectionHandleRef.value : rightConnectionHandleRef.value)
	) {
		const targetBar = targetHandle.closest('.gantt-bar')

		if (targetBar) {
			const targetRowIndex = parseInt(targetBar.getAttribute('data-rowindex') || '0')
			const targetColIndex = parseInt(targetBar.getAttribute('data-colindex') || '0')
			const targetSide = targetHandle.classList.contains('left-connection-handle') ? 'left' : 'right'
			const targetBarId = `gantt-bar-row-${targetRowIndex}-col-${targetColIndex}`

			const connection = store.createConnection(
				`${barId}-connection-${sourceSide}`,
				`${targetBarId}-connection-${targetSide}`
			)

			if (connection) {
				emit('connection:create', connection)
			}
		}
	}
}

function cleanupConnectionDrag(
	handleMouseMove: (event: MouseEvent) => void,
	handleMouseUp: (event: MouseEvent) => void
) {
	showDragPreview.value = false
	isLeftConnectionDragging.value = false
	isRightConnectionDragging.value = false

	document.removeEventListener('mousemove', handleMouseMove)
	document.removeEventListener('mouseup', handleMouseUp)

	if (!barRef.value?.matches(':hover')) {
		hideConnectionHandles()
	}
}

defineExpose({
	barStyle,
	cleanupConnectionDrag,
	currentEnd,
	handleConnectionDrop,
	isLeftConnectionDragging,
	isLeftConnectionVisible,
	isRightConnectionDragging,
	isRightConnectionVisible,
	showDragPreview,
})
</script>

<style scoped>
.aganttcell {
	background-color: #f9f9f9;
	width: 100%;
	padding: 0;
	height: 100%;
}

.gantt-container {
	position: relative;
	height: 100%;
	background-color: #f0f0f0;
	border-radius: 4px;
	overflow: visible;
}

.gantt-bar {
	position: absolute;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: grab;
	box-sizing: border-box;
	border: 1px solid rgba(0, 0, 0, 0.5);
	transition: left 0.1s ease-out, width 0.1s ease-out;
	height: 80%;
	top: 50%;
	z-index: 0;
	transform: translateY(-50%);
}

.gantt-bar:active {
	cursor: grabbing;
}

.gantt-bar.is-dragging {
	z-index: 10;
}

.gantt-label {
	flex: 1;
	text-align: center;
	font-size: 12px;
	color: #aaaaaa;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 0 8px;
	user-select: none;
}

.resize-handle {
	position: relative;
	width: 12px;
	height: 100%;
	cursor: ew-resize;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 0;
	background: rgba(0, 0, 0, 0.25);
}

.left-resize-handle {
	border-right: 1px solid rgba(0, 0, 0, 0.5);
}

.right-resize-handle {
	border-left: 1px solid rgba(0, 0, 0, 0.5);
}

.handle-grip {
	width: 4px;
	height: 12px;
	border-radius: 2px;
	background: rgba(0, 0, 0, 0.8);
}

.resize-handle:hover {
	background-color: rgba(255, 255, 255, 0.5);
}

.vertical-indicator {
	position: absolute;
	width: 2px;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.2s ease;
	top: -100vh;
	height: 100vh;
	z-index: 5;
	background-color: v-bind(barColor);
}

.left-indicator {
	left: 50%;
	transform: translateX(-50%);
}

.right-indicator {
	right: 50%;
	transform: translateX(50%);
}

.resize-handle.is-dragging .vertical-indicator {
	opacity: 0.7;
}

.gantt-container::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-size: calc(100% / v-bind(colspan)) 100%;
	background-image: linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
	pointer-events: none;
	z-index: 1;
}

.connection-handle {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	width: 16px;
	height: 16px;
	opacity: 0;
	transition: opacity 0.2s ease;
	cursor: crosshair;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
}

.connection-handle.visible {
	opacity: 1;
}

.left-connection-handle {
	left: -16px;
}

.right-connection-handle {
	right: -16px;
}

.connection-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background-color: #2196f3;
	border: 2px solid white;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.connection-handle:hover .connection-dot {
	background-color: #1976d2;
	transform: scale(1.2);
}

.connection-handle.is-dragging {
	opacity: 1 !important;
}

.connection-handle.is-dragging .connection-dot {
	background-color: #1976d2;
	transform: scale(1.3);
	box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4);
}
</style>
