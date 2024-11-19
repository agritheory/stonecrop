<template>
	<ul class="beam_list-view">
		<li v-for="item in items" :key="item.label">
			<template v-if="item.linkComponent">
				<component :is="item.linkComponent" :to="item.route" tabindex="-1">
					<ListItem :item="item"></ListItem>
				</component>
			</template>
			<template v-else>
				<ListItem :item="item"></ListItem>
			</template>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

import ListItem from '@/components/ListItem.vue'
import type { ListViewItem } from '@/types'

defineProps<{ items: ListViewItem[] }>()
const emit = defineEmits<{ scrollbottom: [] }>()

onMounted(() => {
	window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
	const scrollHeightDifference = document.documentElement.scrollHeight - window.innerHeight
	const scrollposition = document.documentElement.scrollTop
	if (scrollHeightDifference - scrollposition <= 2) {
		emit('scrollbottom')
	}
}
</script>
