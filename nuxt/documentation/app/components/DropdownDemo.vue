<script setup lang="ts">
import { ref } from 'vue'
import { ADropdown } from '@stonecrop/aform'

const fruits = ['Apple', 'Orange', 'Pear', 'Kiwi', 'Grape']
const fruit = ref('Orange')
</script>

<template>
	<div class="stonecrop-demo">
		<ADropdown v-model="fruit" :options="fruits" label="Fruit" mode="edit" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ fruit }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
