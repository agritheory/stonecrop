<template>
	<div v-if="mode === 'display'" class="input-wrapper">
		<span class="aform_display-value">{{ search ?? '' }}</span>
		<label>{{ label }}</label>
	</div>
	<div v-else v-on-click-outside="onClickOutside" class="autocomplete" :class="{ isOpen: dropdown.open }">
		<div class="input-wrapper">
			<input
				v-model="search"
				type="text"
				:disabled="mode === 'read'"
				@input="filter"
				@focus="openDropdown"
				@keydown.down="selectNextResult"
				@keydown.up="selectPrevResult"
				@keydown.enter="setCurrentResult"
				@keydown.esc="onClickOutside"
				@keydown.tab="onClickOutside" />

			<ul v-show="dropdown.open" id="autocomplete-results" class="autocomplete-results">
				<li v-if="dropdown.loading" class="loading autocomplete-result">Loading results...</li>
				<li
					v-for="(result, i) in dropdown.results"
					v-else
					:key="result"
					class="autocomplete-result"
					:class="{ 'is-active': i === dropdown.activeItemIndex }"
					@click.stop="setResult(result)">
					{{ result }}
				</li>
			</ul>
			<label>{{ label }}</label>
		</div>
	</div>
</template>

<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { reactive, ref } from 'vue'

import type { ComponentProps } from '../../types'

const {
	label,
	options = [],
	isAsync = false,
	filterFunction = undefined,
	mode,
} = defineProps<
	ComponentProps & {
		options?: string[]
		isAsync?: boolean
		filterFunction?: (search: string) => string[] | Promise<string[]>
	}
>()
const search = defineModel<string>()

// tracks the last explicitly-committed value so outside-click reverts instead of clears
const committedValue = ref(search.value ?? '')

const dropdown = reactive({
	activeItemIndex: null as number | null,
	open: false,
	loading: false,
	results: options,
})

const onClickOutside = () => closeDropdown()

const filter = async () => {
	dropdown.open = true
	dropdown.activeItemIndex = null
	if (filterFunction) {
		if (isAsync) dropdown.loading = true
		try {
			const filteredResults = await filterFunction(search.value || '')
			dropdown.results = filteredResults || []
		} catch {
			dropdown.results = []
		} finally {
			if (isAsync) dropdown.loading = false
		}
	} else {
		filterResults()
	}
}

const setResult = (result: string) => {
	search.value = result
	committedValue.value = result
	closeDropdown(result)
}

const openDropdown = () => {
	const idx = options?.indexOf(search.value ?? '') ?? -1
	dropdown.activeItemIndex = isAsync ? null : idx >= 0 ? idx : null
	dropdown.open = true
	// TODO: this should probably call the async function if it's async
	dropdown.results = isAsync ? [] : options
}

const closeDropdown = (result?: string) => {
	dropdown.activeItemIndex = null
	dropdown.open = false
	if (!options?.includes(result || search.value || '')) {
		search.value = committedValue.value
	}
}

const filterResults = () => {
	if (!search.value) {
		dropdown.results = options
	} else {
		dropdown.results = options?.filter(item => item.toLowerCase().includes((search.value ?? '').toLowerCase()))
	}
}

const selectNextResult = () => {
	const resultsLength = dropdown.results?.length || 0
	if (dropdown.activeItemIndex != null) {
		const currentIndex = isNaN(dropdown.activeItemIndex) ? 0 : dropdown.activeItemIndex
		dropdown.activeItemIndex = (currentIndex + 1) % resultsLength
	} else {
		dropdown.activeItemIndex = 0
	}
}

const selectPrevResult = () => {
	const resultsLength = dropdown.results?.length || 0
	if (dropdown.activeItemIndex != null) {
		const currentIndex = isNaN(dropdown.activeItemIndex) ? 0 : dropdown.activeItemIndex
		if (currentIndex === 0) {
			dropdown.activeItemIndex = null
		} else {
			dropdown.activeItemIndex = currentIndex - 1
		}
	} else {
		dropdown.activeItemIndex = resultsLength - 1
	}
}

const setCurrentResult = () => {
	if (dropdown.results) {
		const currentIndex = dropdown.activeItemIndex || 0
		const result = dropdown.results[currentIndex]
		setResult(result)
	}
	dropdown.activeItemIndex = 0
}
</script>

<style scoped>
/* variables taken from here: https://github.com/frappe/frappe/blob/version-13/frappe/public/scss/common/awesomeplete.scss */
.autocomplete {
	position: relative;
}

.input-wrapper {
	border: 1px solid transparent;
	padding: 0rem;
	margin: 0rem;
	margin-right: 1ch;
}

input {
	width: calc(100% - 1ch);
	outline: 1px solid transparent;
	border: 1px solid var(--sc-input-border-color);
	padding: 1ch 0.5ch 0.5ch 1ch;
	margin: calc(1.15rem / 2) 0 0 0;
	min-height: 1.15rem;
	border-radius: 0.25rem;
	font-family: var(--sc-font-family);
}

input:focus {
	border: 1px solid var(--sc-input-active-border-color);
	border-radius: 0.25rem 0.25rem 0 0;
	border-bottom: none;
}

label {
	display: block;
	min-height: 1.15rem;
	padding: 0rem;
	margin: 0rem;
	border: 1px solid transparent;
	margin-bottom: 0.25rem;
	z-index: 0;
	font-size: 80%;
	position: absolute;
	background: white;
	margin: calc(-1.5rem - calc(2.15rem / 2)) 0 0 1ch;
	padding: 0 0.25ch 0 0.25ch;
}

.autocomplete-results {
	position: absolute;
	width: calc(100% - 1ch + 1.5px);
	z-index: 100;
	padding: 0;
	margin: 0;
	color: var(--sc-input-active-border-color);
	border: 1px solid var(--sc-input-active-border-color);
	border-radius: 0 0 0.25rem 0.25rem;
	border-top: none;
	background-color: #fff;
}

.autocomplete-result {
	list-style: none;
	text-align: left;
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
