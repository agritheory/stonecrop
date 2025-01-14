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
const { y: scrollY } = useWindowScroll()

const amodalStyles = computed(() => {
	if (!(store.modal.height && store.modal.width && store.modal.left && store.modal.bottom)) return

	const body = document.body
	const html = document.documentElement

	const maxHeight = Math.max(
		body.scrollHeight,
		body.offsetHeight,
		html.clientHeight,
		html.scrollHeight,
		html.offsetHeight
	)
	const maxWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth)

	const modalY =
		store.modal.bottom + height.value + scrollY.value <= maxHeight
			? store.modal.bottom
			: store.modal.bottom - height.value - store.modal.height

	const modalX =
		store.modal.left + width.value <= maxWidth ? store.modal.left : store.modal.left - (width.value - store.modal.width)

	return {
		left: `${modalX}px`,
		top: `${modalY}px`,
	}
})

const handleInput = (event: Event) => {
	event.stopPropagation()
}
</script>

<style>
@import url('@stonecrop/themes/default.css');

.amodal {
	position: fixed;
	background-color: var(--sc-row-color-zebra-dark);
	z-index: 1000;
}
</style>
