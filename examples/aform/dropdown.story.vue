<template>
	<Story>
		<div class="dropdown-form">
			<!-- normal dropdown story -->
			<ADropdown
				data-theme="purple"
				:items="dropdown_data.items"
				v-model="dropdown_data.value"
				:label="dropdown_data.label" />

			<!-- dropdown with API request simulation -->
			<ADropdown
				:items="async_dropdown_data.items"
				v-model="async_dropdown_data.value"
				:label="async_dropdown_data.label"
				:isAsync="true"
				:filterFunction="asyncFilterItems" />

			<!-- dropdown with custom filtering logic -->
			<ADropdown
				:items="custom_filter_dropdown_data.items"
				v-model="custom_filter_dropdown_data.value"
				:label="custom_filter_dropdown_data.label"
				:isAsync="false"
				:filterFunction="filterItems" />
		</div>
	</Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const dropdown_data = reactive({
	items: ['Apple', 'Orange', 'Pear', 'Kiwi', 'Grape'],
	value: 'Orange',
	label: 'Fruit',
})

const async_dropdown_data = reactive({
	allItems: ['Dog', 'Cat', 'Lizard', 'Mouse', 'Bird'],
	items: ['Dog', 'Cat', 'Lizard', 'Mouse', 'Bird'],
	value: 'Dog',
	label: 'Animals',
})

const custom_filter_dropdown_data = reactive({
	allItems: ['Pizza', 'Burger', 'Pasta', 'Sushi', 'Tacos', 'Salad', 'Steak', 'Soup'],
	items: ['Pizza', 'Burger', 'Pasta', 'Sushi', 'Tacos', 'Salad', 'Steak', 'Soup'],
	value: '',
	label: 'Food',
})

async function asyncFilterItems(search: string) {
	// introduce a delay to simulate an async request
	await delay(750)
	const filtered = async_dropdown_data.allItems.filter(item => item.toLowerCase().includes(search.toLowerCase()))
	async_dropdown_data.items = filtered
	return filtered
}

function filterItems(search: string) {
	const filtered = custom_filter_dropdown_data.allItems.filter(item =>
		item.toLowerCase().startsWith(search.toLowerCase())
	)
	custom_filter_dropdown_data.items = filtered
	return filtered
}

function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}
</script>

<style>
.dropdown-form {
	min-height: 60px;
	height: 800px;
	display: flex;
	flex-direction: row;
	align-items: top;
	margin: 0px;
	padding-left: 1ch;
	padding-right: 1ch;
}
</style>
