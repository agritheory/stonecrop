<template>
	<div :class="['aform_form-element', { 'aform_form-element--embedded': embedded }]">
		<span v-if="mode === 'display'" class="aform_display-value">{{ displayedText }}</span>
		<template v-else>
			<div v-on-click-outside="onClickOutside" class="aform_form-link-wrapper">
				<div class="input-group">
					<input
						v-model="searchText"
						type="text"
						role="combobox"
						autocomplete="off"
						aria-autocomplete="list"
						:class="['aform_input-field', { 'aform_input-field--embedded': embedded }]"
						:placeholder="placeholder"
						:aria-label="ariaLabel"
						:required="required"
						:aria-expanded="dropdownOpen"
						:aria-controls="dropdownOpen ? listboxId : undefined"
						:aria-activedescendant="activeIndex === null ? undefined : `${listboxId}-opt-${activeIndex}`"
						:disabled="disabled || mode === 'read'"
						@input="onInput"
						@focus="onFocus"
						@keydown.down.prevent="selectNext"
						@keydown.up.prevent="selectPrev"
						@keydown.enter.prevent="selectCurrent"
						@keydown.esc="closeDropdown"
						@keydown.tab="closeDropdown" />
					<button
						v-if="hasValidId && !disabled && !embedded"
						type="button"
						class="aform_form-btn"
						@click="handleNavigate"
						@keydown.enter.prevent="handleNavigate">
						<span>{{ icon === 'chevron-right' ? '›' : '→' }}</span>
					</button>
				</div>
				<ul v-if="dropdownOpen" :id="listboxId" class="autocomplete-results" role="listbox" :aria-label="ariaLabel">
					<li v-if="loading" class="autocomplete-result loading">Loading…</li>
					<li
						v-for="(option, i) in dropdownResults"
						v-else
						:id="`${listboxId}-opt-${i}`"
						:key="String(option.id)"
						role="option"
						:aria-selected="i === activeIndex"
						class="autocomplete-result"
						:class="{ 'is-active': i === activeIndex }"
						@mousedown.prevent="selectOption(option)">
						<slot name="option" :option="option">{{ option.displayText ?? String(option.id) }}</slot>
					</li>
				</ul>
			</div>
			<label v-if="label && !embedded" class="aform_field-label">{{ label }}</label>
		</template>
	</div>
</template>

<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { computed, inject, ref, useId, watch } from 'vue'

import type { AFormLinkNavigator, AFormLinkValue, ComponentProps } from '../../types'
import { deserializeFunction } from '../../utils/deserialize'

const {
	label,
	mode,
	uuid,
	required,
	doctype = undefined,
	formatter = undefined,
	icon = 'arrow-right',
	disabled = false,
	filterFunction = undefined,
	isAsync = false,
	embedded = false,
	placeholder = undefined,
	ariaLabel = undefined,
} = defineProps<
	ComponentProps & {
		doctype?: string
		formatter?: (value: AFormLinkValue) => string
		icon?: 'arrow-right' | 'chevron-right'
		disabled?: boolean
		filterFunction?: string | ((search: string) => AFormLinkValue[] | Promise<AFormLinkValue[]>)
		isAsync?: boolean
		// Bare rendering for compositing into another component's own bordered container
		// (e.g. ACurrencyInput's merged amount+currency group): suppresses this component's
		// own outline/border and floating label so the parent supplies both exactly once.
		embedded?: boolean
		placeholder?: string
		// Accessible name for the search input. Needed in `embedded` mode, where the visible
		// <label> is suppressed and a placeholder is not a dependable accessible name — it is
		// not exposed consistently across screen readers and vanishes once a value is picked.
		ariaLabel?: string
	}
>()

// Ties the input to its listbox and to the active option (aria-controls / aria-activedescendant).
// `uuid` is per-field when AForm supplies it; the fallback keeps the ids unique for a standalone
// mount so two pickers on one page can't cross-wire their ARIA relationships.
const listboxId = `${uuid ?? `aform-link-${useId()}`}-listbox`

const modelValue = defineModel<AFormLinkValue>({ default: () => ({ id: '', displayText: '' }) })

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

type FilterFn = (search: string) => AFormLinkValue[] | Promise<AFormLinkValue[]>
type ResolverFn = (doctype: string, id: string) => string | undefined | Promise<string | undefined>
const resolver = inject<ResolverFn | null>('aformLinkResolver', null)

// Records loaded from the DB arrive as scalar UUID strings; normalize to AFormLinkValue
// so the resolution watch below can pick up the id correctly.
watch(
	() => modelValue.value,
	value => {
		if (value !== null && value !== undefined && (typeof value === 'string' || typeof value === 'number')) {
			modelValue.value = { id: value }
		}
	},
	{ immediate: true }
)

// When the id changes (including on first render), resolve its display text.
// Tries filterFunction first (returns a list of candidates to search); falls back to the
// injected resolver (a direct doctype+id lookup). Skips if displayText is already set.
watch(
	() => modelValue.value?.id,
	async id => {
		if (!id || modelValue.value.displayText) return
		try {
			let match: AFormLinkValue | undefined
			let displayText: string | undefined
			if (filterFunction) {
				const fn: FilterFn =
					typeof filterFunction === 'string' ? deserializeFunction<FilterFn>(filterFunction) : filterFunction
				const results = await fn(String(id))
				match = results.find(r => String(r.id) === String(id))
				displayText = match?.displayText
				if (displayText === undefined) {
					console.warn(
						`[AFormLink] filterFunction returned no matching result for id "${id}". ` +
							`The function must return an item whose \`id\` exactly matches the search string.`
					)
				}
			} else if (resolver && doctype) {
				displayText = (await resolver(doctype, id.toString())) ?? undefined
			}
			if (displayText) {
				// Merge the whole matched record, not just its display text — the extra properties
				// an AFormLinkValue carries are part of the value (ACurrencyInput's `symbol`, which
				// its formatter renders, is one). `id` is pinned to the value we already hold so a
				// loosely-typed match (1 vs '1') can't change the FK's type underneath the record.
				const resolved: AFormLinkValue = { ...modelValue.value, ...match, id: modelValue.value.id, displayText }
				// Format for the same reason selectOption does: the input shows `formatter`'s output
				// everywhere else (initial render, blur), so assigning the raw displayText here would
				// make a value that arrived as a bare id render differently from the identical value
				// picked by hand — e.g. "Euro" instead of "€".
				searchText.value = formatter ? formatter(resolved) : displayText
				modelValue.value = resolved
			}
		} catch {
			// silent — fall back to showing the raw id
		}
	},
	{ immediate: true }
)

const handleNavigate = () => {
	if (navigator && doctype) {
		navigator.navigate(doctype, modelValue.value.id)
	} else if (navigator && !doctype) {
		console.warn(
			`[AFormLink] Navigation requested but \`doctype\` prop is missing. ` +
				`Add \`options\` (or \`doctype\`) to the Link field definition to enable navigation.`
		)
	}
}

const openDropdown = async (text: string) => {
	if (!filterFunction || mode === 'read') return
	activeIndex.value = null
	dropdownOpen.value = true
	if (isAsync) loading.value = true
	try {
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
	// Format `option` directly rather than reading back displayedText/modelValue: under a real
	// two-way v-model (e.g. ACurrencyInput binding to a computed with a side-effecting setter),
	// modelValue.value still reflects the *prop* until the parent's update round-trips back,
	// so reading it synchronously here would show stale (pre-selection) text for a tick.
	searchText.value = formatter ? formatter(option) : (option.displayText ?? String(option.id))
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

.aform_form-element--embedded {
	min-width: 0;
	flex-grow: 0;
}

/* Embedded mode: the host component's own container supplies the border, so this input
   goes borderless and inherits the host's padding scale instead of the standalone default. */
.aform_input-field--embedded {
	outline: none;
	background: transparent;
	padding: 0.5ch 1ch;
}

/* Only in embedded mode is the trigger deliberately narrower than its options (e.g. a currency
   symbol box): let the dropdown grow past it rather than truncate. Standalone pickers keep the
   dropdown flush with the input, so a long display text can't overhang a narrow form column. */
.aform_form-element--embedded .autocomplete-results {
	min-width: 100%;
	width: max-content;
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
