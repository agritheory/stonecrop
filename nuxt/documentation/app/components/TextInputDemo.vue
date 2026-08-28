<script setup lang="ts">
import { ref } from 'vue'
import { ATextInput } from '@stonecrop/aform'

const name = ref('')
</script>

<template>
	<div class="stonecrop-demo">
		<ATextInput v-model="name" label="Full name" uuid="text-input-demo" mode="edit" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ name }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
