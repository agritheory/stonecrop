<script setup lang="ts">
import type { HSTNode, HSTOperation } from '@stonecrop/stonecrop'

interface Props {
	hstStore: HSTNode | null | undefined
	operations: HSTOperation[]
	currentIndex: number
	canUndo: boolean
	canRedo: boolean
}

defineProps<Props>()
</script>

<template>
	<ClientOnly>
		<div class="hst-sidebar">
			<div class="sidebar-section">
				<h3 class="sidebar-title">State Tree</h3>
				<div class="sidebar-content">
					<HSTStateViewer v-if="hstStore" :store="hstStore" />
				</div>
			</div>

			<div class="sidebar-section">
				<h3 class="sidebar-title">Operation Log</h3>
				<div class="sidebar-content sidebar-scroll">
					<HSTOperationLog
						:show="true"
						:operations="operations"
						:current-index="currentIndex"
						:can-undo="canUndo"
						:can-redo="canRedo"
						:inline="true" />
				</div>
			</div>
		</div>
	</ClientOnly>
</template>

<style scoped>
.hst-sidebar {
	display: flex;
	flex-direction: column;
	gap: 0;
	position: sticky;
	top: 0;
	align-self: stretch;
	min-height: 100vh;
	max-height: 100vh;
	overflow: hidden;
	background: var(--sc-gray-5);
	border-left: 3px solid var(--sc-gray-10);
	padding: 1.5rem;
}

.sidebar-section {
	background: var(--sc-form-background);
	border-radius: 0.25rem;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	margin-bottom: 1.5rem;
	border: 1px solid var(--sc-gray-10);
}

.sidebar-section:last-child {
	margin-bottom: 0;
}

.sidebar-section:first-child {
	flex: 0 0 auto;
	max-height: 300px;
}

.sidebar-section:last-child {
	flex: 1 1 auto;
	min-height: 0;
}

.sidebar-title {
	padding: 1rem 1.5rem;
	margin: 0;
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--sc-gray-80);
	border-bottom: 1px solid var(--sc-gray-10);
	background: var(--sc-gray-5);
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.sidebar-content {
	padding: 1rem;
	flex: 1;
	min-height: 0;
	overflow: auto;
	background: var(--sc-form-background);
}

@media (max-width: 1024px) {
	.hst-sidebar {
		position: relative;
		top: 0;
		max-height: none;
		border-left: none;
		border-top: 3px solid var(--sc-gray-10);
		background: var(--sc-gray-5);
	}
}
</style>
