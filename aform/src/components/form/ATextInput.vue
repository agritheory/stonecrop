<template>
	<div>
		<input :value="value" :required="required" :id="uuid" :disabled="readOnly" @input="update($event.target.value)" />
		<label :for="uuid">{{ label }} </label>
		<p v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script>
export default {
	name: 'ATextInput',
	props: {
		value: { required: false },
		required: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
			required: true,
		},
		readOnly: {
			type: Boolean,
			default: false,
		},
		uuid: {
			type: Number,
			default: 0,
		},
		validation: {
			type: Object,
			default: () => ({ errorMessage: '&nbsp;' }),
		},
	},
	methods: {
		update(value) {
			this.$emit('update:value', value)
		},
	},
}
</script>
<style scoped>
div {
	min-width: 40ch;
	border: 1px solid transparent;
	padding: 0rem;
	margin: 0rem;
	margin-right: 1ch;
}

input {
	width: calc(100% - 1ch);
	outline: 1px solid transparent;
	border: 1px solid var(--primary-color);
	padding: 1ch 0.5ch 0.5ch 1ch;
	margin: calc(1.15rem / 2) 0 0 0;
	min-height: 1.15rem;
	/* border-radius: 0.25rem;  don't like, but it's here */
}
p,
label {
	display: block;
	min-height: 1.15rem;
	padding: 0rem;
	margin: 0rem;
	border: 1px solid transparent;
	margin-bottom: 0.25rem;
}

p {
	width: 100%;
	color: red;
	font-size: 85%;
}

label {
	z-index: 2;
	font-size: 80%;
	position: absolute;
	background: white;
	margin: calc(-1.5rem - calc(2.15rem / 2)) 0 0 1ch;
	padding: 0 0.25ch 0 0.25ch;
}

input:focus {
	outline: 1px solid var(--primary-color);
}

input:focus + label {
	color: var(--primary-color);
	font-weight: bold;
}
</style>
