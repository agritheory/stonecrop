<template>
	<label class="container">
		<input type="checkbox" :checked="value" @input="handleInput" tabindex="-1" />
		<span class="checkmark" tabindex="0"></span>
	</label>
</template>
<script>
export default {
	// make this v-model sensitive from parent
	name: 'ItemCheck',
	props: {
		value: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	data() {
		return {
			checked: this.value,
		}
	},
	methods: {
		handleInput(e) {
			this.$emit('input', this.checked)
		},
	},
}
</script>
<style scoped>
.container {
	display: block;
	position: relative;
	padding-left: 2.5ch;
	margin-top: 0.5rem;
	cursor: pointer;
	font-size: 2rem;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

/* hide default checkbox */
.container input {
	position: absolute;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
}

.checkmark {
	position: absolute;
	top: 0;
	left: 0;
	height: 2rem;
	width: 2rem;
	background-color: #eee;
	outline: 2px solid transparent;
}

.checkmark:focus {
	outline: 2px solid $brand-primary;
}

.container:hover input ~ .checkmark {
	background-color: #ccc;
}

.container input:checked ~ .checkmark {
	background-color: $brand-dark;
}

.checkmark:after {
	content: '';
	position: absolute;
	display: none;
}

.container input:checked ~ .checkmark:after {
	display: block;
}

.container .checkmark:after {
	left: 0.75rem;
	top: 0.25rem;
	width: 0.5rem;
	height: 1rem;
	border: solid $brand-primary;
	border-width: 0 3px 3px 0;
	-webkit-transform: rotate(45deg);
	-ms-transform: rotate(45deg);
	transform: rotate(45deg);
}
</style>
