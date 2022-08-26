<template>
	<div id="home">
		<h1>Records</h1>
		<pre>{{ state }}</pre>
		<hr />
		<pre> {{ state.name }}</pre>
	</div>
</template>
<script setup lang="ts">
import { useStonecrop } from '@/composable.js'

let state = useStonecrop()
</script>
