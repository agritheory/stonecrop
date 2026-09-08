<template>
	<div class="rail-panel">
		<p class="rail-panel__hint">Attachments (specimen — no GraphQL yet)</p>
		<ul class="rail-panel__list">
			<li v-for="file in files" :key="file.id">
				<button type="button" class="rail-panel__row" @click="openPreview(file)">
					{{ file.name }}
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { useDocumentRail } from '@stonecrop/desktop'

import StubFilePreview from './StubFilePreview.vue'

const rail = useDocumentRail()

const files = [
	{ id: 'att-1', name: 'purchase-order.pdf' },
	{ id: 'att-2', name: 'delivery-note.pdf' },
]

function openPreview(file: { id: string; name: string }) {
	rail.present({
		id: file.id,
		view: StubFilePreview,
		props: { name: file.name },
	})
}
</script>

<style scoped>
.rail-panel {
	padding: 1rem;
	font-family: var(--sc-font-family);
}

.rail-panel__hint {
	margin: 0 0 0.75rem;
	color: var(--sc-gray-60);
	font-size: 0.875rem;
}

.rail-panel__list {
	list-style: none;
	margin: 0;
	padding: 0;
}

.rail-panel__row {
	width: 100%;
	text-align: left;
	padding: 0.5rem 0.75rem;
	border: 1px solid var(--sc-gray-20);
	background: var(--sc-form-background);
	cursor: pointer;
	font-family: inherit;
}

.rail-panel__row:hover {
	background: #f2f2f2;
}

.rail-panel__list li + li {
	margin-top: 0.5rem;
}
</style>
