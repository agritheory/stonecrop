<template>
	<div class="beam__modal-confirm">
		<h2>Would you like to continue?</h2>
		<button class="btn" @click="confirmModal">Yes</button>
		<button class="btn" @click="closeModal">No</button>
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
