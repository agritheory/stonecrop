<template>
	<div id="home">
		<pre>{{ state }}</pre>
	</div>
</template>
<script setup lang="ts">
import { useStonecrop } from '@/composable.js'

let state = useStonecrop()
</script>
