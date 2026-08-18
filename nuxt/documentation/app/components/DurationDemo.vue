<script setup lang="ts">
import { ref } from 'vue'
import { ADuration } from '@stonecrop/aform'

const durationMs = ref<number>(0)
</script>

<template>
	<div class="stonecrop-demo">
		<ADuration v-model="durationMs" label="Task Duration" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ durationMs }} ms</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
