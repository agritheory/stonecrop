<script setup lang="ts">
import { ref } from 'vue'
import { ADuration } from '@stonecrop/aform'

const duration = ref<string | null>(null)
</script>

<template>
	<div class="stonecrop-demo">
		<ADuration v-model="duration" label="Task Duration" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ duration }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
