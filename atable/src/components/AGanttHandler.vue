<template>
	<td class="aganttcell" :colspan="colspan">
		<div ref="containerRef" class="gantt-handler">
			<!-- Draggable gantt bar -->
			<div
				ref="barRef"
				class="gantt-bar"
				:class="{ 'is-dragging': isBarDragging || isLeftDragging || isRightDragging }"
				:style="barStyle">
				<!-- Left resizer handle -->
				<div ref="leftHandleRef" class="gantt-handle left-handle" :class="{ 'is-dragging': isLeftDragging }">
					<div class="handle-grip"></div>
					<!-- Vertical indicator for left handle -->
					<div class="vertical-indicator left-indicator"></div>
				</div>

				<label class="gantt-label">{{ label }}</label>

				<!-- Right resizer handle -->
				<div ref="rightHandleRef" class="gantt-handle right-handle" :class="{ 'is-dragging': isRightDragging }">
					<div class="handle-grip"></div>
					<!-- Vertical indicator for right handle -->
					<div class="vertical-indicator right-indicator"></div>
				</div>
			</div>
		</div>
	</td>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useResizeObserver, useDraggable, useElementBounding } from '@vueuse/core'

const {
	colspan = 1,
	label = '',
	start = 0,
	end = 100,
	duration = 100,
} = defineProps<{
	colspan?: number
	label?: string
	start?: number
	end?: number
	duration?: number
}>()

const emit = defineEmits(['update:start', 'update:end', 'drag'])

// Element refs
const containerRef = ref(null)
const barRef = ref(null)
const leftHandleRef = ref(null)
const rightHandleRef = ref(null)

// Get container bounds to calculate percentages
const containerBounds = useElementBounding(containerRef)

// Initialize drag state
const draggingBar = ref(false)
const initialBarStart = ref(0)
const initialBarEnd = ref(0)

// Calculate bar style based on start and end values
const barStyle = computed(() => {
	const startPercent = (start / duration) * 100
	const endPercent = 100 - ((duration - end) / duration) * 100
	const width = endPercent - startPercent

	return {
		left: `${startPercent}%`,
		width: `${width}%`,
	}
})

// Make the bar draggable
const { x: barX, isDragging: isBarDragging } = useDraggable(barRef, {
	onStart: () => {
		draggingBar.value = true
		initialBarStart.value = start
		initialBarEnd.value = end
	},
	onMove: ({ delta }) => {
		if (!containerBounds.width.value || !draggingBar.value) return

		const pixelsPerUnit = containerBounds.width.value / duration || 1
		const deltaUnits = delta.x / pixelsPerUnit

		const barDuration = end - start
		let newStart = initialBarStart.value + deltaUnits
		let newEnd = initialBarEnd.value + deltaUnits

		if (newStart < 0) {
			newStart = 0
			newEnd = barDuration
		} else if (newEnd > duration) {
			newEnd = duration
			newStart = newEnd - barDuration
		}

		emit('update:start', newStart)
		emit('update:end', newEnd)
		emit('drag', { type: 'bar', start: newStart, end: newEnd })
	},
	onEnd: () => {
		draggingBar.value = false
	},
})

// Make the left handle resizable
const { x: leftX, isDragging: isLeftDragging } = useDraggable(leftHandleRef, {
	onStart: () => {
		initialBarStart.value = start
	},
	onMove: ({ delta }) => {
		if (!containerBounds.width.value) return

		const pixelsPerUnit = containerBounds.width.value / duration
		const deltaUnits = delta.x / pixelsPerUnit

		const newStart = Math.max(0, Math.min(end - 1, initialBarStart.value + deltaUnits))

		emit('update:start', newStart)
		emit('drag', { type: 'resize', edge: 'start', value: newStart })
	},
})

// Make the right handle resizable
const { x: rightX, isDragging: isRightDragging } = useDraggable(rightHandleRef, {
	onStart: () => {
		initialBarEnd.value = end
	},
	onMove: ({ delta }) => {
		if (!containerBounds.width.value) return

		const pixelsPerUnit = containerBounds.width.value / duration
		const deltaUnits = delta.x / pixelsPerUnit

		const newEnd = Math.max(start + 1, Math.min(duration, initialBarEnd.value + deltaUnits))

		emit('update:end', newEnd)
		emit('drag', { type: 'resize', edge: 'end', value: newEnd })
	},
})

// Reset position when not dragging
watch([isLeftDragging, isRightDragging, isBarDragging], ([leftDrag, rightDrag, barDrag]) => {
	if (!leftDrag && !rightDrag && !barDrag) {
		leftX.value = 0
		rightX.value = 0
		barX.value = 0
	}
})

// Use resize observer to recalculate on container resizing
useResizeObserver(containerRef, () => {
	leftX.value = 0
	rightX.value = 0
	barX.value = 0
})
</script>

<style>
.aganttcell {
	background-color: #f9f9f9;
	width: 100%;
	padding: 0;
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
	background-color: #e0e7ff;
	border-radius: 4px;
	border: 1px solid #a5b4fc;
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: grab;
	box-sizing: border-box;
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
	color: #4f46e5;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 0 8px;
	user-select: none;
}

.gantt-handle {
	position: relative;
	width: 12px;
	height: 100%;
	cursor: ew-resize;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #a5b4fc;
	z-index: 0;
}

.left-handle {
	border-right: 1px solid #818cf8;
}

.right-handle {
	border-left: 1px solid #818cf8;
}

.handle-grip {
	width: 4px;
	height: 12px;
	background-color: #4f46e5;
	border-radius: 2px;
}

.gantt-handle:hover {
	background-color: #818cf8;
}

/* Vertical indicators for handles */
.vertical-indicator {
	position: absolute;
	width: 2px;
	background-color: #4f46e5;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.2s ease;
	top: -100vh; /* Extend up */
	height: 100vh; /* Full height, but will be clipped by tbody */
	z-index: 5;
}

.left-indicator {
	left: 50%;
	transform: translateX(-50%);
}

.right-indicator {
	right: 50%;
	transform: translateX(50%);
}

/* Show indicators when handles are being dragged */
.gantt-handle.is-dragging .vertical-indicator {
	opacity: 0.7;
}
</style>
