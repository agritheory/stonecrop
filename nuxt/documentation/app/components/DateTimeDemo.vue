<script setup lang="ts">
import { ref } from 'vue'
import { ADateTime } from '@stonecrop/aform'

// Direct import, not via AForm — AForm resolves schema fields by string name through Vue's
// dynamic component registry, which needs @stonecrop/aform's `install` plugin registered on
// the app instance first. Direct imports skip that requirement, same as CheckboxDemo.vue.
const time = ref<{ hours: number; minutes: number; seconds: number; meridiem: string; militaryTime: number } | null>(
	null
)

const handleTime = (data: {
	hours: number
	minutes: number
	seconds: number
	meridiem: string
	militaryTime: number
}) => {
	time.value = data
}
</script>

<template>
	<div class="stonecrop-demo">
		<ADateTime :default-hours="9" :default-minutes="30" use-seconds @get-time="handleTime" />
		<p class="stonecrop-demo__state">
			<code>get-time</code> payload: <strong>{{ time }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
