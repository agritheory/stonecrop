<script setup lang="ts">
import { ref } from 'vue'
import { ATextboxInput } from '@stonecrop/aform'

const notes = ref('')
</script>

<template>
	<div class="stonecrop-demo">
		<ATextboxInput v-model="notes" label="Notes" uuid="textbox-input-demo" :rows="4" mode="edit" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ notes }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
