<script setup lang="ts">
import { ref } from 'vue'
import { ANumericInput } from '@stonecrop/aform'

const quantity = ref(42)
</script>

<template>
	<div class="stonecrop-demo">
		<ANumericInput v-model="quantity" label="Quantity" uuid="numeric-input-demo" mode="edit" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ quantity }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
