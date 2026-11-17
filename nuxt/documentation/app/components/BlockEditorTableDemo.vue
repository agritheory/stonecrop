<script setup lang="ts">
import { ref } from 'vue'
import type { ColumnSchema } from '@stonecrop/schema'
import { ATable, type TableRow } from '@stonecrop/atable'

const doc = (...blocks: { type: string; data: Record<string, unknown> }[]) => ({
	time: 1735000000000,
	version: '2.31.7',
	blocks,
})

const rows = ref<TableRow[]>([
	{
		id: '1',
		order: 'ORD-0001',
		notes: doc(
			{ type: 'header', data: { text: 'Delivery notes', level: 2 } },
			{ type: 'paragraph', data: { text: 'Leave at the <b>back door</b>, the side gate is locked after six.' } },
			{
				type: 'list',
				data: { style: 'unordered', meta: {}, items: [{ content: 'Fragile', meta: {}, items: [] }] },
			}
		),
	},
	{
		id: '2',
		order: 'ORD-0002',
		notes: doc({ type: 'quote', data: { text: 'Call before arriving', caption: 'Customer', alignment: 'left' } }),
	},
	{ id: '3', order: 'ORD-0003', notes: null },
])

const schema = ref<ColumnSchema[]>([
	{ fieldname: 'order', component: 'ATextInput', label: 'Order', edit: false, width: '12ch' },
	{
		fieldname: 'notes',
		component: 'AEditor',
		label: 'Notes',
		edit: true,
		width: '40ch',
		filterable: true,
	},
])
</script>

<template>
	<div class="stonecrop-demo">
		<p class="stonecrop-demo__hint">
			The Notes cell shows the document's plain text, cut off with an ellipsis. It stays read-only even though the
			column sets <code>edit: true</code>. Filter Notes for <code>fragile</code> or <code>call</code>.
		</p>
		<ATable v-model:rows="rows" :schema="schema" :config="{ view: 'list' }" />
	</div>
</template>

<style scoped>
.stonecrop-demo__hint {
	margin: 0 0 1rem;
	font-size: 0.85em;
	color: var(--sc-gray-60);
}
</style>
