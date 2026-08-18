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
	if (!(store.modal.height && store.modal.width && store.modal.left && store.modal.bottom)) return {}

	const cell = store.modal.cell
	if (!cell) return {}

	const container = cell.closest('.atable-container') ?? cell.closest('table')
	if (!container) return {}

	const cellRect = typeof cell.getBoundingClientRect === 'function' ? cell.getBoundingClientRect() : null
	const containerRect = typeof container.getBoundingClientRect === 'function' ? container.getBoundingClientRect() : null
	const hasLayout =
		cellRect &&
		containerRect &&
		(cellRect.width > 0 || cellRect.height > 0 || containerRect.width > 0 || containerRect.height > 0)

	if (hasLayout) {
		let modalX = cellRect.left - containerRect.left
		const modalY = cellRect.bottom - containerRect.top
		const maxWidth = container.clientWidth || container.offsetWidth || containerRect.width
		if (modalWidth.value && modalX + modalWidth.value > maxWidth) {
			modalX = Math.max(0, maxWidth - modalWidth.value)
		}
		return {
			left: `${modalX}px`,
			top: `${modalY}px`,
		}
	}

	// Always open below the cell. Flipping above the field is a combobox anti-pattern here —
	// the calendar is taller than a row, so "fit in the table" put it over the value.
	const headerHeight = container.querySelector('thead')?.offsetHeight || 0
	const modalY = (cell.offsetTop || 0) + headerHeight + store.modal.height

	let modalX = cell.offsetLeft || 0
	const maxWidth = container.offsetWidth || 0
	modalX = modalX + modalWidth.value <= maxWidth ? modalX : modalX - (modalWidth.value - store.modal.width)

	return {
		left: `${modalX}px`,
		top: `${modalY}px`,
	}
})
</script>

<style>
.amodal {
	position: absolute;
	width: max-content;
	max-width: 100%;
	box-sizing: border-box;
	margin-top: 0.25rem;
	padding: 10px;
	border: 1px solid var(--sc-input-border-color);
	background: var(--sc-input-field-background);
	z-index: 200;
}
</style>
