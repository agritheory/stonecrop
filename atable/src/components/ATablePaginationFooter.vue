<template>
	<tfoot v-if="showFooter" class="atable-pagination">
		<tr>
			<td :colspan="columnCount">
				<p v-if="hasMore" class="truncation-note">This is a partial list — more records exist on the server.</p>
				<p v-else-if="showCompleteNote" class="completion-note">All {{ loadedCount }} records loaded.</p>
				<div v-if="showControls" class="atable-pagination-controls">
					<button type="button" class="atable-pagination-btn" :disabled="!hasPrev || loading" @click="prev">
						Previous
					</button>
					<button type="button" class="atable-pagination-btn" :disabled="!hasNext || loading" @click="onNext">
						{{ hasMore && !hasLocalNext ? 'Load more' : 'Next' }}
					</button>
				</div>
			</td>
		</tr>
	</tfoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	columnCount: number
	showFooter: boolean
	hasMore: boolean
	hasPrev: boolean
	hasNext: boolean
	hasLocalNext: boolean
	hasEverHadMore: boolean
	loadedCount: number
	loading: boolean
	next: () => Promise<void>
	prev: () => void
}>()

const showCompleteNote = computed(() => !props.hasMore && props.hasEverHadMore)
const showControls = computed(() => props.hasMore || props.hasPrev)

const onNext = () => {
	void props.next()
}
</script>

<style scoped>
.atable-pagination td {
	padding: 0.75rem 0.5ch;
	border-top: 1px solid var(--sc-row-border-color, #e0e0e0);
}

.truncation-note,
.completion-note {
	margin: 0 0 0.5rem;
	font-size: var(--sc-table-font-size, 0.875rem);
	color: var(--sc-gray-60, #666);
}

.completion-note {
	margin-bottom: 0;
}

.atable-pagination-controls {
	display: flex;
	gap: 0.5rem;
}

.atable-pagination-btn {
	appearance: none;
	-webkit-appearance: none;
	box-sizing: border-box;
	padding: 0.5rem 1rem;
	background: var(--sc-btn-color, #fafafa);
	color: var(--sc-btn-label-color, #333333);
	border: 1px solid var(--sc-btn-border, #cccccc);
	border-radius: var(--sc-border-radius, 0);
	cursor: pointer;
	font-family: var(--sc-font-family, Arial, sans-serif);
	font-size: var(--sc-table-font-size, 0.875rem);
	font-weight: 400;
	line-height: 1.2;
	transition: background-color 0.15s ease;
}

.atable-pagination-btn:hover:not(:disabled) {
	background: var(--sc-btn-hover, #f2f2f2);
}

.atable-pagination-btn:focus-visible {
	outline: 2px solid var(--sc-input-active-border-color, #333333);
	outline-offset: 1px;
}

.atable-pagination-btn:disabled {
	cursor: not-allowed;
	background: var(--sc-gray-5, #f2f2f2);
	color: var(--sc-gray-50, #808080);
	border-color: var(--sc-gray-20, #cccccc);
	opacity: 1;
}
</style>
