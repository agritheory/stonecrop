<template>
	<div ref="amodal" class="amodal" tabindex="-1" :style="amodalStyles" @click.stop @input.stop>
		<slot />
	</div>
</template>

<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { useTemplateRef, computed, type StyleValue } from 'vue'

import { createTableStore } from '../stores/table'

const { store } = defineProps<{ store: ReturnType<typeof createTableStore> }>()

const amodalRef = useTemplateRef('amodal')
const { width: modalWidth, height: modalHeight } = useElementBounding(amodalRef)

const amodalStyles = computed((): StyleValue => {
	if (!(store.modal.height && store.modal.width && store.modal.left && store.modal.bottom)) return

	const table = store.modal.cell?.closest('table')
	if (!table) return {}

	const maxHeight = table.offsetHeight || 0
	const maxWidth = table.offsetWidth || 0

	// Get the Y position of the cell clicked by getting the cumulative height of prior rows + the header (if present)
	let modalY = store.modal.cell?.offsetTop || 0
	const headerHeight = table.querySelector('thead')?.offsetHeight || 0
	modalY += headerHeight
	// if the modal will overflow the bottom of the table, remove modal and cell heights from the Y position
	modalY = modalY + modalHeight.value < maxHeight ? modalY : modalY - (modalHeight.value + store.modal.height)

	// Get the X position of the cell clicked by getting the cumulative width of prior cells within the row
	let modalX = store.modal.cell?.offsetLeft || 0
	// if the modal will overflow the right of the table, remove modal and cell widths from the X position
	modalX = modalX + modalWidth.value <= maxWidth ? modalX : modalX - (modalWidth.value - store.modal.width)

	return {
		left: `${modalX}px`,
		top: `${modalY}px`,
	}
})
</script>

<style>
@import url('@stonecrop/themes/default.css');

.amodal {
	position: absolute;
	background-color: var(--sc-row-color-zebra-dark);
	z-index: 200;
}
</style>
