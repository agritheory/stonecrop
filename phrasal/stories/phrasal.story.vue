<template>
	<Story title="dropdown">
		<div class="dropdown-form">
			<ADropdown :items="dropdown_data.items" v-model="dropdown_data.value" :label="dropdown_data.label" />
		</div>
	</Story>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ADropdown } from '@sedum/aform'

const dropdown_data = ref({
	items: ['Apple', 'Orange', 'Pear', 'Kiwi', 'Grape'],
	value: 'Orange',
	label: 'Fruit',
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
/* @import url('@sedum/theme/aform.css'); */

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
