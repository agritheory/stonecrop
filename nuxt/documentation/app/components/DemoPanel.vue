<script setup lang="ts">
import { ref } from 'vue'

const showCode = ref(false)
</script>

<template>
	<div class="demo-panel">
		<div class="demo-panel__preview">
			<slot />
		</div>
		<button type="button" class="demo-panel__toggle" :aria-expanded="showCode" @click="showCode = !showCode">
			<span class="demo-panel__toggle-icon">&lt;/&gt;</span>
			{{ showCode ? 'Hide Code' : 'View Code' }}
		</button>
		<div v-show="showCode" class="demo-panel__code">
			<slot name="code" />
		</div>
	</div>
</template>
