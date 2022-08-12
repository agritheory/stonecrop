<template>
	<div id="scan_input"></div>
</template>
<script>
export default {
	name: 'ScanInput',
	data() {
		return {
			barcode: '',
		}
	},
	methods: {
		handleScanInput(event) {
			if (event.target.tagName !== 'INPUT') {
				if (event.key !== 'Enter') {
					this.barcode += `${event.key}`
				} else {
					this.$emit('scaninput', this.barcode)
					this.barcode = ''
				}
			}
		},
	},
	mounted() {
		document.addEventListener('keypress', event => {
			this.handleScanInput(event)
		})
	},
	destroyed() {
		window.removeEventListener('keypress', event => {
			this.handleScanInput(event)
		})
	},
}
</script>
<style scoped></style>
