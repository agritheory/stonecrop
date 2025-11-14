<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { HSTOperation } from '@stonecrop/stonecrop'

interface Props {
	hstStore: ComputedRef<any> | null | undefined
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
	background: #f3f4f6;
	border-left: 3px solid #e5e7eb;
	padding: 1.5rem;
}

.sidebar-section {
	background: white;
	border-radius: 0.5rem;
	box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	margin-bottom: 1.5rem;
	border: 1px solid #e5e7eb;
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
	color: #374151;
	border-bottom: 1px solid #e5e7eb;
	background: #f9fafb;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.sidebar-content {
	padding: 1rem;
	flex: 1;
	min-height: 0;
	overflow: auto;
	background: white;
}

@media (max-width: 1024px) {
	.hst-sidebar {
		position: relative;
		top: 0;
		max-height: none;
		border-left: none;
		border-top: 3px solid #e5e7eb;
		background: #f9fafb;
	}
}
</style>
