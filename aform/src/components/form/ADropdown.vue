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
					:id="uuid"
					v-model="search"
					type="text"
					role="combobox"
					autocomplete="off"
					aria-autocomplete="list"
					class="aform_input-field"
					:disabled="mode === 'read'"
					:style="inputAccentStyle"
					:aria-expanded="dropdown.open"
					:aria-controls="dropdown.open ? listboxId : undefined"
					:aria-activedescendant="
						dropdown.activeItemIndex === null ? undefined : `${listboxId}-opt-${dropdown.activeItemIndex}`
					"
					:aria-invalid="invalid"
					:aria-describedby="describedBy"
					@input="filter"
					@focus="openDropdown"
					@keydown.down.prevent="selectNextResult"
					@keydown.up.prevent="selectPrevResult"
					@keydown.enter.prevent="setCurrentResult"
					@keydown.esc="onClickOutside"
					@keydown.tab="onClickOutside" />

				<ul v-show="dropdown.open" :id="listboxId" class="autocomplete-results" role="listbox" :aria-label="label">
					<li v-if="dropdown.loading" class="loading autocomplete-result">Loading results...</li>
					<li
						v-for="(result, i) in dropdown.results"
						v-else
						:id="`${listboxId}-opt-${i}`"
						:key="result"
						role="option"
						:aria-selected="i === dropdown.activeItemIndex"
						class="autocomplete-result"
						:class="{ 'is-active': i === dropdown.activeItemIndex }"
						@mousedown.prevent="setResult(result)">
						{{ result }}
					</li>
				</ul>
				<label class="aform_field-label" :for="uuid">{{ label }}</label>
			</div>
			<p v-show="errorText" :id="errorId" class="aform_error" role="alert">{{ errorText }}</p>
		</template>
	</div>
</template>

<script setup lang="ts">
import type { FieldOptions } from '@stonecrop/schema'
import { selectChoices } from '@stonecrop/schema'
import { vOnClickOutside } from '@vueuse/components'
import { computed, reactive, ref, useId, watch } from 'vue'

import { fieldErrorA11y } from '../../composables/fieldErrorA11y'
import type { ComponentProps } from '../../types'
import type { BadgeFormatFn } from '../../utils/badge'
import { badgeInputAccentStyle, resolveFieldBadge } from '../../utils/badge'
import { deserializeFunction } from '../../utils/deserialize'

const {
	label,
	options = [],
	format,
	isAsync = false,
	filterFunction = undefined,
	mode,
	uuid,
	errors,
	validation = { errorMessage: '' },
} = defineProps<
	ComponentProps & {
		options?: FieldOptions
		format?: string
		isAsync?: boolean
		filterFunction?: (search: string) => string[] | Promise<string[]>
	}
>()

const listboxId = useId()

const choiceList = computed(() => selectChoices(options))

const formatFn = computed(() => (format ? deserializeFunction<BadgeFormatFn>(format) : undefined))

const badgeDescriptor = computed(() => resolveFieldBadge(search.value, options, formatFn.value))

const inputAccentStyle = computed(() => badgeInputAccentStyle(badgeDescriptor.value))

const displayAccentStyle = computed(() => badgeInputAccentStyle(badgeDescriptor.value))

const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))
const { errorId, describedBy, invalid } = fieldErrorA11y(uuid, errorText)
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
	border-radius: 0 0 var(--sc-border-radius) var(--sc-border-radius);
	border-top: none;
	background-color: var(--sc-overlay-background);
	list-style: none;
}

.autocomplete-result {
	text-align: left;
	padding: 4px 6px;
	cursor: pointer;
	border-bottom: 0.5px solid var(--sc-input-border-color);
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
	background-color: var(--sc-row-color-zebra-light);
	color: var(--sc-input-active-border-color);
}
</style>
