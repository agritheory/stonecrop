<template>
	<Teleport to="body">
		<Transition name="fade">
			<div v-if="isOpen" class="command-palette-overlay" @click="closeModal">
				<div class="command-palette" @click.stop>
					<div class="command-palette-header">
						<input
							ref="input"
							v-model="query"
							type="text"
							class="command-palette-input"
							:placeholder="placeholder"
							autofocus
							@keydown="handleKeydown" />
					</div>

					<div v-if="results.length" class="command-palette-results">
						<div
							v-for="(result, index) in results"
							:key="index"
							class="command-palette-result"
							:class="{ selected: index === selectedIndex }"
							@click="selectResult(result)"
							@mouseover="selectedIndex = index">
							<div class="result-title">
								<slot name="title" :result="result" />
							</div>
							<div class="result-content">
								<slot name="content" :result="result" />
							</div>
						</div>
					</div>
					<div v-else-if="query && !results.length" class="command-palette-no-results">
						<slot name="empty"> No results found for "{{ query }}" </slot>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts" generic="T">
import { ref, computed, watch, nextTick, useTemplateRef } from 'vue'

defineSlots<{
	title?: { result: T }
	content?: { result: T }
	empty?: null
}>()

const {
	search,
	isOpen = false,
	placeholder = 'Type a command or search...',
	maxResults = 10,
} = defineProps<{
	search: (query: string) => T[]
	isOpen?: boolean
	placeholder?: string
	maxResults?: number
}>()

const emit = defineEmits<{
	select: [T]
	close: []
}>()

const query = ref('')
const selectedIndex = ref(0)
const inputRef = useTemplateRef('input')

const results = computed(() => {
	if (!query.value) return []
	const results = search(query.value)
	return results.slice(0, maxResults)
})

// reset search query when modal opens
watch(
	() => isOpen,
	async isOpen => {
		if (isOpen) {
			query.value = ''
			selectedIndex.value = 0
			await nextTick()
			;(inputRef.value as HTMLInputElement)?.focus()
		}
	}
)

// reset selected index when results change
watch(results, () => {
	selectedIndex.value = 0
})

const closeModal = () => {
	emit('close')
}

const handleKeydown = (e: KeyboardEvent) => {
	switch (e.key) {
		case 'Escape':
			closeModal()
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
	closeModal()
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.command-palette-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: flex-start;
	justify-content: center;
	z-index: 300;
	padding-top: 100px;
}

.command-palette {
	width: 600px;
	max-width: 90%;
	background-color: white;
	border-radius: 8px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	overflow: hidden;
	max-height: 80vh;
	display: flex;
	flex-direction: column;
}

.command-palette-header {
	display: flex;
	border-bottom: 1px solid #eaeaea;
	padding: 12px;
}

.command-palette-input {
	flex: 1;
	border: none;
	outline: none;
	font-size: 16px;
	padding: 8px 12px;
	background-color: transparent;
}

.command-palette-close {
	background: transparent;
	border: none;
	font-size: 24px;
	cursor: pointer;
	color: #666;
	padding: 0 8px;
}

.command-palette-close:hover {
	color: #333;
}

.command-palette-results {
	overflow-y: auto;
	max-height: 60vh;
}

.command-palette-result {
	padding: 12px 16px;
	cursor: pointer;
	border-bottom: 1px solid #f0f0f0;
}

.command-palette-result:hover,
.command-palette-result.selected {
	background-color: #f5f5f5;
}

.command-palette-result.selected {
	background-color: rgba(132, 60, 3, 0.1);
}

.result-title {
	font-weight: 500;
	margin-bottom: 4px;
	color: #333;
}

.result-content {
	font-size: 14px;
	color: #666;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.command-palette-no-results {
	padding: 20px 16px;
	text-align: center;
	color: #666;
}
</style>
