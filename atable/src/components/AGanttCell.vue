<template>
	<td class="aganttcell" :colspan="colspan">
		<div ref="container" class="gantt-handler">
			<!-- Draggable gantt bar -->
			<div
				ref="bar"
				:data-rowindex="rowIndex"
				:data-colindex="colIndex"
				class="gantt-bar"
				:class="{ 'is-dragging': isBarDragging || isLeftDragging || isRightDragging }"
				:style="barStyle"
				@mouseenter="showConnectionHandles"
				@mouseleave="hideConnectionHandles">
				<!-- Connection handles -->
				<div
					ref="leftConnectionHandle"
					class="connection-handle left-connection-handle"
					:class="{ visible: leftResizeHandleVisible, 'is-dragging': isLeftConnectionDragging }"
					@mousedown.stop="startConnectionDrag('left', $event)">
					<div class="connection-dot"></div>
				</div>

				<div
					ref="rightConnectionHandle"
					class="connection-handle right-connection-handle"
					:class="{ visible: rightResizeHandleVisible, 'is-dragging': isRightConnectionDragging }"
					@mousedown.stop="startConnectionDrag('right', $event)">
					<div class="connection-dot"></div>
				</div>

				<!-- Resize handles -->
				<div ref="leftResizeHandle" class="resize-handle left-resize-handle" :class="{ 'is-dragging': isLeftDragging }">
					<div class="handle-grip"></div>
					<div class="vertical-indicator left-indicator"></div>
				</div>

				<label v-if="label" class="gantt-label">{{ label }}</label>

				<div
					ref="rightResizeHandle"
					class="resize-handle right-resize-handle"
					:class="{ 'is-dragging': isRightDragging }">
					<div class="handle-grip"></div>
					<div class="vertical-indicator right-indicator"></div>
				</div>
			</div>
		</div>

		<!-- Drag preview line -->
		<svg
			v-if="isDragPreviewVisible"
			class="drag-preview-svg"
			:style="{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				pointerEvents: 'none',
				zIndex: 1000,
			}">
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
import { ref, computed, onMounted, onUnmounted, useTemplateRef } from 'vue'

import { createTableStore } from '../stores/table'
import type { ConnectionPath } from '../types'

const {
	store,
	columnsCount,
	rowIndex,
	colIndex,
	start,
	end,
	colspan = 1,
	label,
	color,
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

const baseColor = ref()
const barId = `gantt-bar-row-${rowIndex}-col-${colIndex}`
const leftResizeHandleVisible = ref(false)
const rightResizeHandleVisible = ref(false)

// Connection drag state
const isLeftConnectionDragging = ref(false)
const isRightConnectionDragging = ref(false)
const isDragPreviewVisible = ref(false)
const dragPreview = ref({
	startX: 0,
	startY: 0,
	endX: 0,
	endY: 0,
})
const dragStartSide = ref<'left' | 'right' | null>(null)

const containerRef = useTemplateRef('container')
const barRef = useTemplateRef('bar')
const leftResizeHandleRef = useTemplateRef('leftResizeHandle')
const rightResizeHandleRef = useTemplateRef('rightResizeHandle')
const leftConnectionHandleRef = useTemplateRef('leftConnectionHandle')
const rightConnectionHandleRef = useTemplateRef('rightConnectionHandle')

const { width: totalBarWidth } = useElementBounding(containerRef)
const { left: barLeft, right: barRight } = useElementBounding(barRef)
const currentStart = ref(start || 0)
const currentEnd = ref(end || currentStart.value + colspan)
const dragStartData = ref({ startX: 0, startPos: 0 })

onMounted(() => {
	if (!color || color == '' || color.length < 6) {
		baseColor.value = '#cccccc'
	} else {
		baseColor.value = color
	}

	const { x: barX, y: barY } = useElementBounding(barRef)
	store.registerGanttBar({
		id: barId,
		rowIndex,
		colIndex,
		startIndex: currentStart,
		endIndex: currentEnd,
		color: baseColor,
		label,
		position: { x: barX, y: barY },
	})

	// Register connection handles with proper position tracking
	const { x: leftX, y: leftY } = useElementBounding(leftConnectionHandleRef)
	const { x: rightX, y: rightY } = useElementBounding(rightConnectionHandleRef)

	store.registerConnectionHandle({
		id: `${barId}-connection-left`,
		rowIndex,
		colIndex,
		side: 'left',
		position: { x: leftX, y: leftY },
		visible: leftResizeHandleVisible,
		barId,
	})

	store.registerConnectionHandle({
		id: `${barId}-connection-right`,
		rowIndex,
		colIndex,
		side: 'right',
		position: { x: rightX, y: rightY },
		visible: rightResizeHandleVisible,
		barId,
	})
})

onUnmounted(() => {
	store.unregisterGanttBar(barId)
	store.unregisterConnectionHandle(`${barId}-connection-left`)
	store.unregisterConnectionHandle(`${barId}-connection-right`)
})

const pixelsPerColumn = computed(() => (colspan > 0 ? totalBarWidth.value / colspan : 0))

const barStyle = computed(() => {
	const startPercent = (currentStart.value / colspan) * 100
	const endPercent = (currentEnd.value / colspan) * 100

	return {
		left: `${startPercent}%`,
		width: `${endPercent - startPercent}%`,
		backgroundColor: baseColor.value,
	}
})

const { isDragging: isLeftDragging } = useDraggable(leftResizeHandleRef, {
	axis: 'x',
	onStart: () => {
		if (barRef.value) barRef.value.style.transition = 'none'
		dragStartData.value = {
			startX: barLeft.value,
			startPos: currentStart.value,
		}
	},
	onMove: ({ x }) => {
		if (isLeftDragging.value && barRef.value) {
			const deltaX = x - dragStartData.value.startX
			const deltaColumns = deltaX / pixelsPerColumn.value
			const newStart = Math.max(0, Math.min(currentEnd.value - 1, dragStartData.value.startPos + deltaColumns))
			barRef.value.style.left = `${(newStart / colspan) * 100}%`
			barRef.value.style.width = `${((currentEnd.value - newStart) / colspan) * 100}%`
		}
	},
	onEnd: ({ x }) => {
		if (barRef.value) {
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
	},
})

const { isDragging: isRightDragging } = useDraggable(rightResizeHandleRef, {
	axis: 'x',
	onStart: () => {
		if (barRef.value) barRef.value.style.transition = 'none'
		dragStartData.value = {
			startX: barRight.value,
			startPos: currentEnd.value,
		}
	},
	onMove: ({ x }) => {
		if (isRightDragging.value && barRef.value) {
			const deltaX = x - dragStartData.value.startX
			const deltaColumns = deltaX / pixelsPerColumn.value
			const newEnd = Math.max(
				currentStart.value + 1,
				Math.min(columnsCount, dragStartData.value.startPos + deltaColumns)
			)
			barRef.value.style.width = `${((newEnd - currentStart.value) / colspan) * 100}%`
		}
	},
	onEnd: ({ x }) => {
		if (barRef.value) {
			const deltaX = x - dragStartData.value.startX
			const deltaColumns = Math.round(deltaX / pixelsPerColumn.value)
			const oldEnd = currentEnd.value
			const newEnd = Math.max(
				currentStart.value + 1,
				Math.min(columnsCount, dragStartData.value.startPos + deltaColumns)
			)
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
	},
})

const { isDragging: isBarDragging } = useDraggable(barRef, {
	exact: true, // to avoid triggering when the left and right handles are being used
	axis: 'x',
	onStart: () => {
		if (barRef.value) barRef.value.style.transition = 'none'
		dragStartData.value = {
			startX: barLeft.value,
			startPos: currentStart.value,
		}
	},
	onMove: ({ x }) => {
		if (isBarDragging.value && barRef.value) {
			const deltaX = x - dragStartData.value.startX
			const deltaColumns = deltaX / pixelsPerColumn.value
			const barWidth = currentEnd.value - currentStart.value
			const newStart = Math.max(0, Math.min(dragStartData.value.startPos + deltaColumns, columnsCount - barWidth))
			barRef.value.style.left = `${(newStart / colspan) * 100}%`
		}
	},
	onEnd: ({ x }) => {
		if (barRef.value) {
			const deltaX = x - dragStartData.value.startX
			const deltaColumns = Math.round(deltaX / pixelsPerColumn.value)
			const barWidth = currentEnd.value - currentStart.value

			const oldStart = currentStart.value
			const oldEnd = currentEnd.value
			let newStart = dragStartData.value.startPos + deltaColumns
			let newEnd = newStart + barWidth
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
	},
})

const showConnectionHandles = () => {
	leftResizeHandleVisible.value = true
	rightResizeHandleVisible.value = true
}

const hideConnectionHandles = () => {
	if (!isLeftConnectionDragging.value && !isRightConnectionDragging.value) {
		leftResizeHandleVisible.value = false
		rightResizeHandleVisible.value = false
	}
}

const startConnectionDrag = (side: 'left' | 'right', event: MouseEvent) => {
	event.preventDefault()
	event.stopPropagation()

	dragStartSide.value = side
	isDragPreviewVisible.value = true

	if (side === 'left') {
		isLeftConnectionDragging.value = true
	} else {
		isRightConnectionDragging.value = true
	}

	const handle = side === 'left' ? leftConnectionHandleRef.value : rightConnectionHandleRef.value
	const handleRect = handle?.getBoundingClientRect()
	if (handleRect) {
		dragPreview.value.startX = handleRect.left + handleRect.width / 2
		dragPreview.value.startY = handleRect.top + handleRect.height / 2
		dragPreview.value.endX = dragPreview.value.startX
		dragPreview.value.endY = dragPreview.value.startY
	}

	const handleMouseMove = (moveEvent: MouseEvent) => {
		dragPreview.value.endX = moveEvent.clientX
		dragPreview.value.endY = moveEvent.clientY
	}

	const handleMouseUp = (upEvent: MouseEvent) => {
		// Find target connection handle
		const targetElement = document.elementFromPoint(upEvent.clientX, upEvent.clientY)
		const targetHandle = targetElement?.closest('.connection-handle')

		if (
			targetHandle &&
			targetHandle !== (side === 'left' ? leftConnectionHandleRef.value : rightConnectionHandleRef.value)
		) {
			// Extract target bar info from the target handle
			const targetBar = targetHandle.closest('.gantt-bar')
			const targetBarContainer = targetBar?.closest('.aganttcell')

			if (targetBar && targetBarContainer) {
				const targetRowIndex = parseInt(targetBar.getAttribute('data-rowindex') || '0')
				const targetColIndex = parseInt(targetBar.getAttribute('data-colindex') || '0')
				const targetSide = targetHandle.classList.contains('left-connection-handle') ? 'left' : 'right'
				const targetBarId = `gantt-bar-row-${targetRowIndex}-col-${targetColIndex}`

				// Create connection
				const connection = store.createConnection(
					`${barId}-connection-${side}`,
					`${targetBarId}-connection-${targetSide}`
				)

				if (connection) {
					emit('connection:create', connection)
				}
			}
		}

		// Clean up
		isDragPreviewVisible.value = false
		isLeftConnectionDragging.value = false
		isRightConnectionDragging.value = false
		dragStartSide.value = null

		document.removeEventListener('mousemove', handleMouseMove)
		document.removeEventListener('mouseup', handleMouseUp)

		// Hide handles if mouse is not over the bar
		if (!barRef.value?.matches(':hover')) {
			hideConnectionHandles()
		}
	}

	document.addEventListener('mousemove', handleMouseMove)
	document.addEventListener('mouseup', handleMouseUp)
}
</script>

<style scoped>
.aganttcell {
	background-color: #f9f9f9;
	width: 100%;
	padding: 0;
	height: 100%;
}

.gantt-handler {
	position: relative;
	height: 100%;
	background-color: #f0f0f0;
	border-radius: 4px;
	overflow: visible; /* Changed from hidden to allow indicators to extend out */
}

.gantt-bar {
	position: absolute;
	height: 100%;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: grab;
	box-sizing: border-box;
	border: 1px solid rgba(0, 0, 0, 0.5);
	transition: left 0.1s ease-out, width 0.1s ease-out;
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

/* Vertical indicators for handles */
.vertical-indicator {
	position: absolute;
	width: 2px;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.2s ease;
	top: -100vh; /* Extend up */
	height: 100vh; /* Full height, but will be clipped by tbody */
	z-index: 5;
	background-color: v-bind(baseColor);
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

.gantt-handler::after {
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
	cursor: pointer;
	z-index: 15;
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

.drag-preview-svg {
	pointer-events: none;
	z-index: 1000;
}

.connection-handle:hover {
	cursor: crosshair;
}
</style>
