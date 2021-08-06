<template>
	<div>
		Would you like to continue?<br />
		<button
			@click="confirmModal"
		>Yes</button>
		<br>
		<button
			@click="closeModal"
		>No</button>
	</div>
</template>
<script>
export default {
	name: "ConfirmDialog",
	methods: {
		confirmModal(){
			this.$emit('confirmmodal')
		},
		closeModal(){
			this.$emit('closemodal')
		}
	}
}
</script>
<style scoped>

</style>
