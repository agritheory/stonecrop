<template>
	<div class="beam__modal-confirm">
		<h2>Would you like to continue?</h2>
		<button class="btn btn--dark" @click="confirmModal">Yes</button>
		<button class="btn btn--dark" @click="closeModal">No</button>
	</div>
</template>
<script>
export default {
	name: 'ConfirmDialog',
	methods: {
		confirmModal() {
			this.$emit('confirmmodal')
		},
		closeModal() {
			this.$emit('closemodal')
		},
	},
}
</script>
