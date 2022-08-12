<template>
	<a :href="to" class="beam__listanchor">
		<slot />
	</a>
</template>
<script>
export default {
	name: 'ListAnchor',
	props: {
		to: {
			type: String,
			required: false,
			default: '',
		},
	},
}
</script>
<style scoped lang="scss"></style>
