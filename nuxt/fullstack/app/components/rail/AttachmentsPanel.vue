<template>
	<div class="rail-panel">
		<p v-if="items.length === 0" class="rail-panel__empty">No files</p>
		<ul v-else class="rail-panel__list">
			<li v-for="item in items" :key="item.id">
				<button type="button" class="rail-panel__row" @click="open(item)">
					{{ item.name }}
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { useDocumentRail } from '@stonecrop/desktop'

import StubPreview from './StubPreview.vue'

const rail = useDocumentRail()

const items = [
	{ id: 'att-invoice', name: 'Invoice-1042.pdf' },
	{ id: 'att-packing', name: 'Packing-slip-1042.pdf' },
]

function open(item: (typeof items)[number]) {
	rail.present({
		id: item.id,
		view: StubPreview,
		props: { title: item.name, body: `Attachment preview for ${item.name}.` },
	})
}
</script>

<style scoped>
.rail-panel {
	padding: 0.75rem;
	font-family: var(--sc-font-family);
}

.rail-panel__empty {
	margin: 0;
	padding: 1rem 0.5rem;
	color: var(--sc-gray-60);
}

.rail-panel__list {
	margin: 0;
	padding: 0;
	list-style: none;
}

.rail-panel__row {
	display: block;
	width: 100%;
	padding: 0.6rem 0.75rem;
	border: 1px solid var(--sc-gray-20);
	background: transparent;
	text-align: left;
	cursor: pointer;
	font-family: var(--sc-font-family);
	color: var(--sc-gray-80);
}

.rail-panel__row:hover {
	background: var(--sc-btn-hover);
}

.rail-panel__list li + li {
	margin-top: 0.4rem;
}
</style>
