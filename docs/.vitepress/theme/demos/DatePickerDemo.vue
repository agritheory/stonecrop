<script setup lang="ts">
import { ref } from 'vue'
import { ADatePicker } from '@stonecrop/aform'

// ADatePicker's `edit` mode renders only the calendar grid — the `label` prop is only
// used in `read`/`display` mode, so it's omitted here.
const selected = ref(new Date())
</script>

<template>
	<div class="stonecrop-demo">
		<ADatePicker v-model="selected" mode="edit" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ selected }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
