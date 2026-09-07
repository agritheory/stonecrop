<script setup lang="ts">
import { ref } from 'vue'
import { ABadge, ADropdown } from '@stonecrop/aform'

// A Select-style choice → badge variant map — the same shape ADropdown/ATable use to color-code
// stored values without every call site repeating variant/color logic.
const options = {
	Open: 'danger',
	'In Progress': 'warning',
	Closed: 'success',
}

const status = ref('Open')
</script>

<template>
	<div class="stonecrop-demo abadge-options-demo">
		<ADropdown v-model="status" label="Status" :options="Object.keys(options)" mode="edit" />
		<ABadge :value="status" :options="options" presentation="input-accent" />
	</div>
</template>

<style scoped>
.abadge-options-demo {
	display: flex;
	align-items: center;
	gap: 1.5rem;
}

.abadge-options-demo :deep(.abadge) {
	width: auto;
}
</style>
