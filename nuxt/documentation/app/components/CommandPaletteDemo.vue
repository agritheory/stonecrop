<script setup lang="ts">
import { ref } from 'vue'
import { CommandPalette } from '@stonecrop/desktop'

interface Fruit {
	name: string
	color: string
}

const fruits: Fruit[] = [
	{ name: 'Apple', color: 'Red' },
	{ name: 'Banana', color: 'Yellow' },
	{ name: 'Grape', color: 'Purple' },
	{ name: 'Kiwi', color: 'Green' },
	{ name: 'Mango', color: 'Orange' },
]

const isOpen = ref(false)
const selected = ref('')

const search = (query: string): Fruit[] => {
	const q = query.toLowerCase()
	return fruits.filter(f => f.name.toLowerCase().includes(q))
}

const onSelect = (fruit: Fruit) => {
	selected.value = fruit.name
	isOpen.value = false
}
</script>

<template>
	<div class="stonecrop-demo">
		<button type="button" @click="isOpen = true">Open Command Palette</button>
		<p v-if="selected">
			Selected: <strong>{{ selected }}</strong>
		</p>
		<CommandPalette
			:is-open="isOpen"
			:search="search"
			placeholder="Search fruit…"
			@select="onSelect"
			@close="isOpen = false">
			<template #title="{ result }">{{ result.name }}</template>
			<template #content="{ result }">{{ result.color }}</template>
			<template #empty>No fruit found</template>
		</CommandPalette>
	</div>
</template>

<style scoped>
button {
	padding: 0.5rem 1rem;
	cursor: pointer;
}

p {
	margin-top: 1rem;
}
</style>
