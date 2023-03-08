<template>
	<pre>{{ registeredComponents }}</pre>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'

const app = getCurrentInstance()

const registeredComponents = computed(() => {
	let components = []
	for (const [name, obj] of Object.entries(app.appContext.components)) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (obj.props?.register) {
			// may be appropriate to pass more than just the instance name here
			components.push(name)
		}
	}
	return components
})
</script>
