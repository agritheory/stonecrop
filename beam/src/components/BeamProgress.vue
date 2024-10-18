<template>
	<p class="beam_metadata_heading">
		{{ label }}: <span :class="{ 'beam--alert': !complete }" class="beam--normal">{{ statusMessage }}</span>
	</p>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
	label: {
		type: String,
		default: 'Status',
	},
	progressMessage: {
		type: String,
		default: 'In Progress',
	},
	completeMessage: {
		type: String,
		default: 'Complete',
	},
	complete: Boolean,
})

const statusMessage = computed(() => {
	return props.complete ? props.completeMessage : props.progressMessage
})
</script>
