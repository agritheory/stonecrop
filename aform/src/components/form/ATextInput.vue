<template>
	<div>
		<input v-model="inputText" :required="required" :id="uuid" :disabled="readOnly" @input="update" v-mask="mask" />
		<label :for="uuid">{{ label }} </label>
		<p v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script lang="ts">
import { defineComponent, DirectiveBinding, ref } from 'vue'

export default defineComponent({
	name: 'ATextInput',
	props: {
		value: { required: false },
		required: {
			type: Boolean,
		},
		label: {
			type: String,
			required: true,
		},
		readOnly: {
			type: Boolean,
		},
		uuid: {
			type: String,
		},
		mask: {
			type: String,
			default: '##/##/####',
		},
		validation: {
			type: Object,
			default: () => ({ errorMessage: '&nbsp;' }),
		},
	},
	setup(props, context) {
		const inputText = ref(props.value)
		const update = (event: InputEvent) => {
			const value = (event.target as HTMLInputElement).value
			context.emit('update:value', value)
		}

		return { inputText, update }
	},
	directives: {
		mask: (el: HTMLInputElement, binding: DirectiveBinding<string>, vnode, prevVnode) => {
			const mask = binding.value
			const reverseMask = mask.split('').reverse().join('')
			const inputText = el.value

			// let replacement = reverseMask
			// for (const char of inputText) {
			// 	if (!['#', '/'].includes(char)) {
			// 		replacement = replacement.replace('#', char)
			// 	}
			// }

			// el.value = replacement.split('').reverse().join('')
		},
	},
})
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
