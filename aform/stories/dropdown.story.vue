<template>
	<Story title="dropdown">
		<div class="dropdown-form">
	    <ADropdown
				:items="dropdown_data.items"
				v-model="dropdown_data.value"
				:label="dropdown_data.label"
			/>
			<ADropdown
				:items="async_dropdown_data.items"
				v-model="async_dropdown_data.value"
				:label="async_dropdown_data.label"
				:isAsync="true"
				@filterChanged="val => filterItems(val)"
			/>
		</div>
	</Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { reactive } from 'vue'
import ADropdown from '@/components/form/ADropdown.vue'

const dropdown_data = ref({
	items: ['Apple', 'Orange', 'Pear', 'Kiwi', 'Grape'],
	value: "Orange",
	label: "Fruit"
})

const async_dropdown_data = reactive({
	allItems: ['Dog', 'Cat', 'Lizard', 'Mouse', 'Bird'],
	items: ['Dog', 'Cat', 'Lizard', 'Mouse', 'Bird'],
	value: "Dog",
	label: "Animals"
})

function filterItems(search) {

	setTimeout(() => {
		async_dropdown_data.items = async_dropdown_data.allItems.filter((item) => {
			return item.toLowerCase().indexOf(search.toLowerCase()) > -1;
		})
	}, 750)

}

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('../src/theme/aform.css');



html {
	font-family: Arimo, sans-serif;
	font-size: 11pt;
}

.dropdown-form {
	min-height: 60px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin: 0px;
	padding-left: 1ch;
	padding-right: 1ch;
}

</style>

<!-- enter documentation here -->
<docs lang="md"></docs>
