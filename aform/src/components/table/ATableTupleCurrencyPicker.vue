<template>
	<div
		v-if="open"
		ref="panelRef"
		class="atable-tuple-picker-modal"
		tabindex="-1"
		v-on-click-outside="onClickOutside"
		@keydown="onKeydown">
		<ADropdownList
			:listbox-id="listboxId"
			ariaLabel="Currency"
			:open="true"
			surface="cell-modal"
			:option-count="optionCount"
			:active-index="() => activeIndex">
			<li v-if="loading" class="loading autocomplete-result">Loading…</li>
			<li
				v-for="(option, i) in currencyOptions"
				v-else-if="!loading"
				:id="`${listboxId}-opt-${i}`"
				:key="String(option.id)"
				role="option"
				:aria-selected="isSelected(option)"
				class="autocomplete-result"
				:class="{ 'is-active': i === activeIndex, 'is-selected': isSelected(option) }"
				@mousedown.prevent="selectCurrency(option)">
				{{ option.symbol ? `${option.symbol} — ` : '' }}{{ option.displayText ?? option.id }}
			</li>
		</ADropdownList>
	</div>
</template>

<script setup lang="ts">
import { TABLE_TUPLE_CURRENCY_PICKER, type createTableStore } from '@stonecrop/atable'
import { vOnClickOutside } from '@vueuse/components'
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'

import type { AFormLinkValue, CurrencyOptions, CurrencyValue } from '../../types'
import { deserializeFunction } from '../../utils/deserialize'
import { normalizeBaseCurrency, patchCurrencyCurrency, staticCurrencyChoices } from '../../utils/currencyValue'
import { useTableModalDropdownList } from '../../composables/useTableModalDropdownList'
import ADropdownList from '../form/ADropdownList.vue'

const { store } = defineProps<{
	store: ReturnType<typeof createTableStore>
}>()

const panelRef = useTemplateRef('panelRef')
const loading = ref(false)
const currencyOptions = ref<AFormLinkValue[]>([])

const open = computed(() => !!store.modal.visible && store.modal.component === TABLE_TUPLE_CURRENCY_PICKER)
const colIndex = computed(() => store.modal.colIndex ?? 0)
const rowIndex = computed(() => store.modal.rowIndex ?? 0)
const column = computed(() => store.columns[colIndex.value])
const currencyFieldOptions = computed(() => (column.value?.options ?? {}) as CurrencyOptions)
const cellValue = computed(() => store.getCellData(colIndex.value, rowIndex.value) as CurrencyValue | null | undefined)

const listboxId = computed(() => `atable-tuple-cur-${rowIndex.value}-${colIndex.value}`)

const isSelected = (option: AFormLinkValue) => String(option.id) === String(cellValue.value?.currency?.id)

const loadCurrencyOptions = async () => {
	const opts = currencyFieldOptions.value
	const filterFunction = opts.filterFunction
	if (filterFunction) {
		loading.value = true
		try {
			const fn =
				typeof filterFunction === 'string'
					? deserializeFunction<(search: string) => AFormLinkValue[] | Promise<AFormLinkValue[]>>(filterFunction)
					: filterFunction
			currencyOptions.value = (await fn('')) ?? []
		} catch {
			currencyOptions.value = []
		} finally {
			loading.value = false
		}
		return
	}
	currencyOptions.value = staticCurrencyChoices(opts, cellValue.value)
}

watch(open, visible => {
	if (visible) void loadCurrencyOptions()
})

onMounted(() => {
	if (open.value) void loadCurrencyOptions()
})

const optionCount = () => (loading.value ? 0 : currencyOptions.value.length)

const closePicker = () => store.closeTuplePicker()

const selectCurrency = (option: AFormLinkValue) => {
	const opts = currencyFieldOptions.value
	const base = normalizeBaseCurrency(opts, cellValue.value)
	store.setCellData(colIndex.value, rowIndex.value, patchCurrencyCurrency(cellValue.value, option, opts, base))
	closePicker()
}

const { activeIndex, onKeydown, onClickOutside } = useTableModalDropdownList({
	panelRef,
	isOpen: () => open.value,
	optionCount,
	selectAt: index => {
		const option = currencyOptions.value[index]
		if (option !== undefined) selectCurrency(option)
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
