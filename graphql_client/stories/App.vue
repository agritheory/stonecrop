<template>
	<div>
		<h1>Schema</h1>
		<pre>{{ schema?.schema }}</pre>
	</div>

	<div>
		<h1>Query</h1>
		<pre>{{ queries.getMeta }}</pre>
	</div>

	<div>
		<h1>Data</h1>
		<pre>{{ data }}</pre>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useStonecrop } from '@agritheory/stonecrop'
import { queries } from '../src/queries'

const data = ref({})
const schema = ref({})
const { stonecrop } = useStonecrop()

onMounted(async () => {
	const response = await fetch('/schema')
	schema.value = await response.json()
	data.value = await stonecrop.value.getMeta('Issue')
})
</script>
