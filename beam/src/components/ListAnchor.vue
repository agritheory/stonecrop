<template>
	<a :href="to" class="beam__listanchor">
		<slot />
	</a>
</template>

<script setup lang="ts">
const { to = '' } = defineProps<{ to?: string }>()
</script>
