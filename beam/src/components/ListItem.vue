<template>
	<li tabindex="0" class="beam_list-item">
		<div class="beam_list-text">
			<label class="beam--bold">{{ listItem.label }}</label>
			<p>{{ listItem.description }}</p>
		</div>

		<ItemCount
			v-if="listItem.count"
			v-model="listItem.count.count"
			:debounce="listItem.debounce"
			:denominator="listItem.count.of"
			:editable="true"
			:uom="listItem.count.uom" />
		<ItemCheck v-if="listItem.hasOwnProperty('checked')" v-model="listItem.checked" />
	</li>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import ItemCount from '@/components/ItemCount.vue'
import ItemCheck from '@/components/ItemCheck.vue'
import type { ListViewItem } from '@/types'

const { item } = defineProps<{ item: ListViewItem }>()
const emit = defineEmits<{ update: [item: ListViewItem] }>()

const listItem = ref(item)

watch(
	listItem,
	value => {
		emit('update', value)
	},
	{ deep: true }
)
</script>
