<template>
	<div
		:class="[
			'aform_form-element',
			{ 'aform_form-element--embedded': embedded, 'aform_dropdown--anchor-group': listAnchor === 'group' },
		]">
		<template v-if="mode === 'display'">
			<span v-if="!linkPicker && badgeDescriptor" class="aform_display-value" :style="displayAccentStyle">{{
				badgeDescriptor.label
			}}</span>
			<span v-else-if="!linkPicker" class="aform_display-value">{{ search ?? '' }}</span>
			<span v-else class="aform_display-value">{{ linkDisplayedText }}</span>
			<label v-if="label && !embedded" class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<div v-on-click-outside="onClickOutside" class="autocomplete" :class="{ isOpen: dropdown.open }">
				<button
					v-if="trigger === 'button'"
					:id="uuid"
					type="button"
					class="aform_dropdown-button"
					:disabled="mode === 'read'"
					:required="required"
					:aria-label="ariaLabel ?? label"
					aria-haspopup="listbox"
					:aria-expanded="dropdown.open"
					:aria-controls="dropdown.open ? listboxId : undefined"
					:aria-activedescendant="
						dropdown.open && dropdown.activeItemIndex !== null
							? `${listboxId}-opt-${dropdown.activeItemIndex}`
							: undefined
					"
					@click="toggleButtonDropdown"
					@keydown.down.prevent="selectNextResult"
					@keydown.up.prevent="selectPrevResult"
					@keydown.enter.prevent="setCurrentResult"
					@keydown.esc="onClickOutside">
					<span class="aform_dropdown-button-value">{{ search || placeholder || '' }}</span>
					<span class="aform_dropdown-button-caret" aria-hidden="true"></span>
				</button>
				<input
					v-else
					:id="uuid"
					v-model="search"
					type="text"
					role="combobox"
					autocomplete="off"
					aria-autocomplete="list"
					:class="['aform_input-field', { 'aform_input-field--embedded': embedded }]"
					:disabled="mode === 'read'"
					:required="required"
					:placeholder="placeholder"
					:size="embeddedLinkInputSize"
					:aria-label="ariaLabel"
					:style="inputAccentStyle"
					:aria-expanded="dropdown.open"
					:aria-controls="dropdown.open ? listboxId : undefined"
					:aria-activedescendant="
						dropdown.activeItemIndex === null ? undefined : `${listboxId}-opt-${dropdown.activeItemIndex}`
					"
					:aria-invalid="invalid"
					:aria-describedby="describedBy"
					@input="onComboboxInput"
					@focus="onComboboxFocus"
					@click="onEmbeddedComboboxClick"
					@pointerdown="onEmbeddedComboboxPointerDown"
					@keydown.down.prevent="selectNextResult"
					@keydown.up.prevent="selectPrevResult"
					@keydown.enter.prevent="setCurrentResult"
					@keydown.esc="onClickOutside"
					@keydown.tab="onClickOutside" />

				<ADropdownList
					:listbox-id="listboxId"
					:ariaLabel="ariaLabel ?? label ?? ''"
					:open="dropdown.open"
					:list-anchor="listAnchor"
					:option-count="optionCount"
					:active-index="() => dropdown.activeItemIndex">
					<li v-if="dropdown.loading" class="loading autocomplete-result">Loading results...</li>
					<template v-else-if="linkPicker">
						<li
							v-for="(option, i) in linkResults"
							:id="`${listboxId}-opt-${i}`"
							:key="String(option.id)"
							role="option"
							:aria-selected="isLinkOptionSelected(option)"
							class="autocomplete-result"
							:class="{
								'is-active': i === dropdown.activeItemIndex,
								'is-selected': isLinkOptionSelected(option),
							}"
							@mousedown.prevent="selectLinkOption(option)"
							@mouseenter="dropdown.activeItemIndex = i">
							<slot name="option" :option="option">{{ option.displayText ?? String(option.id) }}</slot>
						</li>
					</template>
					<template v-else>
						<li
							v-for="(result, i) in dropdown.results"
							:id="`${listboxId}-opt-${i}`"
							:key="result"
							role="option"
							:aria-selected="isChoiceSelected(result)"
							class="autocomplete-result"
							:class="{
								'is-active': i === dropdown.activeItemIndex,
								'is-selected': isChoiceSelected(result),
							}"
							@mousedown.prevent="setChoiceResult(result)"
							@mouseenter="dropdown.activeItemIndex = i">
							{{ result }}
						</li>
					</template>
				</ADropdownList>
				<label v-if="label && !embedded" class="aform_field-label" :for="uuid">{{ label }}</label>
			</div>
			<p v-if="!embedded" v-show="errorText" :id="errorId" class="aform_error" role="alert">{{ errorText }}</p>
		</template>
	</div>
</template>

<script setup lang="ts">
import type { FieldOptions } from '@stonecrop/schema'
import { selectChoices } from '@stonecrop/schema'
import { vOnClickOutside } from '@vueuse/components'
import { computed, inject, reactive, ref, useId, watch } from 'vue'

import { fieldErrorA11y } from '../../composables/fieldErrorA11y'
import type { AFormLinkModelValue, AFormLinkValue, ComponentProps } from '../../types'
import type { BadgeFormatFn } from '../../utils/badge'
import { badgeInputAccentStyle, resolveFieldBadge } from '../../utils/badge'
import { deserializeFunction } from '../../utils/deserialize'
import { asLinkValue, linkDisplayText, linkId } from '../../utils/linkValue'
import ADropdownList from './ADropdownList.vue'

const {
	label,
	required,
	options = [],
	format,
	isAsync = false,
	filterFunction = undefined,
	linkFilterFunction = undefined,
	formatter = undefined,
	doctype = undefined,
	mode,
	uuid,
	errors,
	validation = { errorMessage: '' },
	embedded = false,
	trigger = 'combobox',
	listAnchor = 'field',
	placeholder = undefined,
	ariaLabel = undefined,
} = defineProps<
	ComponentProps & {
		options?: FieldOptions
		format?: string
		isAsync?: boolean
		filterFunction?: (search: string) => string[] | Promise<string[]>
		/** When set, the picker searches link records and binds an `AFormLinkValue` (embedded currency, etc.). */
		linkFilterFunction?: string | ((search: string) => AFormLinkValue[] | Promise<AFormLinkValue[]>)
		formatter?: (value: AFormLinkValue) => string
		doctype?: string
		embedded?: boolean
		trigger?: 'combobox' | 'button'
		listAnchor?: 'field' | 'group'
		placeholder?: string
		ariaLabel?: string
	}
>()

const emit = defineEmits<{
	'update:open': [open: boolean]
}>()

const linkPicker = computed(() => linkFilterFunction !== undefined)

const listboxId = uuid ?? `aform-dropdown-${useId()}-listbox`

const choiceList = computed(() => selectChoices(options))

const formatFn = computed(() => (format ? deserializeFunction<BadgeFormatFn>(format) : undefined))

const badgeDescriptor = computed(() =>
	linkPicker.value ? null : resolveFieldBadge(search.value, options, formatFn.value)
)

const inputAccentStyle = computed(() => badgeInputAccentStyle(badgeDescriptor.value ?? undefined))

const displayAccentStyle = computed(() => badgeInputAccentStyle(badgeDescriptor.value ?? undefined))

const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))
const { errorId, describedBy, invalid } = fieldErrorA11y(uuid, errorText)

const modelValue = defineModel<string>()
const linkModel = defineModel<AFormLinkModelValue>('linkValue')

type FilterFn = (search: string) => AFormLinkValue[] | Promise<AFormLinkValue[]>
type ResolverFn = (doctype: string, id: string) => string | undefined | Promise<string | undefined>

const resolver = inject<ResolverFn | null>('aformLinkResolver', null)

const dropdown = reactive({
	activeItemIndex: null as number | null,
	open: false,
	loading: false,
	results: [] as string[],
})

watch(
	() => dropdown.open,
	open => emit('update:open', open)
)

const linkResults = ref<AFormLinkValue[]>([])

const optionCount = () => (linkPicker.value ? linkResults.value.length : dropdown.results.length)

const committedValue = ref(modelValue.value ?? '')

const linkDisplayedText = computed(() => {
	const id = linkId(linkModel.value)
	if (id === undefined) return '—'
	if (formatter) return formatter(asLinkValue(linkModel.value))
	return linkDisplayText(linkModel.value) ?? id
})

const search = ref('')

watch(
	modelValue,
	value => {
		if (linkPicker.value) return
		const next = value ?? ''
		search.value = next
		if (next === '' || choiceList.value.includes(next)) committedValue.value = next
	},
	{ immediate: true }
)

watch(
	() => linkModel.value,
	value => {
		if (!linkPicker.value) return
		const id = linkId(value)
		search.value = id ? (formatter ? formatter(asLinkValue(value)) : (linkDisplayText(value) ?? id)) : ''
	},
	{ immediate: true }
)

watch(
	() => (linkPicker.value ? linkId(linkModel.value) : undefined),
	async id => {
		if (!linkPicker.value || !id) return
		if (linkDisplayText(linkModel.value)) {
			search.value = formatter ? formatter(asLinkValue(linkModel.value)) : linkDisplayedText.value
			return
		}
		try {
			let match: AFormLinkValue | undefined
			let displayText: string | undefined
			if (linkFilterFunction) {
				const fn: FilterFn =
					typeof linkFilterFunction === 'string'
						? deserializeFunction<FilterFn>(linkFilterFunction)
						: linkFilterFunction
				const results = await fn(String(id))
				match = results.find(r => String(r.id) === String(id))
				displayText = match?.displayText
			} else if (resolver && doctype) {
				displayText = (await resolver(doctype, id.toString())) ?? undefined
			}
			if (displayText) {
				const resolved: AFormLinkValue = { ...asLinkValue(linkModel.value), ...match, id, displayText }
				search.value = formatter ? formatter(resolved) : displayText
				linkModel.value = resolved
			}
		} catch {
			// fall back to raw id in the input
		}
	},
	{ immediate: true }
)

const onClickOutside = () => closeDropdown()

const isChoiceSelected = (result: string) => !!result && result === (modelValue.value ?? '')

const isLinkOptionSelected = (option: AFormLinkValue) => {
	const id = linkId(linkModel.value)
	return id !== undefined && String(option.id) === String(id)
}

const embeddedLinkDisplayText = computed(() => {
	if (!embedded || !linkPicker.value) return ''
	const id = linkId(linkModel.value)
	if (!id) return placeholder ?? ''
	const value = asLinkValue(linkModel.value)
	return formatter ? formatter(value) : (linkDisplayText(linkModel.value) ?? String(id))
})

const embeddedLinkInputSize = computed(() => {
	if (!embedded || !linkPicker.value) return undefined
	const text = embeddedLinkDisplayText.value
	const length = text.length > 0 ? text.length : (placeholder ?? '').length
	return length > 0 ? length : undefined
})

const filterResults = () => {
	if (!search.value) {
		dropdown.results = choiceList.value
	} else {
		dropdown.results = choiceList.value.filter(item => item.toLowerCase().includes((search.value ?? '').toLowerCase()))
	}
}

const openLinkDropdown = async (text: string) => {
	if (!linkFilterFunction || mode === 'read') return
	dropdown.activeItemIndex = null
	dropdown.open = true
	if (isAsync) dropdown.loading = true
	try {
		const fn: FilterFn =
			typeof linkFilterFunction === 'string' ? deserializeFunction<FilterFn>(linkFilterFunction) : linkFilterFunction
		linkResults.value = (await fn(text)) ?? []
	} catch {
		linkResults.value = []
	} finally {
		dropdown.loading = false
	}
}

const embeddedLinkFilterQuery = (): string => {
	if (!embedded || !linkPicker.value) return search.value
	const id = linkId(linkModel.value)
	if (id && formatter) {
		const formatted = formatter(asLinkValue(linkModel.value))
		if (search.value === formatted) return ''
	}
	return search.value
}

const openEmbeddedList = () => {
	if (linkPicker.value) openLinkDropdown(embeddedLinkFilterQuery())
}

defineExpose({ openCurrencyList: openEmbeddedList })

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

const setChoiceResult = (result: string) => {
	modelValue.value = result
	search.value = result
	committedValue.value = result
	closeDropdown(result)
}

const selectLinkOption = (option: AFormLinkValue) => {
	linkModel.value = option
	search.value = formatter ? formatter(option) : (option.displayText ?? String(option.id))
	dropdown.open = false
	dropdown.activeItemIndex = null
}

const openChoiceDropdown = () => {
	const idx = choiceList.value.indexOf(search.value ?? '')
	dropdown.activeItemIndex = isAsync ? null : idx >= 0 ? idx : null
	dropdown.open = true
	dropdown.results = isAsync ? [] : choiceList.value
}

const closeDropdown = (result?: string) => {
	dropdown.activeItemIndex = null
	dropdown.open = false
	if (linkPicker.value) {
		const id = linkId(linkModel.value)
		search.value = id
			? formatter
				? formatter(asLinkValue(linkModel.value))
				: (linkDisplayText(linkModel.value) ?? id)
			: ''
		return
	}
	const typed = result || search.value || ''
	if (choiceList.value.includes(typed)) {
		// A choice typed out in full is picked, as if from the list. A pick from the list has already been sent.
		if (typed !== committedValue.value) {
			modelValue.value = typed
			committedValue.value = typed
		}
	} else {
		search.value = committedValue.value
		modelValue.value = committedValue.value
	}
}

const toggleButtonDropdown = () => {
	if (dropdown.open) closeDropdown()
	else openChoiceDropdown()
}

const onComboboxInput = () => {
	if (linkPicker.value) openLinkDropdown(embedded ? embeddedLinkFilterQuery() : search.value)
	else {
		// Typing searches the choices; the record changes only when one is picked, or when the box is cleared.
		if (search.value === '') {
			modelValue.value = ''
			committedValue.value = ''
		}
		filter()
	}
}

const onComboboxFocus = (event: FocusEvent) => {
	if (linkPicker.value && embedded) {
		openEmbeddedList()
		const input = event.target as HTMLInputElement | null
		if (input) requestAnimationFrame(() => input.select())
		return
	}
	if (linkPicker.value) openLinkDropdown(search.value)
	else openChoiceDropdown()
}

const onEmbeddedComboboxClick = () => {
	if (embedded && linkPicker.value) openEmbeddedList()
}

const onEmbeddedComboboxPointerDown = () => {
	if (embedded && linkPicker.value) openEmbeddedList()
}

watch(
	choiceList,
	choices => {
		if (!linkPicker.value) dropdown.results = choices
	},
	{ immediate: true }
)

const ensureDropdownOpen = () => {
	if (dropdown.open) return
	if (linkPicker.value) {
		if (embedded) openEmbeddedList()
		else void openLinkDropdown(search.value)
	} else {
		openChoiceDropdown()
	}
}

const selectNextResult = () => {
	const resultsLength = optionCount()
	if (!resultsLength) return
	const wasOpen = dropdown.open
	ensureDropdownOpen()
	if (!wasOpen) {
		if (dropdown.activeItemIndex === null && !isAsync) {
			const idx = choiceList.value.indexOf(search.value ?? '')
			dropdown.activeItemIndex = idx >= 0 ? idx : 0
		}
		return
	}
	if (dropdown.activeItemIndex != null) {
		const currentIndex = isNaN(dropdown.activeItemIndex) ? 0 : dropdown.activeItemIndex
		dropdown.activeItemIndex = (currentIndex + 1) % resultsLength
	} else {
		dropdown.activeItemIndex = 0
	}
}

const selectPrevResult = () => {
	const resultsLength = optionCount()
	if (!resultsLength) return
	ensureDropdownOpen()
	if (dropdown.activeItemIndex != null) {
		const currentIndex = isNaN(dropdown.activeItemIndex) ? 0 : dropdown.activeItemIndex
		if (currentIndex === 0) {
			dropdown.activeItemIndex = trigger === 'button' ? resultsLength - 1 : null
		} else {
			dropdown.activeItemIndex = currentIndex - 1
		}
	} else {
		dropdown.activeItemIndex = resultsLength - 1
	}
}

const setCurrentResult = () => {
	if (!dropdown.open) {
		ensureDropdownOpen()
		return
	}
	if (linkPicker.value) {
		if (dropdown.activeItemIndex !== null && linkResults.value[dropdown.activeItemIndex]) {
			selectLinkOption(linkResults.value[dropdown.activeItemIndex])
		}
		return
	}
	if (dropdown.results) {
		const currentIndex = dropdown.activeItemIndex ?? 0
		const result = dropdown.results[currentIndex]
		if (result !== undefined) setChoiceResult(result)
	}
}
</script>

<style scoped>
.autocomplete {
	position: relative;
}

.aform_form-element--embedded {
	min-width: 0;
	flex: 1 1 auto;
	width: 100%;
	padding-top: 0;
}

.aform_form-element--embedded .autocomplete {
	display: flex;
	flex: 1;
	min-width: 0;
	min-height: 0;
	width: 100%;
}

.aform_dropdown--anchor-group .autocomplete {
	position: static;
}

.aform_input-field--embedded {
	box-sizing: border-box;
	width: 100%;
	min-width: 0;
	outline: none;
	background: transparent;
	padding: 0.5rem 1ch;
}

.aform_dropdown-button {
	display: flex;
	align-items: center;
	gap: 0.75ch;
	flex: 1;
	align-self: stretch;
	box-sizing: border-box;
	width: 100%;
	min-height: 100%;
	padding: 0.5rem 1ch;
	font-size: 1rem;
	font-family: var(--sc-font-family);
	color: var(--sc-cell-text-color);
	background: var(--sc-input-addon-background);
	border: none;
	outline: none;
	border-radius: 0 var(--sc-border-radius) var(--sc-border-radius) 0;
	white-space: nowrap;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
}

.aform_dropdown-button:focus,
.aform_dropdown-button:focus-visible {
	outline: none;
	box-shadow: none;
}

.aform_dropdown-button::-moz-focus-inner {
	border: 0;
	padding: 0;
}

/* Merged fields (quantity UOM): same surface as the sibling input, not a nested addon chip. */
.aform_form-element--embedded .aform_dropdown-button {
	background: transparent;
}

.aform_dropdown-button:disabled {
	cursor: not-allowed;
	color: var(--sc-gray-50);
}

.aform_dropdown-button-value {
	flex: 1;
	min-width: 0;
	text-align: left;
}

.aform_dropdown-button-caret {
	display: inline-block;
	width: 0;
	height: 0;
	border-left: 0.3em solid transparent;
	border-right: 0.3em solid transparent;
	border-top: 0.3em solid currentColor;
}
</style>
