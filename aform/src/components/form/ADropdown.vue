<template>
	<div class="autocomplete" :class="{ isOpen: isOpen }" v-on-click-outside="onClickOutside">
		<div class="input-wrapper">
			<input
				type="text"
				@input="onChange"
				@focus="onFocus"
				v-model="search"
				@keydown.down="onArrowDown"
				@keydown.up="onArrowUp"
				@keydown.enter="onEnter"
				@keydown.esc="onClickOutside" />

			<ul id="autocomplete-results" v-show="isOpen" class="autocomplete-results">
				<li class="loading autocomplete-result" v-if="isLoading">Loading results...</li>
				<li
					v-else
					v-for="(result, i) in results"
					:key="i"
					@click.stop="setResult(result)"
					class="autocomplete-result"
					:class="{ 'is-active': i === activeItemIndex }">
					{{ result }}
				</li>
			</ul>
			<label>{{ label }}</label>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { vOnClickOutside } from '@vueuse/components'
const { label, items, isAsync, filterFunction } = defineProps<{
	label: string
	items?: string[]
	isAsync?: boolean
	filterFunction?: (search: string) => Promise<string[]>
}>()
const results = ref(items)
const search = defineModel<string>()
const isLoading = ref(false)
const activeItemIndex = ref<number | null>(null)
const isOpen = ref(false)

const onClickOutside = () => {
	closeResults()
	activeItemIndex.value = null
}

const onChange = async () => {
	isOpen.value = true
	if (filterFunction) {
		if (isAsync) isLoading.value = true
		try {
			const filteredResults = await filterFunction(search.value || '')
			results.value = filteredResults
		} catch {
			results.value = []
		} finally {
			if (isAsync) isLoading.value = false
		}
	} else {
		filterResults()
	}
}

const onFocus = () => {
	isOpen.value = true
	if (isAsync) {
		results.value = []
		activeItemIndex.value = null
	} else {
		results.value = items
		activeItemIndex.value = items?.indexOf(search.value || '') || null
	}
}

const setResult = (result: string) => {
	search.value = result
	closeResults(result)
}

const closeResults = (result?: string) => {
	isOpen.value = false
	if (!items?.includes(result || search.value || '')) {
		search.value = ''
	}
}

const filterResults = () => {
	if (!search.value) {
		results.value = items
	} else {
		results.value = items?.filter(item => item.toLowerCase().includes((search.value ?? '').toLowerCase()))
	}
}

const onArrowDown = () => {
	const resultsLength = results.value?.length || 0
	activeItemIndex.value = ((activeItemIndex.value ?? 0) + 1) % resultsLength
}

const onArrowUp = () => {
	const resultsLength = results.value?.length || 0
	activeItemIndex.value = ((activeItemIndex.value ?? 0) - 1 + resultsLength) % resultsLength
}

const onEnter = () => {
	if (results.value) {
		search.value = results.value[activeItemIndex.value || 0]
		closeResults(results.value[activeItemIndex.value || 0])
	}
	activeItemIndex.value = 0
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
	z-index: 2;
	font-size: 80%;
	position: absolute;
	background: white;
	margin: calc(-1.5rem - calc(2.15rem / 2)) 0 0 1ch;
	padding: 0 0.25ch 0 0.25ch;
}

.autocomplete-results {
	position: absolute;
	width: calc(100% - 1ch + 1.5px);
	z-index: 999;
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
