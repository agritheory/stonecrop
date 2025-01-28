<template>
	<div class="amodal" ref="amodal" tabindex="-1" @click="handleInput" @input="handleInput" :style="amodalStyles">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { useElementBounding, useWindowScroll } from '@vueuse/core'
import { useTemplateRef, computed } from 'vue'

import { createTableStore } from '../stores/table'

const { store } = defineProps<{ store: ReturnType<typeof createTableStore> }>()

const amodalRef = useTemplateRef('amodal')
const { width, height } = useElementBounding(amodalRef)

const amodalStyles = computed(() => {
	if (!(store.modal.height && store.modal.width && store.modal.left && store.modal.bottom)) return

	const table = getTable(store.modal.cell)
	const maxHeight = table.offsetHeight
	const maxWidth = table.offsetWidth

	/* Y Positioning */
	const headerHeight = table.querySelector('thead').offsetHeight //height of the header matches row height
	const offsetY = store.modal.rowIndex //offset for each table row adding one pixel to its position (probably something to do with border?)
	const cellY = (store.modal.rowIndex + 1) * store.modal.height // the y position of the cell clicked
	const modalY = cellY + headerHeight + offsetY
	const modalPositionY = modalY + height.value < maxHeight ? modalY : modalY - store.modal.height - height.value

	let modalX = 0

	//need to get the cumulative width of each cell that comes before this one
	const row = store.modal.cell.parentNode
	for (let i = 0; i < store.modal.cell.cellIndex; i++) {
		modalX += row.children[i].offsetWidth
	}

	const modalPositionX = modalX + width.value <= maxWidth ? modalX : modalX - (width.value - store.modal.width)

	return {
		left: `${modalPositionX}px`,
		top: `${modalPositionY}px`,
	}
})

const getTable = htmlElementNode => {
	while (htmlElementNode) {
		htmlElementNode = htmlElementNode.parentNode
		if (htmlElementNode.tagName.toLowerCase() === 'table') {
			return htmlElementNode
		}
	}
	return undefined
}

const handleInput = (event: Event) => {
	event.stopPropagation()
}
</script>

<style>
@import url('@stonecrop/themes/default.css');

.amodal {
	position: absolute;
	background-color: var(--sc-row-color-zebra-dark);
	z-index: 5;
}
</style>
