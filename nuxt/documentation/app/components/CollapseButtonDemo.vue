<script setup lang="ts">
import { ref } from 'vue'
// CollapseButton is not exported from @stonecrop/aform's public entry point — it's an internal
// building block used by AFieldset. This demo reaches it with a relative import into the
// package's source tree, which only works inside this monorepo (see collapse-button.md).
import CollapseButton from '../../../../aform/src/components/base/CollapseButton.vue'

const collapsed = ref(false)

function toggle() {
	collapsed.value = !collapsed.value
}
</script>

<template>
	<div class="stonecrop-demo">
		<div class="stonecrop-demo__legend" @click="toggle">
			<span>Billing Address</span>
			<CollapseButton :collapsed="collapsed" />
		</div>
		<p class="stonecrop-demo__state">
			<code>collapsed</code> value: <strong>{{ collapsed }}</strong>
		</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__legend {
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: pointer;
	font-weight: 600;
}

.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
