<template>
	<div>
		<h1>Schema</h1>
		<pre>{{ schema?.schema }}</pre>
	</div>

	<div>
		<h1>Query</h1>
		<pre>{{ query }}</pre>
	</div>

	<div>
		<h1>Data</h1>
		<pre>{{ data }}</pre>
	</div>
</template>

<script setup lang="ts">
import { gql, request } from 'graphql-request'
import { onMounted, ref } from 'vue'

const data = ref({})
const schema = ref({})

const query = gql`
	query getDoctype($doctype: String!) {
		getMeta(doctype: $doctype) {
			id
			name
			workflow {
				name
			}
			schema {
				id
				label
			}
			actions {
				eventName
			}
		}
	}
`

onMounted(async () => {
	const response = await fetch('/schema')
	schema.value = await response.json()

	data.value = await request('/graphql', query, { doctype: 'Issue' })
})
</script>
