<template>
	<div class="gantt-connection-overlay">
		<svg
			class="connection-svg"
			:style="{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				pointerEvents: 'none',
				zIndex: 1,
			}">
			<defs>
				<!-- Define arrowhead marker for connections -->
				<path id="arrowhead" d="M 0 -7 L 20 0 L 0 7Z" stroke="black" stroke-width="1" fill="currentColor"></path>
				<marker
					id="arrowhead-marker"
					markerWidth="10"
					markerHeight="7"
					refX="5"
					refY="3.5"
					orient="auto"
					markerUnits="strokeWidth">
					<polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
				</marker>
			</defs>

			<!-- Invisible wider path for easier double-click interaction -->
			<path
				v-for="connection in visibleConnections"
				:key="`${connection.id}-hitbox`"
				:d="getPathData(connection)"
				stroke="transparent"
				:stroke-width="(connection.style?.width || 2) + 10"
				fill="none"
				class="connection-hitbox"
				@dblclick="handleConnectionDelete(connection)" />

			<!-- Visible connection path -->
			<path
				v-for="connection in visibleConnections"
				:id="connection.id"
				:key="connection.id"
				:d="getPathData(connection)"
				:stroke="connection.style?.color || '#666'"
				:stroke-width="connection.style?.width || 2"
				fill="none"
				marker-mid="url(#arrowhead-marker)"
				class="connection-path animated-path"
				@dblclick="handleConnectionDelete(connection)" />
		</svg>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { createTableStore } from '../stores/table'
import type { ConnectionPath } from '../types'

const { store } = defineProps<{
	store: ReturnType<typeof createTableStore>
}>()

const emit = defineEmits<{
	'connection:delete': [connection: ConnectionPath]
}>()

const BEZIER_CURVE_FACTOR = 0.25 // Control point offset factor for bezier curves
const CONNECTION_HANDLE_SIZE = 16 // Width of the connection handles; this should match the handle size in the AGanttCell component

const visibleConnections = computed(() => {
	return store.connectionPaths.filter(connection => {
		const fromBar = store.ganttBars.find(bar => bar.id === connection.from.barId)
		const toBar = store.ganttBars.find(bar => bar.id === connection.to.barId)
		return fromBar && toBar
	})
})

const getPathData = (connection: ConnectionPath) => {
	const fromHandle = store.connectionHandles.find(
		handle => handle.barId === connection.from.barId && handle.side === connection.from.side
	)
	const toHandle = store.connectionHandles.find(
		handle => handle.barId === connection.to.barId && handle.side === connection.to.side
	)

	if (!fromHandle || !toHandle) return ''

	const fromX = fromHandle.position.x + CONNECTION_HANDLE_SIZE / 2 // Center of the handle
	const fromY = fromHandle.position.y + CONNECTION_HANDLE_SIZE / 2
	const toX = toHandle.position.x + CONNECTION_HANDLE_SIZE / 2
	const toY = toHandle.position.y + CONNECTION_HANDLE_SIZE / 2

	// Calculate control points for smooth bezier curve
	const deltaX = Math.abs(toX - fromX)
	const controlPointOffset = Math.max(deltaX * BEZIER_CURVE_FACTOR, 50) // Minimum offset for better curves
	const cp1X = fromX + (connection.from.side === 'left' ? -controlPointOffset : controlPointOffset)
	const cp2X = toX + (connection.to.side === 'left' ? -controlPointOffset : controlPointOffset)

	// Use cubic bezier curve for smooth connections

	//calculate the mid point of the curve
	const m0 = { x: 0.5 * fromX + 0.5 * cp1X, y: 0.5 * fromY + 0.5 * fromY }
	const m1 = { x: 0.5 * cp1X + 0.5 * cp2X, y: 0.5 * fromY + 0.5 * toY }
	const m2 = { x: 0.5 * cp2X + 0.5 * toX, y: 0.5 * toY + 0.5 * toY }
	const m3 = { x: 0.5 * m0.x + 0.5 * m1.x, y: 0.5 * m0.y + 0.5 * m1.y }
	const m4 = { x: 0.5 * m1.x + 0.5 * m2.x, y: 0.5 * m1.y + 0.5 * m2.y }
	const midpoint = { x: 0.5 * m3.x + 0.5 * m4.x, y: 0.5 * m3.y + 0.5 * m4.y }

	// Calculate the bezier curve using two arcs
	return `M ${fromX} ${fromY} Q ${cp1X} ${fromY}, ${midpoint.x} ${midpoint.y} Q ${cp2X} ${toY}, ${toX} ${toY}`
}

const handleConnectionDelete = (connection: ConnectionPath) => {
	if (store.deleteConnection(connection.id)) {
		emit('connection:delete', connection)
	}
}
</script>

<style scoped>
.gantt-connection-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 15;
}

.connection-path {
	transition: stroke-width 0.2s ease;
	pointer-events: auto;
	cursor: pointer;
	stroke-dasharray: 5px;
	stroke: var(--sc-cell-text-color);
}
#arrowhead-marker polygon {
	fill: var(--sc-cell-text-color);
}
.animated-path {
	animation: animated-dash infinite 1.5s linear;
}

.connection-path:hover {
	stroke-width: 3px;
}

.connection-hitbox {
	pointer-events: auto;
	cursor: pointer;
}
@keyframes animated-dash {
	0% {
		stroke-dashoffset: 0px;
	}
	100% {
		stroke-dashoffset: -10px;
	}
}
</style>
