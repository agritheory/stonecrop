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
