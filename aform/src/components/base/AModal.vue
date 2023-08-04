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
<script lang="ts">
import { ref, defineComponent, withDefaults, defineProps } from 'vue'
import { useAModal } from '../../modal'

const open = ref(false)

const props = withDefaults(
	defineProps<{
		open: boolean
		target: Object
		component: string
	}>(),
	{
		target: {
			position: {
				top: 0,
				left: 0,
				width: 0,
				height: 0,
			},
		},
	}
)

export default defineComponent({
	setup(props) {
		const { open, target, component } = useAModal(props.open, props.target, props.component)
		console.log(open, target, component)
		return { open, target, component }
	},
})
</script>
<style>
.amodal {
	border: 1px solid aqua;
	min-height: 1.15rem;
}
</style>
