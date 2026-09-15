<template>
	<div class="rail-panel">
		<p v-if="items.length === 0" class="rail-panel__empty">No messages</p>
		<ul v-else class="rail-panel__list">
			<li v-for="item in items" :key="item.id">
				<button type="button" class="rail-panel__row" @click="open(item)">
					<span class="rail-panel__row-title">{{ item.name }}</span>
					<span class="rail-panel__row-meta">{{ item.from }}</span>
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
	{ id: 'chat-dock', name: 'Dock 3 is short a pallet', from: 'Sam Chen' },
	{ id: 'chat-eta', name: 'Customer asked for a new ETA', from: 'Priya Shah' },
]

function open(item: (typeof items)[number]) {
	rail.present({
		id: item.id,
		view: StubPreview,
		props: { title: item.name, body: `Thread with ${item.from}.` },
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
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.15rem;
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

.rail-panel__row-title {
	font-weight: 600;
}

.rail-panel__row-meta {
	font-size: 0.8125rem;
	color: var(--sc-gray-60);
}

.rail-panel__list li + li {
	margin-top: 0.4rem;
}
</style>
