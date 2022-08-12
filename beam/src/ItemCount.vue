<template>
	<div class="beam__itemcount">
		<span
			:contenteditable="editable"
			:style="{ color: countColor === true ? '#3c5014' : '#e63c28' }"
			@input="handleInput($event)"
			@click="handleInput($event)"
			>{{ count }}</span
		>
		<span>/{{ denominator }}</span
		><span v-if="uom">&nbsp; {{ uom }}</span>
	</div>
</template>
<script>
export default {
	name: 'ItemCount',
	props: {
		value: {
			type: Number,
			required: false,
			default: 0,
		},
		denominator: {
			type: Number,
			required: true,
		},
		uom: {
			type: String,
			required: false,
			default: null,
		},
		editable: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	data() {
		return {
			count: this.value,
		}
	},
	methods: {
		handleInput(event) {
			event.preventDefault()
			event.stopPropagation()
			this.count = Number(event.target.innerHTML.replace(/[^0-9]/g, ''))
			this.$emit('input', this.count)
		},
	},
	computed: {
		countColor() {
			return this.count === this.denominator
		},
	},
	watch: {
		value() {
			this.count = this.value
		},
	},
}
</script>
