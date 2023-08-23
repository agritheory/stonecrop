<template>
	<Teleport to="body">
		<div
			v-if="open"
			class="amodal"
			:style="{
				top: target.position.top,
				left: target.position.left,
				width: target.position.width,
				height: target.position.height,
			}">
			<component v-if="component" :is="component"></component>
			<p v-else>Hello from the modal!</p>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

import { useAModal } from '@/modal'

const props = withDefaults(
	defineProps<{
		open?: boolean
		target?: Record<string, any>
		component?: string | Component
	}>(),
	{
		open: false,
		target: () => {
			return {
				position: {
					top: 0,
					left: 0,
					width: 0,
					height: 0,
				},
			}
		},
	}
)

const { target, component } = useAModal(props.target, props.component)
</script>

<style>
.amodal {
	border: 1px solid aqua;
	min-height: 1.15rem;
}
</style>
