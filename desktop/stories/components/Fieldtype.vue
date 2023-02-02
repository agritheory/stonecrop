<template>
	<pre>{{ registeredComponents }}</pre>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'

const app = getCurrentInstance()

const registeredComponents = computed(() => {
	let components = []
	for (const [key, value] of Object.entries(app.appContext.components)) {
		if (value.props.register) {
			components.push(key) // may be appropriate to pass more than just the instance name here
		}
	}
	return components
})
</script>
