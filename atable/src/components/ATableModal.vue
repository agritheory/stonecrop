<script setup lang="ts">
/** @deprecated Use {@link ACellShell}. Kept for existing imports and docs. */
import { createTableStore } from '../stores/table'
import ACellShell from './ACellShell.vue'

defineProps<{ store: ReturnType<typeof createTableStore> }>()
</script>

<template>
	<ACellShell :store="store">
		<slot />
	</ACellShell>
</template>
