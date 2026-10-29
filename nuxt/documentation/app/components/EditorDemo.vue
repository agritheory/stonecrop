<script setup lang="ts">
import { computed, ref } from 'vue'
import { AForm } from '@stonecrop/aform'
import type { ResolvedField } from '@stonecrop/aform'

// AForm renders the field by the component name the schema gives it; the Stonecrop Nuxt module registers
// `AEditor` globally. The stored value below is exactly what the record would hold.
const modes = ['edit', 'read', 'display'] as const
const mode = ref<(typeof modes)[number]>('edit')

const schema = ref<ResolvedField[]>([{ fieldname: 'notes', kind: 'field', component: 'AEditor', label: 'Notes' }])

const data = ref<Record<string, unknown>>({
	notes: {
		time: 1735000000000,
		version: '2.31.7',
		blocks: [
			{ type: 'header', data: { text: 'Delivery notes', level: 2 } },
			{
				type: 'paragraph',
				data: { text: 'Leave at the <b>back door</b>. See the <a href="https://example.com">map</a>.' },
			},
			{
				type: 'list',
				data: {
					style: 'unordered',
					meta: {},
					items: [
						{ content: 'Fragile', meta: {}, items: [] },
						{ content: 'Keep upright', meta: {}, items: [] },
					],
				},
			},
			{ type: 'delimiter', data: {} },
			{ type: 'quote', data: { text: 'Handle with care', caption: 'Warehouse', alignment: 'left' } },
		],
	},
})

const stored = computed(() => JSON.stringify({ notes: data.value.notes }, null, 2))
</script>

<template>
	<div class="stonecrop-demo editor-demo">
		<div class="editor-demo__modes" role="radiogroup" aria-label="Form mode">
			<label v-for="m in modes" :key="m">
				<input v-model="mode" type="radio" name="editor-demo-mode" :value="m" />
				<code>{{ m }}</code>
			</label>
		</div>
		<AForm v-model:data="data" :schema="schema" :mode="mode" />
		<details class="editor-demo__stored" open>
			<summary>Stored value</summary>
			<pre>{{ stored }}</pre>
		</details>
	</div>
</template>

<style scoped>
.editor-demo__modes {
	display: flex;
	gap: 1rem;
	margin: 0 0 1rem;
	font-size: 0.85em;
}

.editor-demo__modes label {
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	cursor: pointer;
}

/* AForm caps each field at one field width; Notes spans two, gap included. */
.editor-demo :deep(.a-editor) {
	flex-basis: 100%;
	max-width: calc(2 * var(--sc-form-field-max-width) + 1rem);
}

.editor-demo__stored {
	margin-top: 1.5rem;
	padding-top: 1rem;
	border-top: 1px dashed var(--sc-gray-20);
	font-size: 0.8em;
}

.editor-demo__stored pre {
	max-height: 18rem;
	overflow: auto;
}
</style>
