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
				zIndex: 1
			}">
			<defs>
				<marker
					id="arrowhead"
					markerWidth="10"
					markerHeight="7"
					refX="9"
					refY="3.5"
					orient="auto">
					<polygon
						points="0 0, 10 3.5, 0 7"
						fill="currentColor" />
				</marker>
			</defs>

			<path
				v-for="connection in visibleConnections"
				:key="connection.id"
				:d="getPathData(connection)"
				:stroke="connection.style?.color || '#666'"
				:stroke-width="connection.style?.width || 2"
				:stroke-dasharray="connection.style?.dashArray"
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

const visibleConnections = computed(() => {
	return store.connectionPaths.filter(connection => {
		const fromBar = store.ganttBars.find(bar => bar.id === connection.from.barId)
		const toBar = store.ganttBars.find(bar => bar.id === connection.to.barId)
		return fromBar && toBar
	})
})

const getPathData = (connection: ConnectionPath) => {
	const fromBar = store.ganttBars.find(bar => bar.id === connection.from.barId)
	const toBar = store.ganttBars.find(bar => bar.id === connection.to.barId)

	if (!fromBar || !toBar) return ''

	// Get connection points based on handle sides
	const fromX = connection.from.side === 'left'
		? fromBar.position.x
		: fromBar.position.x + (fromBar.endIndex - fromBar.startIndex) * 40 // approximate column width
	const fromY = fromBar.position.y + 20 // center of bar height

	const toX = connection.to.side === 'left'
		? toBar.position.x
		: toBar.position.x + (toBar.endIndex - toBar.startIndex) * 40
	const toY = toBar.position.y + 20

	// Create a smooth curved path
	const controlPointOffset = Math.abs(toX - fromX) * 0.3
	const cp1X = fromX + (connection.from.side === 'left' ? -controlPointOffset : controlPointOffset)
	const cp2X = toX + (connection.to.side === 'left' ? -controlPointOffset : controlPointOffset)

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
