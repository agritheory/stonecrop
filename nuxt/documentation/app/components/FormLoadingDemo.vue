<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AFormLoading } from '@stonecrop/aform'

const isLoading = ref(true)
let timer: ReturnType<typeof setTimeout>

function play() {
	isLoading.value = true
	clearTimeout(timer)
	timer = setTimeout(() => {
		isLoading.value = false
	}, 2500)
}

onMounted(play)
</script>

<template>
	<div class="stonecrop-demo">
		<AFormLoading v-if="isLoading">Loading</AFormLoading>
		<div v-else class="stonecrop-demo__state">
			<p>Data loaded.</p>
			<button type="button" @click="play">Replay</button>
		</div>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 0;
	font-size: 0.85em;
}

.stonecrop-demo__state button {
	margin-top: 0.5rem;
}
</style>
