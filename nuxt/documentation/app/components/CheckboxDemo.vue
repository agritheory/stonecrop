<script setup lang="ts">
import { ref } from 'vue'
import { ACheckbox } from '@stonecrop/aform'

const accepted = ref(false)
</script>

<template>
	<div class="stonecrop-demo">
		<ACheckbox v-model="accepted" label="Accept terms and conditions" uuid="checkbox-demo" mode="edit" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ accepted }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
