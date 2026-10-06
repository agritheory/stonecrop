<template>
	<div
		ref="shellRef"
		class="acell-shell amodal"
		tabindex="-1"
		:style="shellStyles"
		@click.stop
		@input.stop
		@mousedown.stop>
		<slot />
	</div>
</template>

<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { useTemplateRef, computed, type StyleValue } from 'vue'

import { computeCellOverlayStyle } from '../composables/cellOverlayPosition'
import { createTableStore } from '../stores/table'

const { store } = defineProps<{ store: ReturnType<typeof createTableStore> }>()

const shellRef = useTemplateRef('shellRef')
const { width: shellWidth } = useElementBounding(shellRef)

const shellStyles = computed((): StyleValue => {
	if (!(store.modal.height && store.modal.width && store.modal.left && store.modal.bottom)) return {}

	const cell = store.modal.cell
	if (!cell) return {}

	const cellWidth = cell.getBoundingClientRect().width

	return computeCellOverlayStyle({
		cell,
		overlayWidth: shellWidth.value,
		minWidth: cellWidth,
	})
})
</script>

<style>
.acell-shell,
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

.acell-shell:has(.atable-tuple-picker-modal),
.amodal:has(.atable-tuple-picker-modal) {
	margin-top: 0;
	padding: 0;
	border: none;
	background: transparent;
	align-self: stretch;
}
</style>
