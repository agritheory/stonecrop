<script setup lang="ts">
import { ref } from 'vue'
import { ASemverInput } from '@stonecrop/aform'

const version = ref<string | null>('1.2.3-pre.1')
</script>

<template>
	<div class="stonecrop-demo">
		<ASemverInput v-model="version" label="Version" uuid="semver-demo" />
		<p class="stonecrop-demo__state">
			<code>v-model</code> value: <strong>{{ version }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
