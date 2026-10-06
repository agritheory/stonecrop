<script setup lang="ts">
/** @deprecated Use {@link ACellShell}. Kept for existing imports and docs. */
import type { TableStore } from '../types'
import ACellShell from './ACellShell.vue'

defineProps<{ store: TableStore }>()
</script>

<template>
	<ACellShell :store="store">
		<slot />
	</ACellShell>
</template>
