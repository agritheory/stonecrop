<template>
	<p class="beam_metadata_heading">
		{{ label }}: <span :class="{ 'beam--alert': !complete }" class="beam--normal">{{ statusMessage }}</span>
	</p>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const {
	label = 'Status',
	progressMessage = 'In Progress',
	completeMessage = 'Complete',
	complete = false,
} = defineProps<{
	label?: string
	progressMessage?: string
	completeMessage?: string
	complete?: boolean
}>()

const statusMessage = computed(() => (complete ? completeMessage : progressMessage))
</script>
