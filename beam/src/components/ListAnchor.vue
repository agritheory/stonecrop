<template>
	<a :href="to" class="beam_list-anchor">
		<slot />
	</a>
</template>

<script setup lang="ts">
const { to = '' } = defineProps<{ to?: string }>()
</script>
