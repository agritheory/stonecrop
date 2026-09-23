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
const { width: modalWidth } = useElementBounding(amodalRef)

const amodalStyles = computed((): StyleValue => {
	if (!(store.modal.height && store.modal.width && store.modal.left && store.modal.bottom)) return {}

	const cell = store.modal.cell
	if (!cell) return {}

	const container = cell.closest('.atable-container') ?? cell.closest('table')
	if (!(container instanceof HTMLElement)) return {}

	// Always open below the cell. Flipping above the field is a combobox anti-pattern here —
	// the calendar is taller than a row, so "fit in the table" put it over the value.
	const cellRect = cell.getBoundingClientRect()
	const containerRect = container.getBoundingClientRect()
	const modalY = cellRect.bottom - containerRect.top

	let modalX = cellRect.left - containerRect.left
	const maxWidth = container.clientWidth || containerRect.width
	if (modalWidth.value && modalX + modalWidth.value > maxWidth) {
		modalX = Math.max(0, maxWidth - modalWidth.value)
	}

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
