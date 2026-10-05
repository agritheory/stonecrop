<template>
	<ul
		v-show="open"
		:id="listboxId"
		ref="root"
		class="autocomplete-results"
		:class="{ 'autocomplete-results--anchor-group': listAnchor === 'group' }"
		role="listbox"
		:aria-label="ariaLabel">
		<slot />
	</ul>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'

import { fitDropdownList } from '../../composables/dropdownList'

const {
	listboxId,
	ariaLabel,
	open,
	listAnchor = 'field',
	optionCount,
	activeIndex,
} = defineProps<{
	listboxId: string
	ariaLabel: string
	open: boolean
	listAnchor?: 'field' | 'group'
	optionCount: () => number
	activeIndex: () => number | null
}>()

const root = useTemplateRef<HTMLElement>('root')

fitDropdownList(root, {
	isOpen: () => open,
	optionCount,
	activeIndex,
})

defineExpose({ root })
</script>

<style scoped>
.autocomplete-results {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	z-index: 100;
	box-sizing: border-box;
	padding: 0;
	margin: 0;
	color: var(--sc-cell-text-color);
	border: 1px solid var(--sc-row-border-color);
	border-radius: 0 0 var(--sc-border-radius) var(--sc-border-radius);
	border-top: none;
	border-left: none;
	background-color: var(--sc-overlay-background);
	box-shadow: var(--sc-overlay-shadow);
	list-style: none;
	max-height: var(--sc-dropdown-max-height);
	overflow-y: auto;
}

.autocomplete-results--anchor-group {
	left: -1px;
	right: -1px;
	width: auto;
	min-width: unset;
	max-width: none;
}

/* :deep — option rows are slotted from ADropdown / AFormLink; scoped rules do not reach them otherwise. */
.autocomplete-results :deep(.autocomplete-result) {
	text-align: left;
	box-sizing: border-box;
	border-left: 2px solid transparent;
	padding: 0.35rem 0.75ch 0.35rem 0.25ch;
	cursor: pointer;
	color: var(--sc-cell-text-color);
}

.autocomplete-results :deep(.autocomplete-result:hover),
.autocomplete-results :deep(.autocomplete-result.is-active) {
	background-color: var(--sc-dropdown-option-hover-background);
	color: var(--sc-cell-text-color);
}

/* Committed value (v-model): one 2px bar (ATable uses 4px on row cells; no stacked list + inset). */
.autocomplete-results :deep(.autocomplete-result.is-selected) {
	border-left-color: var(--sc-dropdown-option-selected-accent);
}
</style>
