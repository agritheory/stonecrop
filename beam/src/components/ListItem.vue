<template>
	<li tabindex="0" class="beam__listitem">
		<div class="beam__listtext">
			<label>{{ item.label }}</label>
			<p>{{ item.description }}</p>
		</div>

		<ItemCount
			v-if="item.count"
			v-model="listItem.count.count"
			:denominator="item.count.of"
			:uom="item.count.uom"
			:editable="true" />
		<ItemCheck v-if="item.hasOwnProperty('checked')" v-model="listItem.checked" />
	</li>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import ItemCount from '@/components/ItemCount.vue'
import ItemCheck from '@/components/ItemCheck.vue'

const props = defineProps<{
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

const listItem = ref(props.item)
</script>
