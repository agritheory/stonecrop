<template>
	<div></div>
</template>

<script setup lang="ts">
import { gql, request } from 'graphql-request'
import { onMounted } from 'vue'

onMounted(async () => {
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

	const data = await request('/graphql', query, { doctype: 'Issue' })
	console.log('data', data)
})
</script>
