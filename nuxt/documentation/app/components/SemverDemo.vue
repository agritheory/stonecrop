<script setup lang="ts">
import { ref } from 'vue'
import { ASemverInput } from '@stonecrop/aform'

const version = ref({
	raw: '1.2.3-pre.1',
	major: 1,
	minor: 2,
	patch: 3,
})
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
