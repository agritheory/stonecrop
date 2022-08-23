<template>
	<div id="home">
		<h1>Home</h1>
		<pre> {{ useState }} </pre>
	</div>
</template>
<script setup lang="ts">
import { createGlobalState, useStorage } from '@vueuse/core'
const useState = createGlobalState(() =>
	useStorage('stonecrop', {
		name: 'Banana',
		color: 'Yellow',
		size: 'Medium',
	})
)
</script>
