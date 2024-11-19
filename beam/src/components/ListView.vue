<template>
	<ul class="beam_list-view">
		<li v-for="item in items" :key="item.label">
			<template v-if="item.linkComponent">
				<component :is="item.linkComponent" :to="item.route" tabindex="-1">
					<ListItem :item="item" @update="handleUpdate"></ListItem>
				</component>
			</template>
			<template v-else>
				<ListItem :item="item" @update="handleUpdate"></ListItem>
			</template>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

import ListItem from '@/components/ListItem.vue'
import type { ListViewItem } from '@/types'

defineProps<{ items: ListViewItem[] }>()
const emit = defineEmits<{ update: [item: ListViewItem]; scrollbottom: [] }>()

onMounted(() => {
	window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll)
})

const handleUpdate = (item: ListViewItem) => emit('update', item)
const handleScroll = () => {
	const scrollHeightDifference = document.documentElement.scrollHeight - window.innerHeight
	const scrollposition = document.documentElement.scrollTop
	if (scrollHeightDifference - scrollposition <= 2) {
		emit('scrollbottom')
	}
}
</script>
