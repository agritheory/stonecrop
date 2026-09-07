<script setup lang="ts">
defineProps<{
	headers: string[]
	rows: string[][]
}>()

// Minimal inline-markdown support (code spans, links) — the only two constructs actually used
// across these tables' cell text. Not a general markdown renderer; escapes HTML first since
// this feeds v-html, then applies links before code spans so a code span nested inside link
// text (e.g. "[`CurrencyValue`](#currencyvalue)") still renders as <a><code>...</code></a>.
function renderCell(text: string): string {
	let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
	html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
	html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
	return html
}
</script>

<template>
	<div class="api-table">
		<table>
			<thead>
				<tr>
					<th v-for="header in headers" :key="header">{{ header }}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, rowIndex) in rows" :key="rowIndex">
					<td v-for="(cell, cellIndex) in row" :key="cellIndex" v-html="renderCell(cell)" />
				</tr>
			</tbody>
		</table>
	</div>
</template>
