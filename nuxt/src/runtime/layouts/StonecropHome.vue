<template>
	<div>Stonecrop Home</div>

	<div v-if="isReady">
		<p>Stonecrop is ready!</p>
	</div>
	<pre>{{ stonecrop }}</pre>
</template>

<script setup lang="ts">
import { useStonecrop } from '@stonecrop/stonecrop'

const { stonecrop, isReady } = useStonecrop()
</script>
