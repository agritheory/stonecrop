<template>
	<footer class="beam__actionfooter">
		<span class="footer-action-wrapper">
			<button class="footer-action" @click="handleFooterAction">
				<slot />
			</button>
		</span>
	</footer>
</template>
<script>
export default {
	name: 'ActionFooter',
	methods: {
		handleFooterAction() {
			this.$emit('click')
		},
	},
}
</script>
