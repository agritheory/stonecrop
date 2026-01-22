<!-- nuxt-yoga/playground/app.vue -->
<template>
	<div>
		<h1>Nuxt Yoga GraphQL Module Playground</h1>
		<p>GraphQL endpoint is running at <a href="/graphql/" target="_blank">/graphql/</a></p>

		<div class="cache-controls">
			<h2>Cache Management</h2>
			<button @click="clearCache">Clear Cache</button>
			<button @click="getStats">Get Cache Stats</button>
			<pre v-if="cacheStats">{{ cacheStats }}</pre>
			<p v-if="message">{{ message }}</p>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const cacheStats = ref(null)
const message = ref('')

// const clearCache = async () => {
// 	try {
// 		const response = await $fetch('/graphql/cache?action=clear')
// 		message.value = response.message
// 		cacheStats.value = null
// 	} catch (error) {
// 		message.value = `Error: ${error.message}`
// 	}
// }

// const getStats = async () => {
// 	try {
// 		const response = await $fetch('/graphql/cache?action=stats')
// 		cacheStats.value = response.data
// 		message.value = ''
// 	} catch (error) {
// 		message.value = `Error: ${error.message}`
// 	}
// }
</script>

<style scoped>
h1 {
	color: #00dc82;
}
.cache-controls {
	margin-top: 2rem;
}
button {
	margin-right: 1rem;
	padding: 0.5rem 1rem;
}
pre {
	background: #f0f0f0;
	padding: 1rem;
	margin-top: 1rem;
}
</style>
