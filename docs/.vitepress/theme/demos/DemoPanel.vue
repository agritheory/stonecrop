<script setup lang="ts">
import { ref } from 'vue'

const showCode = ref(false)
</script>

<template>
	<div class="demo-panel">
		<span class="demo-panel__label">Preview</span>
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

<style scoped>
.demo-panel {
	margin: 1.5rem 0;
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	overflow: hidden;
	background: var(--vp-c-bg-soft);
}

.demo-panel__label {
	display: block;
	padding: 0.75rem 1.25rem 0;
	font-size: 0.7rem;
	font-weight: 600;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--vp-c-text-3);
}

.demo-panel__preview {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 8rem;
	padding: 2rem 1.5rem;
}

.demo-panel__toggle {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	width: 100%;
	padding: 0.6rem 1.25rem;
	border: none;
	border-top: 1px solid var(--vp-c-divider);
	background: var(--vp-c-bg);
	color: var(--vp-c-text-2);
	font-size: 0.8rem;
	font-weight: 500;
	cursor: pointer;
}

.demo-panel__toggle:hover {
	color: var(--vp-c-brand-1);
	background: var(--vp-c-bg-mute);
}

.demo-panel__toggle-icon {
	font-family: var(--st-font-mono, monospace);
	font-size: 0.75rem;
}

.demo-panel__code {
	border-top: 1px solid var(--vp-c-divider);
}

.demo-panel__code :deep(div[class*='language-']) {
	margin: 0;
	border-radius: 0;
}

.demo-panel__code :deep(.vp-doc div[class*='language-']) {
	margin: 0;
}
</style>
