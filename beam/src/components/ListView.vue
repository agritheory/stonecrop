<template>
	<ul class="beam__listview">
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

import ListItem from './ListItem.vue'

defineProps<{
	items: {
		label: string
		description: string
		count?: {
			count: number
			of: number
			uom: string
		}
		checked?: boolean
		linkComponent?: string
		route?: string
	}[]
}>()

const emit = defineEmits(['scrollbottom'])

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
