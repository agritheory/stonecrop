<script setup lang="ts">
import { ref } from 'vue'
import { ADate } from '@stonecrop/aform'

const deliveryDate = ref('2026-08-05')
</script>

<template>
	<div class="stonecrop-demo">
		<ADate v-model="deliveryDate" label="Delivery Date" uuid="date-demo" mode="edit" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ deliveryDate }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
