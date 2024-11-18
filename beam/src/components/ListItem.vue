<template>
	<li tabindex="0" class="beam_list-item">
		<div class="beam_list-text">
			<label class="beam--bold">{{ listItem.label }}</label>
			<p>{{ listItem.description }}</p>
		</div>

		<ItemCount
			v-if="listItem.count"
			v-model="listItem.count.count"
			:denominator="listItem.count.of"
			:uom="listItem.count.uom"
			:editable="true" />
		<ItemCheck v-if="listItem.hasOwnProperty('checked')" v-model="listItem.checked" />
	</li>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import ItemCount from '@/components/ItemCount.vue'
import ItemCheck from '@/components/ItemCheck.vue'

const { item } = defineProps<{
	item: {
		label: string
		description: string
		count?: {
			count: number
			of: number
			uom: string
		}
		checked?: boolean
	}
}>()

const listItem = ref(item)
</script>

<style scoped>
.beam_list-item {
	padding: 0.625rem;
	border-bottom: 1px solid var(--sc-row-border-color);
	max-width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	gap: 1.25rem;
	cursor: pointer;
	outline: 2px solid transparent;
	outline-offset: -1px;

	&:focus {
		outline: 2px solid var(--sc-focus-cell-outline);
		background-color: var(--sc-focus-cell-background);
	}
}

.beam_list-text {
	width: 80%;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	flex-grow: 1;
	font-size: 0.875rem;
	color: var(--sc-primary-text-color);

	& label,
	& p {
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		display: block;
	}
}

.beam_list-item label {
	display: block;
}

.beam_list-item p {
	margin: 0;
}
</style>
