<template>
	<div class="aform_form-element">
		<span v-if="mode === 'display'" class="aform_display-value">{{ displayedText }}</span>
		<template v-else>
			<div v-on-click-outside="onClickOutside" class="aform_form-link-wrapper">
				<div class="input-group">
					<input
						v-model="searchText"
						type="text"
						class="aform_input-field"
						:disabled="disabled || mode === 'read'"
						@input="onInput"
						@focus="onFocus"
						@keydown.down.prevent="selectNext"
						@keydown.up.prevent="selectPrev"
						@keydown.enter.prevent="selectCurrent"
						@keydown.esc="closeDropdown"
						@keydown.tab="closeDropdown" />
					<button
						v-if="hasValidId && !disabled"
						type="button"
						class="aform_form-btn"
						@click="handleNavigate"
						@keydown.enter.prevent="handleNavigate">
						<span>{{ icon === 'chevron-right' ? '›' : '→' }}</span>
					</button>
				</div>
				<ul v-if="dropdownOpen" class="autocomplete-results">
					<li v-if="loading" class="autocomplete-result loading">Loading…</li>
					<li
						v-for="(option, i) in dropdownResults"
						v-else
						:key="String(option.id)"
						class="autocomplete-result"
						:class="{ 'is-active': i === activeIndex }"
						@mousedown.prevent="selectOption(option)">
						{{ option.displayText ?? String(option.id) }}
					</li>
				</ul>
			</div>
			<label v-if="label" class="aform_field-label">{{ label }}</label>
		</template>
	</div>
</template>

<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { computed, inject, ref } from 'vue'

import type { AFormLinkNavigator, AFormLinkValue, ComponentProps } from '../../types'
import { deserializeFunction } from '../../utils/deserialize'

const {
	label,
	mode,
	doctype = undefined,
	formatter = undefined,
	icon = 'arrow-right',
	disabled = false,
	filterFunction = undefined,
	isAsync = false,
} = defineProps<
	ComponentProps & {
		doctype?: string
		formatter?: (value: AFormLinkValue) => string
		icon?: 'arrow-right' | 'chevron-right'
		disabled?: boolean
		filterFunction?: string | ((search: string) => AFormLinkValue[] | Promise<AFormLinkValue[]>)
		isAsync?: boolean
	}
>()

const modelValue = defineModel<AFormLinkValue>({ default: { id: '', displayText: '' } })

const hasValidId = computed(() => {
	const id = modelValue.value?.id
	return id !== null && id !== undefined && id !== ''
})

const displayedText = computed(() => {
	if (!hasValidId.value) return '—'
	if (formatter) return formatter(modelValue.value)
	return modelValue.value.displayText ?? String(modelValue.value.id)
})

const searchText = ref(hasValidId.value ? displayedText.value : '')
const dropdownOpen = ref(false)
const loading = ref(false)
const dropdownResults = ref<AFormLinkValue[]>([])
const activeIndex = ref<number | null>(null)

const navigator = inject<AFormLinkNavigator | null>('aformLinkNavigator', null)

const handleNavigate = () => {
	if (navigator && doctype) {
		navigator.navigate(doctype, modelValue.value.id)
	}
}

const openDropdown = async (text: string) => {
	if (!filterFunction || mode === 'read') return
	activeIndex.value = null
	dropdownOpen.value = true
	if (isAsync) loading.value = true
	try {
		type FilterFn = (search: string) => AFormLinkValue[] | Promise<AFormLinkValue[]>
		const fn: FilterFn =
			typeof filterFunction === 'string' ? deserializeFunction<FilterFn>(filterFunction) : filterFunction
		dropdownResults.value = (await fn(text)) ?? []
	} catch {
		dropdownResults.value = []
	} finally {
		loading.value = false
	}
}

const closeDropdown = () => {
	dropdownOpen.value = false
	activeIndex.value = null
	searchText.value = hasValidId.value ? displayedText.value : ''
}

const onClickOutside = () => {
	if (dropdownOpen.value) closeDropdown()
}

const onFocus = () => openDropdown(searchText.value)

const onInput = () => openDropdown(searchText.value)

const selectOption = (option: AFormLinkValue) => {
	modelValue.value = option
	searchText.value = option.displayText ?? String(option.id)
	dropdownOpen.value = false
	activeIndex.value = null
}

const selectNext = () => {
	const len = dropdownResults.value.length
	if (!len) return
	activeIndex.value = activeIndex.value === null ? 0 : (activeIndex.value + 1) % len
}

const selectPrev = () => {
	const len = dropdownResults.value.length
	if (!len) return
	if (activeIndex.value === null || activeIndex.value === 0) {
		activeIndex.value = null
	} else {
		activeIndex.value -= 1
	}
}

const selectCurrent = () => {
	if (activeIndex.value !== null && dropdownResults.value[activeIndex.value]) {
		selectOption(dropdownResults.value[activeIndex.value])
	}
}
</script>

<style scoped>
.aform_form-link-wrapper {
	position: relative;
}

.input-group {
	display: flex;
	align-items: stretch;
}

.aform_input-field {
	flex: 1;
	min-width: 0;
}

/* Give the button the same outline as the input, then slide it 2px left so the outlines
   overlap exactly at the join: input right outline sits at (input_right - 1px),
   button left outline also sits at (button_left + 1px) = (input_right - 2px + 1px) = same pixel. */
.aform_form-btn {
	appearance: none;
	border: none;
	outline: 1px solid var(--sc-input-border-color);
	outline-offset: -1px;
	margin-left: -2px;
	background: var(--sc-input-field-background, white);
	padding: 0 0.75rem;
	cursor: pointer;
}

.aform_form-btn:focus,
.input-group:focus-within .aform_form-btn {
	outline-color: var(--sc-input-active-border-color);
}

.autocomplete-results {
	position: absolute;
	width: 100%;
	z-index: 100;
	padding: 0;
	margin: 0;
	list-style: none;
	border: 1px solid var(--sc-input-active-border-color);
	border-top: none;
	border-radius: 0 0 0.25rem 0.25rem;
	background: #fff;
}

.autocomplete-result {
	padding: 4px 6px;
	cursor: pointer;
	border-bottom: 0.5px solid lightgray;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
	background-color: var(--sc-row-color-zebra-light);
	color: var(--sc-input-active-border-color);
}
</style>
