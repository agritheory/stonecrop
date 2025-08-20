<template>
	<div class="record-actions">
		<button @click="handleEdit" class="btn-secondary btn-sm">Edit</button>
		<button @click="handleDelete" class="btn-danger btn-sm">Delete</button>
	</div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

type Props = {
	value?: { recordId: string; doctype: string }
}

type DesktopMethods = {
	openRecord?: (recordId: string) => void
	handleDelete?: (recordId?: string) => void
}

const props = defineProps<Props>()

// Inject the parent Desktop component's methods
const desktopMethods = inject<DesktopMethods>('desktopMethods')

const handleEdit = () => {
	if (props.value?.recordId && desktopMethods?.openRecord) {
		desktopMethods.openRecord(props.value.recordId)
	}
}

const handleDelete = () => {
	if (props.value?.recordId && desktopMethods?.handleDelete) {
		desktopMethods.handleDelete(props.value.recordId)
	}
}
</script>

<style scoped>
.record-actions {
	display: flex;
	gap: 0.5rem;
}

.btn-sm {
	padding: 0.25rem 0.5rem;
	font-size: 0.875rem;
}

.btn-secondary {
	background-color: #6b7280;
	color: white;
	border: none;
	border-radius: 0.375rem;
	cursor: pointer;
}

.btn-secondary:hover {
	background-color: #4b5563;
}

.btn-danger {
	background-color: #dc2626;
	color: white;
	border: none;
	border-radius: 0.375rem;
	cursor: pointer;
}

.btn-danger:hover {
	background-color: #b91c1c;
}
</style>
