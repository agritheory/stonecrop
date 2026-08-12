<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vitepress'
import { CommandPalette } from '@stonecrop/desktop'
import { searchIndex as pages, type SearchEntry } from './search-index'

const isOpen = ref(false)
const router = useRouter()

const open = () => {
	isOpen.value = true
}

const close = () => {
	isOpen.value = false
}

// CommandPalette expects a synchronous `search(query) => T[]`; a plain
// all-words-must-appear match over title+description is enough for a page
// index this size without pulling in a fuzzy-search dependency.
const search = (query: string): SearchEntry[] => {
	const words = query.toLowerCase().split(/\s+/).filter(Boolean)
	if (!words.length) return []
	return pages.filter(page => {
		const haystack = `${page.title} ${page.description}`.toLowerCase()
		return words.every(word => haystack.includes(word))
	})
}

const onSelect = (page: SearchEntry) => {
	router.go(page.url)
}

const onKeydown = (event: KeyboardEvent) => {
	if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
		event.preventDefault()
		open()
	}
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
	<button type="button" class="docs-search-button" aria-label="Search" @click="open">
		<svg class="docs-search-button__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m14.386 14.386 4.088 4.088-4.088-4.088A7.533 7.533 0 1 1 3.733 3.733a7.533 7.533 0 0 1 10.653 10.653z" />
		</svg>
		<span class="docs-search-button__placeholder">Search</span>
		<span class="docs-search-button__keys"><kbd>Ctrl</kbd><kbd>K</kbd></span>
	</button>

	<CommandPalette :is-open="isOpen" :search="search" placeholder="Search documentation..." @select="onSelect" @close="close">
		<template #title="{ result }">{{ result.title }}</template>
		<template #content="{ result }">{{ result.description }}</template>
		<template #empty>No pages found</template>
	</CommandPalette>
</template>

<style scoped>
.docs-search-button {
	display: flex;
	align-items: center;
	gap: 8px;
	height: 40px;
	padding: 0 10px 0 12px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	background: var(--vp-c-bg-alt);
	color: var(--vp-c-text-2);
	cursor: pointer;
	transition:
		border-color 0.25s,
		color 0.25s;
}

.docs-search-button:hover {
	border-color: var(--vp-c-brand-1);
	color: var(--vp-c-text-1);
}

.docs-search-button__icon {
	width: 14px;
	height: 14px;
	flex-shrink: 0;
}

.docs-search-button__placeholder {
	font-size: 13px;
	font-weight: 500;
	white-space: nowrap;
}

.docs-search-button__keys {
	display: flex;
	gap: 2px;
	margin-left: 8px;
}

.docs-search-button__keys kbd {
	display: block;
	height: 20px;
	padding: 0 6px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 4px;
	font-family: var(--vp-font-family-base, inherit);
	font-size: 11px;
	font-weight: 500;
	line-height: 20px;
	color: var(--vp-c-text-2);
}

@media (max-width: 767px) {
	.docs-search-button__placeholder,
	.docs-search-button__keys {
		display: none;
	}

	.docs-search-button {
		padding: 0;
		width: 40px;
		justify-content: center;
		border-color: transparent;
		background: transparent;
	}
}
</style>
