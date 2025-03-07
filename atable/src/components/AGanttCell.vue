<template>
	<td class="aganttcell" :colspan="colspan">
		<div ref="container" class="gantt-handler">
			<!-- Draggable gantt bar -->
			<div
				ref="bar"
				class="gantt-bar"
				:class="{ 'is-dragging': isBarDragging || isLeftDragging || isRightDragging }"
				:style="barStyle">
				<!-- Left resizer handle -->
				<div ref="leftHandle" class="gantt-handle left-handle" :class="{ 'is-dragging': isLeftDragging }">
					<div class="handle-grip"></div>
					<div class="vertical-indicator left-indicator"></div>
				</div>

				<label v-if="label" class="gantt-label">{{ label }}</label>

				<!-- Right resizer handle -->
				<div ref="rightHandle" class="gantt-handle right-handle" :class="{ 'is-dragging': isRightDragging }">
					<div class="handle-grip"></div>
					<div class="vertical-indicator right-indicator"></div>
				</div>
			</div>
		</div>
	</td>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef, onMounted } from 'vue'
import { useDraggable, useElementBounding } from '@vueuse/core'

const {
	start,
	end,
	colspan = 1,
	label,
	color,
} = defineProps<{
	start?: number
	end?: number
	colspan?: number
	label?: string
	color: string
}>()

const baseColor = ref()

onMounted(() => {
	if (color == '' || color.length < 6) {
		baseColor.value = '#cccccc'
	} else {
		baseColor.value = color
	}
})

const emit = defineEmits<{
	'update:start': [value: number]
	'update:end': [value: number]
	drag: [{ type: 'bar'; start: number; end: number } | { type: 'resize'; edge: 'start' | 'end'; value: number }]
}>()

const containerRef = useTemplateRef('container')
const barRef = useTemplateRef('bar')
const leftHandleRef = useTemplateRef('leftHandle')
const rightHandleRef = useTemplateRef('rightHandle')

const { width: totalBarWidth } = useElementBounding(containerRef)
const { left: barLeft, right: barRight } = useElementBounding(barRef)
const currentStart = ref(start || 1)
const currentEnd = ref(end || 4)
// const currentEnd = ref(end || colspan)

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

const { isDragging: isLeftDragging } = useDraggable(leftHandleRef, {
	exact: true,
	axis: 'x',
	onEnd: ({ x }) => {
		const deltaColumns = Math.floor((x - barLeft.value) / pixelsPerColumn.value)
		const newStart = Math.max(0, Math.min(currentEnd.value - 1, currentStart.value + deltaColumns))
		currentStart.value = newStart
		emit('update:start', newStart)
		emit('drag', { type: 'resize', edge: 'start', value: newStart })
	},
})

const { isDragging: isRightDragging } = useDraggable(rightHandleRef, {
	exact: true,
	axis: 'x',
	onEnd: ({ x }) => {
		const deltaColumns = Math.floor((x - barRight.value) / pixelsPerColumn.value)
		const newEnd = Math.max(currentStart.value + 1, Math.min(colspan, currentEnd.value + deltaColumns))
		currentEnd.value = newEnd
		emit('update:end', newEnd)
		emit('drag', { type: 'resize', edge: 'end', value: newEnd })
	},
})

// Make the bar draggable
const { isDragging: isBarDragging } = useDraggable(barRef, {
	exact: true,
	axis: 'x',
	preventDefault: isLeftDragging.value || isRightDragging.value,
	onEnd: ({ x }) => {
		const deltaColumns = Math.floor((x - barLeft.value) / pixelsPerColumn.value)
		const barWidth = currentEnd.value - currentStart.value
		let newStart = currentStart.value + deltaColumns
		let newEnd = currentEnd.value + deltaColumns

		if (newStart < 0) {
			newStart = 0
			newEnd = barWidth
		} else if (newEnd > colspan) {
			newEnd = colspan
			newStart = newEnd - barWidth
		}

		currentStart.value = newStart
		currentEnd.value = newEnd
		emit('update:start', newStart)
		emit('update:end', newEnd)
		emit('drag', { type: 'bar', start: newStart, end: newEnd })
	},
})
</script>

<style scoped>
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
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: grab;
	box-sizing: border-box;
	border: 1px solid rgba(0, 0, 0, 0.5);
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

.gantt-handle {
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

.left-handle {
	border-right: 1px solid rgba(0, 0, 0, 0.5);
}
.right-handle {
	border-left: 1px solid rgba(0, 0, 0, 0.5);
}

.handle-grip {
	width: 4px;
	height: 12px;
	border-radius: 2px;
	background: rgba(0, 0, 0, 0.8);
}

.gantt-handle:hover {
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

/* Show indicators when handles are being dragged */
.gantt-handle.is-dragging .vertical-indicator {
	opacity: 0.7;
}
</style>
