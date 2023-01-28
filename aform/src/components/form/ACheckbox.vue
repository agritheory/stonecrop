<template>
	<div>
		<span>
			<input v-model="checkbox" type="checkbox" :id="uuid" :disabled="readOnly" :required="required" @input="update" />
			<!-- <output name="mask" :for="uuid" v-mask="checked"> {{ mask || "" }} </output> -->
		</span>
		<label :for="uuid">{{ label }} </label>
		<p v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, ref } from 'vue'

import { FormSchema } from 'types'

export default defineComponent({
	name: 'ACheckbox',
	props: {
		schema: {
			type: Object as PropType<FormSchema>,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		value: {
			type: null as unknown as PropType<string | number>,
		},
		mask: {
			type: String,
		},
		required: {
			type: Boolean,
		},
		readOnly: {
			type: Boolean,
		},
		uuid: {
			type: String,
		},
		validation: {
			type: Object,
			default: () => ({ errorMessage: '&nbsp;' }),
		},
	},
	setup(props, context) {
		const checkbox = ref(props.value)
		let checked = ref()

		// TODO: (state) replace with state management
		const locale = inject<string>('locale', '')

		const update = (event: InputEvent) => {
			const value = (event.target as HTMLInputElement).value
			context.emit('update:value', value)
		}

		return { checkbox, checked, update }
	},
})
</script>

<style scoped>
div {
	display: inline-block;
	min-width: 40ch;
	border: 1px solid transparent;
	padding: 0rem;
	margin: 0rem;
	margin-right: 1ch;
}

span {
	display: inline-block;
	min-width: calc(100% - 1ch);
	outline: 1px solid transparent;
	border: 1px solid var(--input-border-color);
	padding: 1ch 0.5ch 0.5ch 1ch;
	margin: calc(1.15rem / 2) 0 0 0;
	height: 1.15rem;
	border-radius: 0.25rem;
}

/* output {
	width: calc(100% - 1ch);
} */

/* input[type='checkbox'] {
  display:none;
}

input[type='checkbox'] + span:after {
  content:"⬡";
	padding: 1ch 0.5ch 0.5ch 1ch;
	font-size: 120%;
}
input[type='checkbox']:checked + span:after {
  content:"⬣";
	padding: 1ch 0.5ch 0.5ch 1ch;
	font-size: 120%;
} */

p,
label {
	color: var(--input-label-color);
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

span:hover {
	border: 1px solid var(--input-active-border-color);
}

span:hover + label {
	color: var(--input-active-label-color);
}
</style>
