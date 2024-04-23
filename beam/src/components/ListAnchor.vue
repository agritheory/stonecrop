<template>
	<a :href="to" class="beam__listanchor">
		<slot />
	</a>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		to?: string
	}>(),
	{ to: '' }
)
</script>
