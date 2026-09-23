<script setup lang="ts">
import { ref } from 'vue'
import { ADateSelection } from '@stonecrop/aform'

// Direct import, not via AForm — AForm resolves schema fields by string name through Vue's
// dynamic component registry, which needs @stonecrop/aform's `install` plugin registered on
// the app instance first. Direct imports skip that requirement, same as CheckboxDemo.vue.
const selectedDate = ref<Date | null>(null)
const selectedTime = ref<{ hours: number; minutes: number; seconds: number; meridiem: string } | null>(null)

const handleDate = (data: { selected: Date; start?: Date | null; end?: Date | null }) => {
	selectedDate.value = data.selected
}

const handleTime = (data: { hours: number; minutes: number; seconds: number; meridiem: string }) => {
	selectedTime.value = data
}
</script>

<template>
	<div class="stonecrop-demo">
		<ADateSelection :select-range="false" @get-date="handleDate" @get-time="handleTime" />
		<p class="stonecrop-demo__state">
			Selected date: <strong>{{ selectedDate?.toLocaleDateString() }}</strong
			><br />
			Selected time: <strong>{{ selectedTime }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
