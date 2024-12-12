<template>
	<div class="amodal" ref="amodal" tabindex="-1" @click="handleInput" @input="handleInput" :style="amodalStyles">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { useTemplateRef, computed } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { createTableStore } from '@/stores/table'

/* const { colIndex, rowIndex, store } = */ const props = defineProps<{
	colIndex?: number
	rowIndex?: number
	store?: ReturnType<typeof createTableStore>
	container?: HTMLElement
}>()

const amodalRef = useTemplateRef('amodal')
const { width, height } = useElementBounding(amodalRef)

const amodalStyles = computed(() => {
	//the modal usually will appear left align with and below the element it is associated with,
	//but needs to detect and adjust its position if it would overflow the rightr or bottom edges

	//get the dimensions of whatever container is holding this modal, e.g. Table, Window, div so the modal can detect edges
	const containerWidth = props.container ? props.container.offsetWidth : 0
	const containerHeight = props.container ? props.container.offsetHeight : 0

	//if this modal would go outside the edge of its container, instead place it above the element (Y) or along the right side (X)
	const modalLeft =
		props.store.modal.left + width.value > containerWidth
			? props.store.modal.left - (width.value - props.store.modal.width)
			: props.store.modal.left
	const modalTop =
		props.store.modal.top + height.value > containerHeight
			? props.store.modal.top - height.value - props.store.modal.height
			: props.store.modal.top

	return {
		left: modalLeft + 'px',
		top: modalTop + 'px',
	}
})

const handleInput = (event: Event) => {
	event.stopPropagation()
}
</script>

<style>
@import url('@stonecrop/themes/default.css');

.amodal {
	position: absolute;
	background-color: var(--sc-row-color-zebra-dark);
	z-index: 100;
}
</style>
