<template>
	<div
		class="command-search"
		:class="{ 'command-search--embedded': embedded }"
		:role="embedded ? undefined : 'dialog'"
		:aria-modal="embedded ? undefined : true"
		:aria-label="embedded ? undefined : 'Command palette'">
		<div class="command-search-header">
			<input
				ref="input"
				v-model="query"
				type="text"
				class="command-search-input"
				:placeholder="placeholder"
				aria-label="Search commands"
				:aria-activedescendant="results.length && selectedIndex >= 0 ? `${listboxId}-opt-${selectedIndex}` : undefined"
				aria-controls="command-search-results"
				@keydown="handleKeydown" />
		</div>

		<div
			v-if="results.length"
			id="command-search-results"
			class="command-search-results"
			role="listbox"
			aria-label="Command results">
			<div
				v-for="(result, index) in results"
				:id="`${listboxId}-opt-${index}`"
				:key="index"
				class="command-search-result"
				role="option"
				:aria-selected="index === selectedIndex"
				:class="{ selected: index === selectedIndex }"
				@click="selectResult(result)"
				@mouseover="selectedIndex = index">
				<div class="command-search-result-title">
					<slot name="title" :result="result" />
				</div>
				<div class="command-search-result-content">
					<slot name="content" :result="result" />
				</div>
			</div>
		</div>
		<div v-else-if="query && !results.length" class="command-search-no-results" role="status" aria-live="polite">
			<slot name="empty"> No results found for "{{ query }}" </slot>
		</div>
	</div>
</template>

<script setup lang="ts" generic="T">
import { ref, computed, watch, nextTick, useTemplateRef, useId } from 'vue'

defineSlots<{
	title?: { result: T }
	content?: { result: T }
	empty?: null
}>()

const {
	search,
	placeholder = 'Type a command or search...',
	maxResults = 10,
	embedded = false,
	autofocus = false,
} = defineProps<{
	search: (query: string) => T[]
	placeholder?: string
	maxResults?: number
	/** When true, omits dialog semantics and lets Escape bubble to a parent panel. */
	embedded?: boolean
	autofocus?: boolean
}>()

const emit = defineEmits<{
	select: [T]
	close: []
}>()

const listboxId = useId()
const query = ref('')
const selectedIndex = ref(0)
const inputRef = useTemplateRef('input')

const results = computed(() => {
	const searchResults = search(query.value)
	return searchResults.slice(0, maxResults)
})

watch(
	() => autofocus,
	async shouldFocus => {
		if (!shouldFocus) return
		query.value = ''
		selectedIndex.value = 0
		await nextTick()
		;(inputRef.value as HTMLInputElement | null)?.focus()
	},
	{ immediate: true }
)

watch(results, () => {
	selectedIndex.value = 0
})

function reset() {
	query.value = ''
	selectedIndex.value = 0
}

defineExpose({ reset, focus: () => inputRef.value?.focus() })

const handleKeydown = (e: KeyboardEvent) => {
	switch (e.key) {
		case 'Escape':
			if (!embedded) {
				emit('close')
			}
			break
		case 'ArrowDown':
			e.preventDefault()
			if (results.value.length) {
				selectedIndex.value = (selectedIndex.value + 1) % results.value.length
			}
			break
		case 'ArrowUp':
			e.preventDefault()
			if (results.value.length) {
				selectedIndex.value = (selectedIndex.value - 1 + results.value.length) % results.value.length
			}
			break
		case 'Enter':
			if (results.value.length && selectedIndex.value >= 0) {
				selectResult(results.value[selectedIndex.value])
			}
			break
	}
}

const selectResult = (result: T) => {
	emit('select', result)
	if (!embedded) {
		emit('close')
	}
}
</script>

<style scoped>
.command-search {
	display: flex;
	flex-direction: column;
	min-height: 0;
	background-color: var(--sc-form-background);
}

.command-search--embedded {
	flex: 1;
}

.command-search-header {
	display: flex;
	border-bottom: 1px solid var(--sc-gray-20);
	padding: 12px;
	flex-shrink: 0;
}

.command-search-input {
	flex: 1;
	box-sizing: border-box;
	width: 100%;
	border: 1px solid var(--sc-input-border-color);
	border-radius: var(--sc-border-radius);
	outline: none;
	font-size: 0.95rem;
	font-family: var(--sc-font-family);
	padding: 8px 10px;
	background-color: var(--sc-input-field-background);
	color: var(--sc-gray-80);
}

.command-search-input:focus-visible {
	border-color: var(--sc-input-active-border-color);
	outline: 2px solid var(--sc-primary-color);
	outline-offset: 1px;
}

.command-search-results {
	overflow-y: auto;
	flex: 1;
	min-height: 0;
}

.command-search-result {
	padding: 10px 12px;
	cursor: pointer;
	border-bottom: 1px solid var(--sc-gray-10);
}

.command-search-result:hover,
.command-search-result.selected {
	background-color: var(--sc-row-hover-color);
}

.command-search-result.selected {
	background-color: var(--sc-color-changed);
}

.command-search-result-title {
	font-weight: 500;
	margin-bottom: 2px;
	color: var(--sc-gray-80);
	font-size: 0.9rem;
}

.command-search-result-content {
	font-size: 0.8rem;
	color: var(--sc-input-label-color);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.command-search-no-results {
	padding: 16px 12px;
	text-align: center;
	color: var(--sc-input-label-color);
	font-size: 0.9rem;
}
</style>
