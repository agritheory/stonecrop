<template>
	<div class="doctype-actions">
		<button @click="handleView" class="btn-primary btn-sm">View Records</button>
	</div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

type Props = {
	value?: { doctype: string }
}

type DesktopMethods = {
	navigateToDoctype?: (doctype: string) => void
}

const props = defineProps<Props>()

// Inject the parent Desktop component's methods
const desktopMethods = inject<DesktopMethods>('desktopMethods')

const handleView = () => {
	if (props.value?.doctype && desktopMethods?.navigateToDoctype) {
		desktopMethods.navigateToDoctype(props.value.doctype)
	}
}
</script>

<style scoped>
.doctype-actions {
	display: flex;
	gap: 0.5rem;
}

.btn-sm {
	padding: 0.25rem 0.5rem;
	font-size: 0.875rem;
}

.btn-primary {
	background-color: #3b82f6;
	color: white;
	border: none;
	border-radius: 0.375rem;
	cursor: pointer;
}

.btn-primary:hover {
	background-color: #2563eb;
}
</style>
