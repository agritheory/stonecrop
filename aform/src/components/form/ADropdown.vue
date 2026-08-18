<template>
	<div class="aform_form-element">
		<template v-if="mode === 'display'">
			<span v-if="badgeDescriptor" class="aform_display-value" :style="displayAccentStyle">{{
				badgeDescriptor.label
			}}</span>
			<span v-else class="aform_display-value">{{ search ?? '' }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<div v-on-click-outside="onClickOutside" class="autocomplete" :class="{ isOpen: dropdown.open }">
				<input
					v-model="search"
					type="text"
					class="aform_input-field"
					:disabled="mode === 'read'"
					:style="inputAccentStyle"
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
				<label class="aform_field-label">{{ label }}</label>
			</div>
			<p v-show="errorText" class="aform_error" v-html="errorText"></p>
		</template>
	</div>
</template>

<script setup lang="ts">
import type { FieldOptions } from '@stonecrop/schema'
import { selectChoices } from '@stonecrop/schema'
import { vOnClickOutside } from '@vueuse/components'
import { computed, reactive, ref, watch } from 'vue'

import type { ComponentProps } from '../../types'
import { badgeInputAccentStyle, resolveFieldBadge } from '../../utils/badge'

const {
	label,
	options = [],
	format,
	record,
	isAsync = false,
	filterFunction = undefined,
	mode,
	errors,
	validation = { errorMessage: '' },
} = defineProps<
	ComponentProps & {
		options?: FieldOptions
		format?: string
		record?: Record<string, unknown>
		isAsync?: boolean
		filterFunction?: (search: string) => string[] | Promise<string[]>
	}
>()

const choiceList = computed(() => selectChoices(options))

const badgeDescriptor = computed(() => resolveFieldBadge(search.value, options, format, { record, row: record }))

const inputAccentStyle = computed(() => badgeInputAccentStyle(badgeDescriptor.value))

const displayAccentStyle = computed(() => badgeInputAccentStyle(badgeDescriptor.value))

const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))
const search = defineModel<string>()

const committedValue = ref(search.value ?? '')

const dropdown = reactive({
	activeItemIndex: null as number | null,
	open: false,
	loading: false,
	results: [] as string[],
})

watch(
	choiceList,
	choices => {
		dropdown.results = choices
	},
	{ immediate: true }
)

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
	const idx = choiceList.value.indexOf(search.value ?? '')
	dropdown.activeItemIndex = isAsync ? null : idx >= 0 ? idx : null
	dropdown.open = true
	dropdown.results = isAsync ? [] : choiceList.value
}

const closeDropdown = (result?: string) => {
	dropdown.activeItemIndex = null
	dropdown.open = false
	if (!choiceList.value.includes(result || search.value || '')) {
		search.value = committedValue.value
	}
}

const filterResults = () => {
	if (!search.value) {
		dropdown.results = choiceList.value
	} else {
		dropdown.results = choiceList.value.filter(item => item.toLowerCase().includes((search.value ?? '').toLowerCase()))
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
.autocomplete {
	position: relative;
}

.autocomplete-results {
	position: absolute;
	left: 0;
	right: 0;
	z-index: 100;
	padding: 0;
	margin: 0;
	color: var(--sc-input-active-border-color);
	border: 1px solid var(--sc-input-active-border-color);
	border-radius: 0;
	border-top: none;
	background-color: var(--sc-input-field-background, #fff);
	list-style: none;
}

.autocomplete-result {
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
