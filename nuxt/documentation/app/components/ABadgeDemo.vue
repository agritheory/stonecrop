<script setup lang="ts">
import { ABadge } from '@stonecrop/aform'
import type { BadgeVariant } from '@stonecrop/schema'

const variants: BadgeVariant[] = ['neutral', 'success', 'warning', 'danger', 'brand']
</script>

<template>
	<div class="stonecrop-demo abadge-demo-row">
		<ABadge
			v-for="variant in variants"
			:key="variant"
			:label="variant"
			:variant="variant"
			presentation="input-accent" />
	</div>
</template>

<style scoped>
.abadge-demo-row {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
}

.abadge-demo-row > * {
	width: auto;
	flex: 0 0 auto;
}
</style>
