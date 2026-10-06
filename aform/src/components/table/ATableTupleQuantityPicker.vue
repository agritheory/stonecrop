<template>
	<div
		v-if="open"
		ref="panelRef"
		class="atable-tuple-picker-modal"
		tabindex="-1"
		v-on-click-outside="onClickOutside"
		@keydown="onKeydown"
		@focusout="onFocusOut">
		<ADropdownList
			:listbox-id="listboxId"
			ariaLabel="Unit of measure"
			:open="true"
			surface="cell-modal"
			:option-count="optionCount"
			:active-index="() => activeIndex">
			<li
				v-for="(uom, i) in uomOptions"
				:id="`${listboxId}-opt-${i}`"
				:key="uom"
				role="option"
				:aria-selected="uom === selectedUom"
				class="autocomplete-result"
				:class="{ 'is-active': i === activeIndex, 'is-selected': uom === selectedUom }"
				@mousedown.prevent="selectUom(uom)">
				{{ uom }}
			</li>
		</ADropdownList>
	</div>
</template>

<script setup lang="ts">
import { TABLE_TUPLE_QUANTITY_PICKER, type TableStore } from '@stonecrop/atable'
import { vOnClickOutside } from '@vueuse/components'
import { computed, useTemplateRef } from 'vue'

import type { QuantityOptions, QuantityValue } from '../../types'
import { patchQuantityUom } from '../../utils/quantityValue'
import { useTableModalDropdownList } from '../../composables/useTableModalDropdownList'
import ADropdownList from '../form/ADropdownList.vue'

const { store } = defineProps<{
	store: TableStore
}>()

const panelRef = useTemplateRef('panelRef')

const open = computed(() => !!store.modal.visible && store.modal.component === TABLE_TUPLE_QUANTITY_PICKER)
const colIndex = computed(() => store.modal.colIndex ?? 0)
const rowIndex = computed(() => store.modal.rowIndex ?? 0)
const column = computed(() => store.columns[colIndex.value])

const uomOptions = computed(() => (column.value?.options as QuantityOptions | undefined)?.uoms ?? [])
const cellValue = computed(() => store.getCellData(colIndex.value, rowIndex.value) as QuantityValue | null | undefined)
const selectedUom = computed(() => cellValue.value?.uom ?? '')

const listboxId = computed(() => `atable-tuple-qty-${rowIndex.value}-${colIndex.value}`)

const optionCount = () => uomOptions.value.length

const closePicker = () => store.closeTuplePicker()

const selectUom = (uom: string) => {
	const options = (column.value?.options ?? {}) as QuantityOptions
	store.setCellData(colIndex.value, rowIndex.value, patchQuantityUom(cellValue.value, uom, options))
	closePicker()
}

const { activeIndex, onKeydown, onClickOutside, onFocusOut } = useTableModalDropdownList({
	panelRef,
	isOpen: () => open.value,
	optionCount,
	selectAt: index => {
		const uom = uomOptions.value[index]
		if (uom !== undefined) selectUom(uom)
	},
	onClose: closePicker,
})
</script>

<style scoped>
.atable-tuple-picker-modal {
	box-sizing: border-box;
	width: 100%;
	min-width: 100%;
	outline: none;
}
</style>
