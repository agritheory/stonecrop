<template>
	<div id="home">
		<pre>{{ state }}</pre>
		<Fieldtype></Fieldtype>
	</div>
</template>

<script setup lang="ts">
import { useStonecrop } from '@agritheory/stonecrop'
import Fieldtype from './Fieldtype.vue'

let state = useStonecrop()
</script>
