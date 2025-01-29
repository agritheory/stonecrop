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
	const maxHeight = table.offsetHeight || 0
	const maxWidth = table.offsetWidth || 0

	/* Get the Y position of the cell clicked by getting the cumulative height of prior rows + the header (if present) */

	let modalY = 0
	for (let j = 0; j < store.modal.rowIndex; j++) {
		modalY += table.rows[j].offsetHeight
	}
	const headerHeight = table.querySelector('thead').offsetHeight || 0
	modalY += headerHeight + store.modal.height
	modalY = modalY + height.value < maxHeight ? modalY : modalY - store.modal.height - height.value

	/* Get the X position of the cell clicked by getting the cumulative width of prior cells within the row */

	let modalX = 0

	const row = store.modal.cell.parentNode
	for (let i = 0; i < store.modal.cell.cellIndex; i++) {
		modalX += row.children[i].offsetWidth
	}

	modalX = modalX + width.value <= maxWidth ? modalX : modalX - (width.value - store.modal.width)

	return {
		left: `${modalX}px`,
		top: `${modalY}px`,
	}
})

const getTable = htmlElementNode => {
	//return the closest table ancestor to this element
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
