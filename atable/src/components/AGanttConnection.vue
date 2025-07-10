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
				<marker
					id="arrowhead"
					markerWidth="10"
					markerHeight="7"
					refX="10"
					refY="3.5"
					orient="auto"
					markerUnits="strokeWidth">
					<polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
				</marker>
			</defs>

			<path
				v-for="connection in visibleConnections"
				:key="connection.id"
				:d="getPathData(connection)"
				:stroke="connection.style?.color || '#666'"
				:stroke-width="connection.style?.width || 2"
				fill="none"
				marker-end="url(#arrowhead)"
				class="connection-path" />
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

const BEZIER_CURVE_FACTOR = 0.5 // Control point offset factor for bezier curves
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
	return `M ${fromX} ${fromY} C ${cp1X} ${fromY}, ${cp2X} ${toY}, ${toX} ${toY}`
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
	z-index: 1;
}

.connection-path {
	transition: stroke-width 0.2s ease;
}

.connection-path:hover {
	stroke-width: 3px;
}
</style>
