<template>
	<Teleport to="amodal">
		<div
			class="amodal"
			:style="{
				top: target.position.top,
				left: target.position.left,
				width: target.position.width,
				height: target.position.height,
			}"
			v-if="open">
			<p>Hello from the modal!</p>
			<button @click="open = false">Close</button>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import { Component, ref } from 'vue'

import { useAModal } from '@/modal'

const open = ref(false)
const props = withDefaults(
	defineProps<{
		target?: Record<string, any>
		component?: string | Component
	}>(),
	{
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
